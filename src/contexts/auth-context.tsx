"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { useRouter, usePathname } from "next/navigation";

import { validateToken, getToken, setToken, removeToken } from "@/utils";
import { AuthContextType } from "@/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [token, setTokenState] = useState<string | null>(null);
	const [employeeId, setEmployeeId] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const initAuth = async () => {
			const storedToken = getToken();

			if (!storedToken) {
				setIsLoading(false);
				return;
			}

			const result = await validateToken();

			if (result.valid) {
				setTokenState(storedToken);
				setEmployeeId(result.employeeId ?? null);
				setIsAuthenticated(true);
			} else if (result.errorType === "invalid") {
				removeToken();
			} else if (result.errorType === "network") {
				setTokenState(storedToken);
			}

			setIsLoading(false);
		};

		initAuth();
	}, []);

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
		setIsAuthenticated(true);
		router.push("/");
	};

	const handleLogout = async () => {
		removeToken();
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
				logout: handleLogout
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
