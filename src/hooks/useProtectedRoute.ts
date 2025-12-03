import { useCallback, useEffect, useState, useRef } from "react";

import { validateToken, hasToken } from "@/utils";
import { useAuth } from "@/contexts/auth-context";

const useProtectedRoute = () => {
	const [isValidating, setIsValidating] = useState(true);
	const [isValid, setIsValid] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { logout, isAuthenticated } = useAuth();
	const hasValidated = useRef(false);

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
		// Prevent double validation on mount
		if (hasValidated.current) return;
		hasValidated.current = true;

		runValidation();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Empty dependency array - only run once on mount

	return { isValidating, isValid, error, retry: runValidation };
};

export default useProtectedRoute;
