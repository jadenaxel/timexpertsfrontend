const TOKEN_KEY = "test";

const getToken = (): string | null => {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string): void => {
	if (typeof window === "undefined") return;
	localStorage.setItem(TOKEN_KEY, token);
};

const removeToken = (): void => {
	if (typeof window === "undefined") return;
	localStorage.removeItem(TOKEN_KEY);
};

const hasToken = (): boolean => getToken() !== null;

const getAuthHeader = (): HeadersInit => {
	const token = getToken();
	if (!token) return {};

	return {
		Authorization: `Bearer ${token}`
	};
};

export { getToken, setToken, removeToken, hasToken, getAuthHeader };
