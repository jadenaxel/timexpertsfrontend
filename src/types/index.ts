import type { JSX } from "react";

import { ReactNode } from "react";

interface UseFetchOptions<T = any> {
	method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	init?: RequestInit;
	transformResponse?: (response: Response) => Promise<T>;
}

interface UseFetchResult<T> {
	data: T | null;
	loading: boolean;
	error: string | null;
	refetch: (overrideOptions?: Partial<UseFetchOptions<T>>) => void;
}
interface ProtectedRouteProps {
	children: ReactNode;
	loadingMessage?: string;
	errorMessage?: string;
}

interface CardPeopleProps {
	name: string;
	last_name: string;
	email?: string;
	status?: "active" | "inactive";
	role?: string;
	enabled?: boolean;
	created_at?: string;
	[key: string]: any;
}

interface PeoplePageProps {
	params: Promise<{ id: string }> | { id: string };
}

type TabType = "INFO" | "EMPLOYMENT" | "WORK_TIME" | "CAPTURE";

enum EnumTabType {
	INFO = "INFO",
	EMPLOYMENT = "EMPLOYMENT",
	WORK_TIME = "WORK_TIME",
	CAPTURE = "CAPTURE"
}

interface InfoFieldProps {
	label: string;
	value?: ReactNode;
	placeholder?: string;
}

interface AuthContextType {
	isAuthenticated: boolean;
	token: string | null;
	isLoading: boolean;
	employeeId: string | null;
	login: (token: string) => void;
	logout: () => Promise<void>;
	validateSession: (options?: { force?: boolean }) => Promise<ValidateTokenResponse>;
}

type ScreenShotItem = {
	id: number | string;
	filename?: string;
	image_data: any;
	timestamp: string;
	machine_id?: string;
};

interface ScreenShotsCardProps {
	user: string;
	screenshots: ScreenShotItem[];
}

interface ImageOverlayProps {
	images: any[];
	selectedIndex: number;
	onClose: () => void;
	onIndexChange: (index: number) => void;
}

type NavigationChild = {
	title: string;
	href: string;
};

type NavigationItem = {
	icon: JSX.Element;
	href?: string;
	title: string;
	children?: NavigationChild[];
};

interface User {
	id_user: string;
	name: string;
	last_name: string;
}

interface TimelineSegment {
	id: string;
	label: string;
	width: string;
	color: string;
}

interface DailyEntry {
	id: string;
	project: string;
	client: string;
	task: string;
	color: string;
	icon: string;
	activity: string;
	idle: string;
	manual: string;
	duration: string;
	time: string;
}

interface WeeklyRow {
	id: string;
	project: string;
	type: string;
	color: string;
	entries: Record<string, string>;
	total: string;
}

interface CalendarDay {
	id: string;
	label: string;
	month: string;
	date: number;
	events: {
		id: string;
		title: string;
		time: string;
		color: string;
	}[];
}

interface UserSelectorProps {
	users: User[];
	selectedUserId: string;
	onSelect: (userId: string) => void;
	startDate?: Date;
	endDate?: Date;
	setUserTimeData?: (data: any[]) => void;
}

type WeekDayDisplay = { key: string; label: string; month: string; date: number; value: Date };
type DailyRowData = { id: string; project: string; type?: string; activity: string; duration: string; durationSeconds: number; color: string };
type DateRange = { start: Date; end: Date };
type TimesheetView = "daily" | "weekly";
type TokenErrorType = "invalid" | "network";

interface ValidateTokenResponse {
	valid: boolean;
	employeeId?: string | null;
	message?: string;
	errorType?: TokenErrorType;
}

export type {
	UseFetchOptions,
	UseFetchResult,
	ProtectedRouteProps,
	CardPeopleProps,
	PeoplePageProps,
	TabType,
	InfoFieldProps,
	AuthContextType,
	ScreenShotItem,
	ScreenShotsCardProps,
	ImageOverlayProps,
	NavigationChild,
	NavigationItem,
	User,
	TimelineSegment,
	DailyEntry,
	WeeklyRow,
	CalendarDay,
	UserSelectorProps,
	WeekDayDisplay,
	DailyRowData,
	DateRange,
	TimesheetView,
	TokenErrorType,
	ValidateTokenResponse
};

export { EnumTabType };
