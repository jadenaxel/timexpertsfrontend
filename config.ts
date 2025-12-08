import { ScreenShotItem, TabType } from "@/types";

const API_URL_V1: string = "http://localhost:3001/api/v1";

const API_ENPOINT_V1: Record<string, string> = {
	GET_PEOPLE: `${API_URL_V1}/people`,
	GET_PERSON_BY_ID: `${API_URL_V1}/people/`,
	GET_LASTEST_SCREENSHOTS_PER_USER: `${API_URL_V1}/dashboard`
};

const JWT_SECRET: string = process.env.JWT_SECRET || "test";
const ITEMS_PER_PAGE: number = 50;

const FullName = (name: string, last_name: string): string => `${name} ${last_name}`;
const GetNameInitials = (name: string, last_name: string): string => `${name.charAt(0).toUpperCase()}${last_name.charAt(0).toUpperCase()}`;
const FormatDate = (date: string): string => {
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

const IsSameDay = (date1: Date, date2: Date) => {
	return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
};

const IsToday = (date: Date) => IsSameDay(date, new Date());
const IsFutureDate = (date: Date) => date > new Date();

const UserPageTabs: any[] = [
	{ id: "INFO" as TabType, label: "INFO" },
	{ id: "EMPLOYMENT" as TabType, label: "EMPLOYMENT" },
	{ id: "WORK_TIME" as TabType, label: "WORK TIME" },
	{ id: "CAPTURE" as TabType, label: "CAPTURES" }
];

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

const MonthNames: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const CompanyName: string = "Cordoba Legal Group";

const EncodeImage = (image: ScreenShotItem["image_data"]): string => {
	if (!image) return "";
	if (typeof image === "string") return image;
	try {
		if (image instanceof Uint8Array) {
			return Buffer.from(image).toString("base64");
		}
		if (typeof image === "object" && image !== null && "data" in image && Array.isArray((image as any).data)) {
			return Buffer.from((image as { data: number[] }).data).toString("base64");
		}
		return Buffer.from(image).toString("base64");
	} catch {
		return "";
	}
};

const FormatUserName = (user: string): string =>
	user
		.split(/[._\s]/)
		.filter(Boolean)
		.map(part => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ") || user;

export {
	API_URL_V1,
	API_ENPOINT_V1,
	JWT_SECRET,
	ITEMS_PER_PAGE,
	FullName,
	GetNameInitials,
	FormatDate,
	FormatHour,
	IsSameDay,
	IsToday,
	IsFutureDate,
	UserPageTabs,
	GenerateCalendar,
	MonthNames,
	EncodeImage,
	CompanyName,
	FormatUserName
};
