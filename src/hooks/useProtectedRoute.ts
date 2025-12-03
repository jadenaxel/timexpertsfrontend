import { useCallback, useEffect, useState } from "react";

import { validateToken, hasToken } from "@/utils";
import { useAuth } from "@/contexts/auth-context";

const useProtectedRoute = () => {
	const [isValidating, setIsValidating] = useState(true);
	const [isValid, setIsValid] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { logout, isAuthenticated } = useAuth();

	const runValidation = useCallback(async () => {
		setIsValidating(true);
		setError(null);

		if (!isAuthenticated) {
			setIsValid(false);
			setIsValidating(false);
			return;
		}

		if (!hasToken()) {
			setIsValid(false);
			await logout();
			setIsValidating(false);
			return;
		}

		const result = await validateToken();

		if (!result.valid) {
			if (result.errorType === "network") setError(result.message ?? "No pudimos validar tu sesión. Intenta nuevamente.");
			else await logout();

			setIsValid(false);
		} else {
			setIsValid(true);
		}

		setIsValidating(false);
	}, [logout, isAuthenticated]);

	useEffect(() => {
		runValidation();
	}, [runValidation]);

	return { isValidating, isValid, error, retry: runValidation };
};

export default useProtectedRoute;
