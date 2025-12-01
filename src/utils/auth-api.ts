import { API_URL_V1 } from "@/../config";
import { getToken } from "./token";

type TokenErrorType = "invalid" | "network";

export interface ValidateTokenResponse {
	valid: boolean;
	employeeId?: string | null;
	message?: string;
	errorType?: TokenErrorType;
}

export async function validateToken(): Promise<ValidateTokenResponse> {
	const token = getToken();

	if (!token) return { valid: false, message: "No token found", errorType: "invalid" };

	try {
		const response = await fetch(`${API_URL_V1}/auth/validate`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json"
			}
		});

		if (!response.ok) {
			const isAuthError = response.status === 401 || response.status === 403;
			return {
				valid: false,
				message: isAuthError ? "Token validation failed" : "Validation service unavailable",
				errorType: isAuthError ? "invalid" : "network"
			};
		}

		let data: Record<string, unknown> = {};
		data = await response.json();
	
		const explicitInvalid = data?.valid === false || data?.success === false;
		if (explicitInvalid) {
			return {
				valid: false,
				message: typeof data.message === "string" ? data.message : "Token invalid",
				errorType: "invalid"
			};
		}

		const employeeId =
			typeof data.employeeId === "string" ? data.employeeId : typeof data.employee_id === "string" ? data.employee_id : typeof data.id === "string" ? data.id : null;

		return { valid: true, employeeId };
	} catch (error) {
		console.error("Token validation error:", error);
		return { valid: false, message: "Validation request failed", errorType: "network" };
	}
}