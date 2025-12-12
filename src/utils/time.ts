import { DailyRowData, WeekDayDisplay, WeeklyRow } from "@/types";

const FormatDate = (date: any): any => {
	if (!date) return "";
	try {
		return new Date(date).toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
			year: "numeric"
		});
	} catch {
		return date;
	}
};
const FormatHour = (hour: string): string => {
	if (!hour) return "";
	try {
		return new Date(hour).toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
			timeZone: "UTC"
		});
	} catch {
		return hour;
	}
};

const MonthNames: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const IsSameDay = (date1: Date, date2: Date) => {
	return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
};
const IsToday = (date: Date) => IsSameDay(date, new Date());
const IsFutureDate = (date: Date) => date > new Date();

const GenerateCalendar = (date: Date): (number | null)[] => {
	const year: number = date.getFullYear();
	const month: number = date.getMonth();
	const firstDay: Date = new Date(year, month, 1);
	const lastDay: Date = new Date(year, month + 1, 0);
	const daysInMonth: number = lastDay.getDate();
	const startingDayOfWeek: number = firstDay.getDay();

	const days: (number | null)[] = [];
	for (let i = 0; i < startingDayOfWeek; i++) {
		days.push(null);
	}
	for (let i = 1; i <= daysInMonth; i++) {
		days.push(i);
	}
	return days;
};

const FormatTimeUnit = (value?: number | string): string => String(value ?? 0).padStart(2, "0");

const StartOfDay = (date: Date): Date => {
	const d: Date = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
};

const GetWeekStart = (date: Date, startOfDay: (date: Date) => Date): Date => {
	const d: Date = startOfDay(date);
	const day: number = d.getDay();
	const diff: number = day === 0 ? -6 : 1 - day;
	d.setDate(d.getDate() + diff);
	return d;
};

const AddDays = (date: Date, days: number): Date => {
	const d: Date = new Date(date);
	d.setDate(d.getDate() + days);
	return d;
};

const FormatDuration = (seconds: number): string => {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);
	return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const IntervalToSeconds = (interval: any): number => {
	if (!interval) return 0;
	if (typeof interval === "number") return interval;

	if (typeof interval === "string") {
		const parts = interval.split(":").map(Number);
		if (parts.length === 3 && parts.every(n => !Number.isNaN(n))) {
			return parts[0] * 3600 + parts[1] * 60 + parts[2];
		}
	}

	const hours: number = Number(interval.hour ?? interval.hours ?? interval.h ?? 0);
	const minutes: number = Number(interval.minutes ?? interval.mins ?? interval.minute ?? interval.min ?? 0);
	const seconds: number = Number(interval.seconds ?? interval.secs ?? interval.second ?? interval.sec ?? 0);

	return hours * 3600 + minutes * 60 + seconds;
};

