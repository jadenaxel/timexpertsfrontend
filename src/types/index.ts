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
}

export type { UseFetchOptions, UseFetchResult, ProtectedRouteProps, CardPeopleProps, PeoplePageProps, TabType, InfoFieldProps, AuthContextType };
