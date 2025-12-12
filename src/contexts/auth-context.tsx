"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from "react";

import { useRouter, usePathname } from "next/navigation";

import { validateToken, getToken, setToken, removeToken } from "@/utils";
import { AuthContextType, ValidateTokenResponse } from "@/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const decodeBase64Url = (value: string): string => {
	const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
	const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);

	if (typeof window !== "undefined" && typeof window.atob === "function") {
		return window.atob(padded);
	}

	const bufferRef = typeof globalThis !== "undefined" ? (globalThis as any).Buffer : undefined;
	if (bufferRef) {
		return bufferRef.from(padded, "base64").toString("binary");
	}

	return "";
};

const extractEmployeeIdFromToken = (tokenValue: string | null): string | null => {
	if (!tokenValue) return null;
	const parts = tokenValue.split(".");
	if (parts.length < 2) return null;

	try {
		const payload = JSON.parse(decodeBase64Url(parts[1]));
		const candidate =
			payload?.employeeId ??
			payload?.employee_id ??
			payload?.id_user ??
			payload?.user_id ??
			payload?.userId ??
			payload?.id ??
			payload?.sub;

		if (typeof candidate === "string") return candidate;
		if (typeof candidate === "number") return String(candidate);
	} catch {
		return null;
	}

	return null;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [token, setTokenState] = useState<string | null>(null);
	const [employeeId, setEmployeeId] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const router = useRouter();
	const pathname = usePathname();

	const hasInitialized = useRef(false);
	const validationPromiseRef = useRef<Promise<ValidateTokenResponse> | null>(null);

	const validateSession = useCallback(
		async ({ force = false }: { force?: boolean } = {}): Promise<ValidateTokenResponse> => {
			if (!force && validationPromiseRef.current) {
				return validationPromiseRef.current;
			}

			const storedToken = getToken();

			if (!storedToken) {
				setTokenState(null);
				setEmployeeId(null);
				setIsAuthenticated(false);
				return { valid: false, message: "No token found", errorType: "invalid" };
			}

			const validationPromise = (async (): Promise<ValidateTokenResponse> => {
				const result = await validateToken();
				const tokenMatches = getToken() === storedToken;

				if (!tokenMatches) {
					return result;
				}

				const resolvedEmployeeId = result.employeeId ?? extractEmployeeIdFromToken(storedToken);

				if (result.valid) {
					setTokenState(storedToken);
					setEmployeeId(resolvedEmployeeId);
					setIsAuthenticated(true);
				} else if (result.errorType === "network") {
					setTokenState(storedToken);
					setIsAuthenticated(true);
					if (resolvedEmployeeId) setEmployeeId(resolvedEmployeeId);
				} else {
					removeToken();
					setTokenState(null);
					setEmployeeId(null);
					setIsAuthenticated(false);
				}

				return result;
			})();

			validationPromiseRef.current = validationPromise;

			try {
				return await validationPromise;
			} finally {
				if (validationPromiseRef.current === validationPromise) {
					validationPromiseRef.current = null;
				}
			}
		},
		[]
	);

	useEffect(() => {
		if (hasInitialized.current) return;
		hasInitialized.current = true;

		const initAuth = async () => {
			const storedToken = getToken();

			if (storedToken) {
				setTokenState(storedToken);
				setEmployeeId(extractEmployeeIdFromToken(storedToken));
				await validateSession({ force: true });
			}

			setIsLoading(false);
		};

		void initAuth();
	}, [validateSession]);

	useEffect(() => {
		if (isLoading) return;

		const publicPaths = ["/auth"];
		const isPublicPath = publicPaths.some(path => pathname?.startsWith(path));

		if (!isAuthenticated && !isPublicPath) router.push("/auth");
		else if (isAuthenticated && pathname === "/auth") router.push("/");
	}, [isAuthenticated, pathname, isLoading, router]);

	const handleLogin = (newToken: string) => {
		setToken(newToken);
		setTokenState(newToken);
		setEmployeeId(extractEmployeeIdFromToken(newToken));
		setIsAuthenticated(true);
		router.push("/");
	};

	const handleLogout = async () => {
		removeToken();
		validationPromiseRef.current = null;
		setTokenState(null);
		setEmployeeId(null);
		setIsAuthenticated(false);
		router.push("/auth");
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				token,
				isLoading,
				employeeId,
				login: handleLogin,
				logout: handleLogout,
				validateSession
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = () => {
	const context: AuthContextType | undefined = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export { useAuth, AuthProvider };
