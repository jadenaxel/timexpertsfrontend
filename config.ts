import { TabType } from "@/types";

const API_URL_V1: string = "http://localhost:3001/api/v1";

const API_ENPOINT_V1: Record<string, string> = {
	GET_PEOPLE: `${API_URL_V1}/people`,
	GET_PERSON_BY_ID: `${API_URL_V1}/people/`
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

const UserPageTabs = [
	{ id: "INFO" as TabType, label: "INFO" },
	{ id: "EMPLOYMENT" as TabType, label: "EMPLOYMENT" },
	{ id: "WORK_TIME" as TabType, label: "WORK TIME & LIMITS" },
	{ id: "CAPTURE" as TabType, label: "CAPTURES" },
	{ id: "SETTINGS" as TabType, label: "SETTINGS" }
];

export { API_URL_V1, API_ENPOINT_V1, JWT_SECRET, ITEMS_PER_PAGE, FullName, GetNameInitials, FormatDate, UserPageTabs };
