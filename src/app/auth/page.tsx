"use client";

import type { JSX } from "react";

import { useState, useActionState, useEffect } from "react";
import { login } from "../actions/auth";
import { useAuth } from "@/contexts/auth-context";

const AuthPage = (): JSX.Element => {
	const [state, formAction, isPending] = useActionState(login, { message: "", error: false });
	const { login: authLogin } = useAuth();

	const [showPassword, setShowPassword] = useState(false);

	// Cuando el login es exitoso, guardar el token
	useEffect(() => {
		if (state.token && !state.error) {
			authLogin(state.token);
		}
	}, [state, authLogin]);

	return (
		<div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-neutral-900">
			{/* Background with colorful gradients to mimic the mural vibe since we are code-only */}
			<div className="absolute inset-0 z-0 opacity-50">
				<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-500 via-purple-600 to-blue-500 opacity-60" />
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
				<div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
				<div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
			</div>

			{/* Decorative Text Elements (mimicking the painted wall text) */}
			<div className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:block z-0">
				<h1 className="text-8xl font-black tracking-tighter text-white/20 select-none transform -rotate-2">
					HIRED
					<br />
					<span className="text-white/10">EXPERTS</span>
				</h1>
			</div>

			<div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block z-0 text-right">
				<h2 className="text-7xl font-bold text-white/20 select-none">
					Intelligent
					<br />
					Growth
				</h2>
				<div className="mt-4 h-2 w-32 bg-red-600/50 ml-auto rounded-full" />
			</div>

			{/* Main Card */}
			<div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-2xl p-8 m-4">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-black text-gray-800 mb-3 tracking-tight">TimeXperts</h1>
					<h2 className="text-3xl font-bold text-[#0070f3]">Sign In</h2>
				</div>

				<form className="space-y-6" action={formAction}>
					{state.error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-200">{state.message}</div>}
					<div className="space-y-2">
						<input
							type="text"
							name="username"
							placeholder="Enter your username"
							className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-gray-600 placeholder:text-gray-400"
							required
						/>
					</div>

					<div className="space-y-2">
						<input
							type={showPassword ? "text" : "password"}
							name="password"
							placeholder="Enter your password"
							className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-gray-600 placeholder:text-gray-400"
							required
						/>
					</div>

					<div className="flex items-center space-x-2">
						<input
							type="checkbox"
							id="show-password"
							checked={showPassword}
							onChange={e => setShowPassword(e.target.checked)}
							className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
						/>
						<label htmlFor="show-password" className="text-sm text-gray-600 cursor-pointer select-none">
							Show password
						</label>
					</div>

					<button
						type="submit"
						disabled={isPending}
						className="w-full py-3 px-4 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
					>
						{isPending ? "Signing In..." : "Sign In"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default AuthPage;
