"use server";

import { redirect } from "next/navigation";

import { API_URL_V1 } from "@/../config";

interface LoginState {
	message?: string;
	error?: boolean;
	token?: string;
}

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
	const username: string = formData.get("username") as string;
	const password: string = formData.get("password") as string;

	if (!username || !password) return { error: true, message: "ID and password are required." };

	try {
		const response = await fetch(`${API_URL_V1}/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ employeeId: username, password })
		});

		if (!response.ok) return { error: true, message: "Invalid credentials." };

		const data = await response.json();
		const tokenString = typeof data.access_token === "string" ? data.access_token : JSON.stringify(data.access_token);

		// Retornar el token al cliente para que lo guarde en localStorage
		return { error: false, token: tokenString };
	} catch (error) {
		console.error("Login error:", error);
		return { error: true, message: "An unexpected error occurred." };
	}
}

export async function logout() {
	// El cliente eliminará el token de localStorage
	redirect("/auth");
}
