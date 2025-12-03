"use client";

import type { JSX, FC } from "react";
import type { ProtectedRouteProps } from "@/types";

import { useProtectedRoute } from "@/hooks";

const ProtectedRoute: FC<ProtectedRouteProps> = ({
	children,
	loadingMessage = "Validando sesión...",
	errorMessage = "No pudimos contactar al servidor de autenticación."
}: ProtectedRouteProps): JSX.Element | null => {
	const { isValidating, isValid, error, retry } = useProtectedRoute();

	if (isValidating) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-600">
				<span className="animate-pulse text-sm">{loadingMessage}</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center text-gray-600 p-6 space-y-4">
				<p className="text-base font-medium">{errorMessage}</p>
				<p className="text-sm text-gray-500">{error}</p>
				<button
					type="button"
					onClick={retry}
					className="px-4 py-2 rounded-lg bg-[#8b5cf6] text-white text-sm font-semibold shadow-md hover:bg-[#7c3aed] transition-colors cursor-pointer"
				>
					Reintentar validación
				</button>
			</div>
		);
	}

	if (!isValid) {
		return null;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
