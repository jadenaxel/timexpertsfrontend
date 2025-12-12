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

export { FormatDate, FormatHour, MonthNames, IsSameDay, IsToday, IsFutureDate, GenerateCalendar, FormatTimeUnit, StartOfDay, GetWeekStart, AddDays, FormatDuration };
