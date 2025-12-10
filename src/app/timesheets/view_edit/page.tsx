"use client";

import type { FC, JSX } from "react";
import type { WeeklyRow } from "@/types";

import { useMemo, useState } from "react";

import { NavSide, Nav, ProtectedRoute, UserSelector, Error, Loading, TSDailyView, TSWeeklyView, TSCalendarView, Calendar } from "@/components";
import { useFetch } from "@/hooks";
import { API_ENPOINT_V1, GenerateCalendar } from "@/../config";

const viewOptions: Array<"daily" | "weekly" | "calendar"> = ["daily", "weekly", "calendar"];

type WeekDayDisplay = { key: string; label: string; month: string; date: number; value: Date };
type DailyRowData = { id: string; project: string; type?: string; activity: string; duration: string; durationSeconds: number; color: string };
type DateRange = { start: Date; end: Date };

const DAY_KEYS: string[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const startOfDay = (date: Date): Date => {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
};

const getWeekStart = (date: Date): Date => {
	const d = startOfDay(date);
	const day: number = d.getDay();
	const diff: number = day === 0 ? -6 : 1 - day; // Monday as start of week
	d.setDate(d.getDate() + diff);
	return d;
};

const addDays = (date: Date, days: number): Date => {
	const d = new Date(date);
	d.setDate(d.getDate() + days);
	return d;
};

const formatDuration = (seconds: number): string => {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);
	return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const intervalToSeconds = (interval: any): number => {
	if (!interval) return 0;
	if (typeof interval === "number") return interval;

	if (typeof interval === "string") {
		const parts = interval.split(":").map(Number);
		if (parts.length === 3 && parts.every(n => !Number.isNaN(n))) {
			return parts[0] * 3600 + parts[1] * 60 + parts[2];
		}
	}

	const hours = Number(interval.hour ?? interval.hours ?? interval.h ?? 0);
	const minutes = Number(interval.minutes ?? interval.mins ?? interval.minute ?? interval.min ?? 0);
	const seconds = Number(interval.seconds ?? interval.secs ?? interval.second ?? interval.sec ?? 0);

	return hours * 3600 + minutes * 60 + seconds;
};

const getColorForLabel = (label: string): string => {
	const value = (label || "").toLowerCase();
	if (value.includes("break")) return "bg-emerald-500";
	if (value.includes("lunch")) return "bg-lime-600";
	if (value.includes("bathroom")) return "bg-blue-600";
	if (value.includes("meeting")) return "bg-teal-500";
	if (value.includes("coaching")) return "bg-orange-500";
	if (value.includes("cordoba")) return "bg-fuchsia-500";

	const palette = ["bg-sky-500", "bg-indigo-500", "bg-amber-500", "bg-rose-500", "bg-cyan-600", "bg-purple-500"];
	const hash = value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
	return palette[hash % palette.length];
};

const buildWeekDays = (start: Date): WeekDayDisplay[] => {
	const base = startOfDay(start);
	return Array.from({ length: 7 }, (_, index) => {
		const current = addDays(base, index);
		const key = DAY_KEYS[current.getDay()];
		return {
			key,
			label: current.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
			month: current.toLocaleDateString("en-US", { month: "short" }),
			date: current.getDate(),
			value: current
		};
	});
};

const extractDayEntries = (record: any): Array<{ date: Date; seconds: number }> => {
	const entries: Array<{ date: Date; seconds: number }> = [];
	const candidateArrays = [record?.days, record?.dates, record?.entries, record?.per_day, record?.perDate];

	candidateArrays.forEach(list => {
		if (!Array.isArray(list)) return;
		list.forEach((item: any) => {
			const dateValue = item?.date ?? item?.day ?? item?.date_time ?? item?.timestamp ?? item?.created_at;
			const parsedDate = dateValue ? startOfDay(new Date(dateValue)) : null;
			const seconds = intervalToSeconds(item?.total_interval ?? item?.interval ?? item?.total ?? item);

			if (parsedDate && !Number.isNaN(parsedDate.getTime()) && seconds > 0) {
				entries.push({ date: parsedDate, seconds });
			}
		});
	});

	if (record?.entries && typeof record.entries === "object" && !Array.isArray(record.entries)) {
		Object.entries(record.entries).forEach(([key, value]) => {
			const parsedDate = startOfDay(new Date(key));
			const seconds = intervalToSeconds(value);
			if (!Number.isNaN(parsedDate.getTime()) && seconds > 0) {
				entries.push({ date: parsedDate, seconds });
			}
		});
	}

	const singleDateValue = record?.date ?? record?.day ?? record?.timestamp ?? record?.created_at;
	if (singleDateValue) {
		const parsedDate = startOfDay(new Date(singleDateValue));
		const seconds = intervalToSeconds(record?.total_interval ?? record?.interval ?? record?.total);
		if (!Number.isNaN(parsedDate.getTime()) && seconds > 0) {
			entries.push({ date: parsedDate, seconds });
		}
	}

	return entries;
};

const transformTimeData = (
	records: any[],
	weekDays: WeekDayDisplay[],
	rangeStart: Date,
	rangeEnd: Date
): {
	weeklyRows: WeeklyRow[];
	dayTotals: Record<string, string>;
	weeklyTotalSeconds: number;
	weeklyTotalFormatted: string;
} => {
	const rowsMap = new Map<
		string,
		{
			id: string;
			project: string;
			type: string;
			color: string;
			entriesSeconds: Record<string, number>;
			totalSeconds: number;
		}
	>();

	const dayTotalsSeconds: Record<string, number> = {};
	weekDays.forEach(day => {
		dayTotalsSeconds[day.key] = 0;
	});

	let weeklyTotalSeconds = 0;

	const inRange = (date: Date): boolean => date >= rangeStart && date <= rangeEnd;

	(records || []).forEach((record: any) => {
		const project: string = record?.project ?? record?.state ?? record?.activity ?? "Work item";
		const type: string = record?.type ?? record?.category ?? record?.task ?? record?.description ?? "";
		const color: string = getColorForLabel(project);
		const id: string = project.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "item";

		const row =
			rowsMap.get(project) ??
			({
				id,
				project,
				type,
				color,
				entriesSeconds: {},
				totalSeconds: 0
			} as {
				id: string;
				project: string;
				type: string;
				color: string;
				entriesSeconds: Record<string, number>;
				totalSeconds: number;
			});

		const perDayEntries = extractDayEntries(record).filter(entry => inRange(entry.date));

		if (perDayEntries.length > 0) {
			perDayEntries.forEach(({ date, seconds }) => {
				const dayKey = DAY_KEYS[date.getDay()];
				row.entriesSeconds[dayKey] = (row.entriesSeconds[dayKey] || 0) + seconds;
				row.totalSeconds += seconds;
				dayTotalsSeconds[dayKey] = (dayTotalsSeconds[dayKey] || 0) + seconds;
				weeklyTotalSeconds += seconds;
			});
		} else {
			const seconds = intervalToSeconds(record?.total_interval ?? record?.interval ?? record?.total);
			if (seconds > 0) {
				row.totalSeconds += seconds;
				weeklyTotalSeconds += seconds;
			}
		}

		rowsMap.set(project, row);
	});

	const weeklyRows: WeeklyRow[] = Array.from(rowsMap.values()).map(row => ({
		id: row.id,
		project: row.project,
		type: row.type,
		color: row.color,
		entries: Object.fromEntries(weekDays.map(day => [day.key, row.entriesSeconds[day.key] ? formatDuration(row.entriesSeconds[day.key]) : "-"])),
		total: formatDuration(row.totalSeconds)
	}));

	const dayTotals: Record<string, string> = Object.fromEntries(weekDays.map(day => [day.key, dayTotalsSeconds[day.key] ? formatDuration(dayTotalsSeconds[day.key]) : "-"]));

	return {
		weeklyRows,
		dayTotals,
		weeklyTotalSeconds,
		weeklyTotalFormatted: formatDuration(weeklyTotalSeconds)
	};
};

const buildDailyEntries = (records: any[], rangeStart: Date, rangeEnd: Date): { entries: DailyRowData[]; dailyTotalSeconds: number; dailyTotalFormatted: string } => {
	const rowsMap = new Map<
		string,
		{
			id: string;
			project: string;
			type: string;
			color: string;
			activity: string;
			durationSeconds: number;
		}
	>();

	const start = startOfDay(rangeStart);
	const end = startOfDay(rangeEnd);

	const inRange = (date: Date): boolean => {
		const d = startOfDay(date);
		return d >= start && d <= end;
	};

	(records || []).forEach((record: any) => {
		const project: string = record?.project ?? record?.state ?? record?.activity ?? "Work item";
		const type: string = record?.type ?? record?.category ?? record?.task ?? record?.description ?? "";
		const color: string = getColorForLabel(project);
		const id: string = project.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "item";
		const activity: string = type || project;

		const perDayEntries = extractDayEntries(record).filter(entry => inRange(entry.date));
		const durationSeconds: number = perDayEntries.reduce((acc, entry) => acc + entry.seconds, 0);
		if (durationSeconds <= 0) return;

		const row =
			rowsMap.get(project) ??
			({
				id,
				project,
				type,
				color,
				activity,
				durationSeconds: 0
			} as {
				id: string;
				project: string;
				type: string;
				color: string;
				activity: string;
				durationSeconds: number;
			});

		row.durationSeconds += durationSeconds;
		rowsMap.set(project, row);
	});

	const entries: DailyRowData[] = Array.from(rowsMap.values()).map(row => ({
		id: `${row.id}-daily`,
		project: row.project,
		type: row.type,
		activity: row.activity,
		duration: formatDuration(row.durationSeconds),
		durationSeconds: row.durationSeconds,
		color: row.color
	}));

	const dailyTotalSeconds: number = entries.reduce((acc, item) => acc + item.durationSeconds, 0);

	return {
		entries,
		dailyTotalSeconds,
		dailyTotalFormatted: formatDuration(dailyTotalSeconds)
	};
};

const ViewEdit: FC = (): JSX.Element => {
	const [selectedUserId, setSelectedUserId] = useState<string>("");
	const [selectedView, setSelectedView] = useState<"daily" | "weekly" | "calendar">("daily");

	const initialWeekStart: Date = getWeekStart(new Date());
	const today: Date = startOfDay(new Date());

	const [dailyRange, setDailyRange] = useState<DateRange>({ start: today, end: today });
	const [weeklyRange, setWeeklyRange] = useState<DateRange>({ start: initialWeekStart, end: addDays(initialWeekStart, 6) });
	const [calendarRange, setCalendarRange] = useState<DateRange>({ start: initialWeekStart, end: addDays(initialWeekStart, 6) });

	const [showCalendarStart, setShowCalendarStart] = useState<boolean>(false);
	const [showCalendarEnd, setShowCalendarEnd] = useState<boolean>(false);

	const [userTimeData, setUserTimeData] = useState<any[]>([]);

	const { data: usersData, loading: usersLoading, error: usersError } = useFetch<any[]>(API_ENPOINT_V1.GET_PEOPLE);

	const currentRange: DateRange = useMemo(() => {
		if (selectedView === "weekly") return weeklyRange;
		if (selectedView === "calendar") return calendarRange;
		return dailyRange;
	}, [calendarRange, dailyRange, selectedView, weeklyRange]);

	const weekDaysWeekly = useMemo(() => buildWeekDays(weeklyRange.start), [weeklyRange.start]);
	const weekDaysCalendar = useMemo(() => buildWeekDays(calendarRange.start), [calendarRange.start]);

	const { weeklyRows, dayTotals, weeklyTotalFormatted } = useMemo(
		() => transformTimeData(userTimeData, weekDaysWeekly, weeklyRange.start, weeklyRange.end),
		[userTimeData, weekDaysWeekly, weeklyRange.end, weeklyRange.start]
	);

	const { weeklyTotalFormatted: calendarTotalFormatted } = useMemo(
		() => transformTimeData(userTimeData, weekDaysCalendar, calendarRange.start, calendarRange.end),
		[calendarRange.end, calendarRange.start, userTimeData, weekDaysCalendar]
	);

	const { entries: dailyEntries, dailyTotalFormatted } = useMemo(
		() => buildDailyEntries(userTimeData, dailyRange.start, dailyRange.end),
		[dailyRange.end, dailyRange.start, userTimeData]
	);

	const calendarDaysStart = useMemo(() => GenerateCalendar(currentRange.start), [currentRange.start, selectedView]);
	const calendarDaysEnd = useMemo(() => GenerateCalendar(currentRange.end), [currentRange.end, selectedView]);

	const dateRangeLabel = useMemo(() => {
		const formatDate = (date: Date) => date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
		return `${formatDate(currentRange.start)} - ${formatDate(currentRange.end)}`;
	}, [currentRange.end, currentRange.start]);

	const totalLabel = useMemo(() => {
		if (selectedView === "daily") return `Total: ${dailyTotalFormatted}`;
		if (selectedView === "weekly") return `Total: ${weeklyTotalFormatted}`;
		return `Total: ${calendarTotalFormatted || "0:00:00"}`;
	}, [calendarTotalFormatted, dailyTotalFormatted, selectedView, weeklyTotalFormatted]);

	const handleStartDateChange = (date: Date) => {
		if (selectedView === "weekly") {
			const start: Date = getWeekStart(date);
			setWeeklyRange({ start, end: addDays(start, 6) });
		} else if (selectedView === "calendar") {
			const start: Date = getWeekStart(date);
			setCalendarRange({ start, end: addDays(start, 6) });
		} else {
			const start: Date = startOfDay(date);
			setDailyRange(prev => ({ start, end: start > prev.end ? start : prev.end }));
		}
	};

	const handleEndDateChange = (date: Date) => {
		if (selectedView === "weekly") {
			const start: Date = getWeekStart(date);
			setWeeklyRange({ start, end: addDays(start, 6) });
		} else if (selectedView === "calendar") {
			const start: Date = getWeekStart(date);
			setCalendarRange({ start, end: addDays(start, 6) });
		} else {
			const end: Date = startOfDay(date);
			setDailyRange(prev => ({ start: end < prev.start ? end : prev.start, end }));
		}
	};

	if (usersLoading) return <Loading full />;
	if (usersError) return <Error />;

	return (
		<ProtectedRoute>
			<div className="flex min-h-screen bg-gray-50 text-gray-800">
				<NavSide />
				<div className="ml-24 flex flex-1 flex-col">
					<Nav title="Timesheets" />
					<main className="flex-1 space-y-8 p-8">
						<section className="flex flex-col gap-6">
							<div className="flex flex-wrap items-center justify-between gap-4">
								<h1 className="text-3xl font-normal text-gray-800">View & edit timesheets</h1>
								<div className="flex items-center gap-4">
									<div className="flex rounded-full bg-gray-100 p-1">
										{viewOptions.map(mode => (
											<button
												key={mode}
												onClick={() => setSelectedView(mode)}
												className={`min-w-[80px] rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all cursor-pointer ${
													selectedView === mode ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
												}`}
											>
												{mode}
											</button>
										))}
									</div>
								</div>
							</div>

							<div className="flex flex-wrap items-center justify-between gap-4">
								<div className="flex flex-wrap items-center gap-3">
									<Calendar
										selectedDate={currentRange.start}
										setShowCalendar={(val: boolean) => {
											setShowCalendarStart(val);
											if (val) setShowCalendarEnd(false);
										}}
										showCalendar={showCalendarStart}
										setSelectedDate={(date: Date) => {
											handleStartDateChange(date);
										}}
										calendarDays={calendarDaysStart}
									/>
									<Calendar
										selectedDate={currentRange.end}
										setShowCalendar={(val: boolean) => {
											setShowCalendarEnd(val);
											if (val) setShowCalendarStart(false);
										}}
										showCalendar={showCalendarEnd}
										setSelectedDate={(date: Date) => {
											handleEndDateChange(date);
										}}
										calendarDays={calendarDaysEnd}
									/>
									<div className="flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
										<span className="text-sm font-medium text-gray-700">{dateRangeLabel}</span>
									</div>
								</div>

								<div className="min-w-[280px]">
									<UserSelector
										users={usersData ?? []}
										selectedUserId={selectedUserId}
										onSelect={setSelectedUserId}
										startDate={currentRange.start}
										endDate={currentRange.end}
										setUserTimeData={setUserTimeData}
									/>
								</div>
							</div>
						</section>

						<section>
							{selectedView === "daily" && <TSDailyView totalLabel={totalLabel} entries={userTimeData} />}
							{selectedView === "weekly" && (
								<TSWeeklyView totalLabel={totalLabel} weekDays={weekDaysWeekly} rows={weeklyRows} dayTotals={dayTotals} weekTotal={weeklyTotalFormatted} />
							)}
							{selectedView === "calendar" && <TSCalendarView totalLabel={totalLabel} />}
						</section>
					</main>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default ViewEdit;
