import { useCallback, useEffect, useState } from "react";
import { validateToken } from "@/utils/auth-api";
import { hasToken } from "@/utils/token";
import { useAuth } from "@/contexts/auth-context";

/**
 * Hook para proteger rutas mediante validación de token con API
 * Redirige a /auth si el token no es válido o no existe
 */
export function useProtectedRoute() {
	const [isValidating, setIsValidating] = useState(true);
	const [isValid, setIsValid] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { logout, isAuthenticated } = useAuth();

	const runValidation = useCallback(async () => {
		setIsValidating(true);
		setError(null);

		// Si el usuario no ha iniciado sesión, no validar aún
		if (!isAuthenticated) {
			setIsValid(false);
			setIsValidating(false);
			return;
		}

		// Si no hay token, cerrar sesión y terminar
		if (!hasToken()) {
			setIsValid(false);
			await logout();
			setIsValidating(false);
			return;
		}

		// Validar token con la API
		const result = await validateToken();

		if (!result.valid) {
			if (result.errorType === "network") {
				setError(result.message ?? "No pudimos validar tu sesión. Intenta nuevamente.");
			} else {
				await logout();
			}
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
}
