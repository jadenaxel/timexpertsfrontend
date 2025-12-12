"use client";

import type { FC, JSX } from "react";
import type { DateRange, TimesheetView } from "@/types";

import { useCallback, useEffect, useMemo, useState } from "react";

import { NavSide, Nav, ProtectedRoute, UserSelector, Loading, TSDailyView, TSWeeklyView, TSCalendarView, Calendar } from "@/components";
import { useFetch } from "@/hooks";
import { API_ENPOINT_V1 } from "@/config";
import { getAuthHeader, GenerateCalendar, StartOfDay, GetWeekStart, AddDays, FormatDate, BuildWeekDays, TransformTimeData, BuildDailyEntries } from "@/utils";

const viewOptions: Array<"daily" | "weekly" | "calendar"> = ["daily", "weekly", "calendar"];

const DAY_KEYS: string[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

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

const toDateParam = (date: Date): string => StartOfDay(date).toISOString().split("T")[0];

const ViewEdit: FC = (): JSX.Element => {
	const [selectedUserId, setSelectedUserId] = useState<string>("");
	const [selectedView, setSelectedView] = useState<"daily" | "weekly" | "calendar">("daily");
	const [timeLoading, setTimeLoading] = useState<boolean>(false);
	const [timeError, setTimeError] = useState<string | null>(null);
	const [hasSelectedDates, setHasSelectedDates] = useState<boolean>(false);

	const initialWeekStart: Date = GetWeekStart(new Date(), StartOfDay);
	const today: Date = StartOfDay(new Date());

	const [dailyRange, setDailyRange] = useState<DateRange>({ start: today, end: today });
	const [weeklyRange, setWeeklyRange] = useState<DateRange>({ start: initialWeekStart, end: AddDays(initialWeekStart, 6) });
	const [calendarRange, setCalendarRange] = useState<DateRange>({ start: initialWeekStart, end: AddDays(initialWeekStart, 6) });

	const [showCalendarStart, setShowCalendarStart] = useState<boolean>(false);
	const [showCalendarEnd, setShowCalendarEnd] = useState<boolean>(false);

	const [userTimeData, setUserTimeData] = useState<any[]>([]);

	const { data: usersData, loading: usersLoading, error: usersError } = useFetch<any[]>(API_ENPOINT_V1.GET_PEOPLE);

	useEffect(() => {
		if (!selectedUserId && Array.isArray(usersData) && usersData.length > 0) {
			setSelectedUserId(usersData[0].id_user);
		}
	}, [selectedUserId, usersData]);

	const fetchUserTimeData = useCallback(async (userId: string, range: DateRange, view: TimesheetView) => {
		if (!userId || !range?.start || !range?.end) {
			setUserTimeData([]);
			setTimeError(null);
			return;
		}

		setTimeLoading(true);
		setTimeError(null);
		setUserTimeData([]);

		try {
			const endpoint = view === "daily" ? API_ENPOINT_V1.GET_USER_TIME_DAILY : API_ENPOINT_V1.GET_USER_TIME_WEEKLY;
			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...getAuthHeader()
				},
				body: JSON.stringify({
					id: userId,
					startDate: toDateParam(range.start),
					endDate: toDateParam(range.end)
				})
			});

			if (!response.ok) {
				throw new Error(`Request failed with status ${response.status}`);
			}

			const parsed = await response.json();
			const normalizedData = Array.isArray(parsed)
				? parsed
				: Array.isArray(parsed?.data)
				? parsed.data
				: Array.isArray(parsed?.records)
				? parsed.records
				: Array.isArray(parsed?.result)
				? parsed.result
				: [];

			setUserTimeData(normalizedData);
		} catch (error: any) {
			setTimeError(error?.message || "Failed to load time data");
			setUserTimeData([]);
		} finally {
			setTimeLoading(false);
		}
	}, []);

	const currentRange: DateRange = useMemo(() => {
		if (selectedView === "weekly") return weeklyRange;
		if (selectedView === "calendar") return calendarRange;
		return dailyRange;
	}, [calendarRange, dailyRange, selectedView, weeklyRange]);

	const weekDaysWeekly = useMemo(() => BuildWeekDays(weeklyRange.start, DAY_KEYS), [weeklyRange.start]);
	const weekDaysCalendar = useMemo(() => BuildWeekDays(calendarRange.start, DAY_KEYS), [calendarRange.start]);

	const { weeklyRows, dayTotals, weeklyTotalFormatted } = useMemo(
		() => TransformTimeData(userTimeData, weekDaysWeekly, weeklyRange.start, weeklyRange.end, getColorForLabel, DAY_KEYS),
		[userTimeData, weekDaysWeekly, weeklyRange.end, weeklyRange.start]
	);

	const { weeklyRows: calendarRows, weeklyTotalFormatted: calendarTotalFormatted } = useMemo(
		() => TransformTimeData(userTimeData, weekDaysCalendar, calendarRange.start, calendarRange.end, getColorForLabel, DAY_KEYS),
		[calendarRange.end, calendarRange.start, userTimeData, weekDaysCalendar]
	);

	const calendarDaysData = useMemo(
		() =>
			weekDaysCalendar.map(day => ({
				id: `calendar-${day.key}-${day.date}`,
				label: day.label,
				month: day.month,
				date: day.date,
				events: (calendarRows ?? [])
					.filter((row: any) => row.entries[day.key] && row.entries[day.key] !== "-")
					.map((row: any) => ({
						id: `${row.id}-${day.key}`,
						title: row.project,
						time: row.entries[day.key],
						color: row.color
					}))
			})),
		[calendarRows, weekDaysCalendar]
	);

	const { entries: dailyEntries, dailyTotalFormatted } = useMemo(
		() => BuildDailyEntries(userTimeData, dailyRange.start, dailyRange.end, getColorForLabel),
		[dailyRange.end, dailyRange.start, getColorForLabel, userTimeData]
	);

	const calendarDaysStart = useMemo(() => GenerateCalendar(currentRange.start), [currentRange.start, selectedView]);
	const calendarDaysEnd = useMemo(() => GenerateCalendar(currentRange.end), [currentRange.end, selectedView]);

	const dateRangeLabel = useMemo(() => {
		return `${FormatDate(currentRange.start)} - ${FormatDate(currentRange.end)}`;
	}, [currentRange.end, currentRange.start]);

	const totalLabel = useMemo(() => {
		if (selectedView === "daily") return `Total: ${dailyTotalFormatted}`;
		if (selectedView === "weekly") return `Total: ${weeklyTotalFormatted}`;
		return `Total: ${calendarTotalFormatted || "0:00:00"}`;
	}, [calendarTotalFormatted, dailyTotalFormatted, selectedView, weeklyTotalFormatted]);

	useEffect(() => {
		if (!selectedUserId || !hasSelectedDates) {
			setUserTimeData([]);
			setTimeError(null);
			return;
		}

		const viewForFetch: TimesheetView = selectedView === "calendar" ? "weekly" : selectedView;
		void fetchUserTimeData(selectedUserId, currentRange, viewForFetch);
	}, [currentRange.end, currentRange.start, fetchUserTimeData, hasSelectedDates, selectedUserId, selectedView]);

	const handleStartDateChange = (date: Date) => {
		setHasSelectedDates(true);
		let start: Date = StartOfDay(date);
		switch (selectedView) {
			case "daily":
				start = StartOfDay(date);
				setDailyRange(prev => ({ start, end: start > prev.end ? start : prev.end }));
				break;
			case "weekly":
				start = StartOfDay(date);
				setWeeklyRange({ start, end: AddDays(start, 6) });
				break;
			case "calendar":
				start = StartOfDay(date);
				setCalendarRange({ start, end: AddDays(start, 6) });
				break;
			default:
				break;
		}
	};

	const handleEndDateChange = (date: Date) => {
		setHasSelectedDates(true);
		let start: Date;
		let end: Date = StartOfDay(date);
		switch (selectedView) {
			case "daily":
				end = StartOfDay(date);
				setDailyRange(prev => ({ start: end < prev.start ? end : prev.start, end }));
				break;
			case "weekly":
				start = StartOfDay(date);
				setWeeklyRange({ start, end: AddDays(start, 6) });
				break;
			case "calendar":
				start = StartOfDay(date);
				setCalendarRange({ start, end: AddDays(start, 6) });
				break;
			default:
				break;
		}
	};

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

								{usersData && usersData.length > 0 && (
									<div className="min-w-[280px]">
										<UserSelector users={usersData} selectedUserId={selectedUserId} onSelect={setSelectedUserId} />
										{usersLoading && <p className="mt-1 text-xs text-gray-500">Loading users...</p>}
										{usersError && <p className="mt-1 text-xs text-red-600">Unable to load users.</p>}
									</div>
								)}
							</div>
						</section>

						<section>
							{timeError && <p className="mb-2 text-sm font-medium text-red-600">Unable to load time data: {timeError}</p>}
							{selectedView === "daily" && (timeLoading ? <Loading /> : <TSDailyView totalLabel={totalLabel} entries={dailyEntries} />)}
							{selectedView === "weekly" &&
								(timeLoading ? (
									<Loading />
								) : (
									<TSWeeklyView totalLabel={totalLabel} weekDays={weekDaysWeekly} rows={weeklyRows} dayTotals={dayTotals} weekTotal={weeklyTotalFormatted} />
								))}
							{selectedView === "calendar" && <TSCalendarView totalLabel={totalLabel} days={calendarDaysData} loading={timeLoading} error={timeError} />}
						</section>
					</main>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default ViewEdit;
