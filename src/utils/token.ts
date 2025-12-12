import { normalizeTokenValue } from "./token-normalizer";

const TOKEN_KEY: string = "test";

const getToken = (): string | null => {
	if (typeof window === "undefined") return null;
	const rawValue = localStorage.getItem(TOKEN_KEY);
	const normalized = normalizeTokenValue(rawValue);

	if (normalized && rawValue !== normalized) {
		localStorage.setItem(TOKEN_KEY, normalized);
	}

	return normalized;
};

const setToken = (token: string): void => {
	if (typeof window === "undefined") return;
	const normalized = normalizeTokenValue(token) ?? token;
	localStorage.setItem(TOKEN_KEY, normalized);
};

const removeToken = (): void => {
	if (typeof window === "undefined") return;
	localStorage.removeItem(TOKEN_KEY);
};

const hasToken = (): boolean => getToken() !== null;

const getAuthHeader = (): HeadersInit => {
	const token: string | null = getToken();
	if (!token) return {};

	return {
		Authorization: `Bearer ${token}`
	};
};

export { getToken, setToken, removeToken, hasToken, getAuthHeader };