const BuildWeekDays = (start: Date, DAY_KEYS: string[]): WeekDayDisplay[] => {
	const base = StartOfDay(start);
	return Array.from({ length: 7 }, (_, index) => {
		const current = AddDays(base, index);
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

const ExtractDayEntries = (record: any): Array<{ date: Date; seconds: number }> => {
	const entries: Array<{ date: Date; seconds: number }> = [];
	const candidateArrays = [record?.days, record?.dates, record?.entries, record?.per_day, record?.perDate];

	candidateArrays.forEach(list => {
		if (!Array.isArray(list)) return;
		list.forEach((item: any) => {
			const dateValue = item?.date ?? item?.day ?? item?.date_time ?? item?.timestamp ?? item?.created_at;
			const parsedDate = dateValue ? StartOfDay(new Date(dateValue)) : null;
			const seconds = IntervalToSeconds(item?.total_interval ?? item?.interval ?? item?.total ?? item);

			if (parsedDate && !Number.isNaN(parsedDate.getTime()) && seconds > 0) {
				entries.push({ date: parsedDate, seconds });
			}
		});
	});

	if (record?.entries && typeof record.entries === "object" && !Array.isArray(record.entries)) {
		Object.entries(record.entries).forEach(([key, value]) => {
			const parsedDate = StartOfDay(new Date(key));
			const seconds = IntervalToSeconds(value);
			if (!Number.isNaN(parsedDate.getTime()) && seconds > 0) {
				entries.push({ date: parsedDate, seconds });
			}
		});
	}

	const singleDateValue = record?.date ?? record?.day ?? record?.timestamp ?? record?.created_at;
	if (singleDateValue) {
		const parsedDate = StartOfDay(new Date(singleDateValue));
		const seconds = IntervalToSeconds(record?.total_interval ?? record?.interval ?? record?.total);
		if (!Number.isNaN(parsedDate.getTime()) && seconds > 0) {
			entries.push({ date: parsedDate, seconds });
		}
	}

	return entries;
};

const TransformTimeData = (records: any[], weekDays: WeekDayDisplay[], rangeStart: Date, rangeEnd: Date, getColorForLabel: (label: string) => string, DAY_KEYS: string[]): any => {
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

		const perDayEntries = ExtractDayEntries(record).filter(entry => inRange(entry.date));

		if (perDayEntries.length > 0) {
			perDayEntries.forEach(({ date, seconds }) => {
				const dayKey = DAY_KEYS[date.getDay()];
				row.entriesSeconds[dayKey] = (row.entriesSeconds[dayKey] || 0) + seconds;
				row.totalSeconds += seconds;
				dayTotalsSeconds[dayKey] = (dayTotalsSeconds[dayKey] || 0) + seconds;
				weeklyTotalSeconds += seconds;
			});
		} else {
			const seconds = IntervalToSeconds(record?.total_interval ?? record?.interval ?? record?.total);
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
		entries: Object.fromEntries(weekDays.map(day => [day.key, row.entriesSeconds[day.key] ? FormatDuration(row.entriesSeconds[day.key]) : "-"])),
		total: FormatDuration(row.totalSeconds)
	}));

	const dayTotals: Record<string, string> = Object.fromEntries(weekDays.map(day => [day.key, dayTotalsSeconds[day.key] ? FormatDuration(dayTotalsSeconds[day.key]) : "-"]));

	return {
		weeklyRows,
		dayTotals,
		weeklyTotalSeconds,
		weeklyTotalFormatted: FormatDuration(weeklyTotalSeconds)
	};
};

const BuildDailyEntries = (records: any[], rangeStart: Date, rangeEnd: Date, getColorForLabel: (label: string) => string): any => {
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

	const start = StartOfDay(rangeStart);
	const end = StartOfDay(rangeEnd);

	const inRange = (date: Date): boolean => {
		const d = StartOfDay(date);
		return d >= start && d <= end;
	};

	(records || []).forEach((record: any) => {
		const project: string = record?.project ?? record?.state ?? record?.activity ?? "Work item";
		const type: string = record?.type ?? record?.category ?? record?.task ?? record?.description ?? "";
		const color: string = getColorForLabel(project);
		const id: string = project.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "item";
		const activity: string = type || project;

		const perDayEntries = ExtractDayEntries(record).filter(entry => inRange(entry.date));
		const fromEntriesSeconds: number = perDayEntries.reduce((acc, entry) => acc + entry.seconds, 0);
		const fallbackSeconds: number = IntervalToSeconds(record?.total_interval ?? record?.interval ?? record?.total ?? record?.durationSeconds ?? record?.duration);
		const durationSeconds: number = fromEntriesSeconds || fallbackSeconds;
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
		duration: FormatDuration(row.durationSeconds),
		durationSeconds: row.durationSeconds,
		color: row.color
	}));

	const dailyTotalSeconds: number = entries.reduce((acc, item) => acc + item.durationSeconds, 0);

	return {
		entries,
		dailyTotalSeconds,
		dailyTotalFormatted: FormatDuration(dailyTotalSeconds)
	};
};

export {
	FormatDate,
	FormatHour,
	MonthNames,
	IsSameDay,
	IsToday,
	IsFutureDate,
	GenerateCalendar,
	FormatTimeUnit,
	StartOfDay,
	GetWeekStart,
	AddDays,
	FormatDuration,
	IntervalToSeconds,
	BuildWeekDays,
	ExtractDayEntries,
	TransformTimeData,
	BuildDailyEntries
};
