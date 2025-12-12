"use client";

import type { JSX, FC } from "react";

type ErrorProps = {
	title?: string;
	message?: string;
	actionLabel?: string;
	onRetry?: () => void;
};

const Error: FC<ErrorProps> = ({
	title = "Algo salió mal",
	message = "Tuvimos un problema al cargar la información. Por favor intenta nuevamente en unos segundos.",
	actionLabel = "Reintentar",
	onRetry
}): JSX.Element => {
	const handleRetry = (): void => {
		if (onRetry) {
			onRetry();
			return;
		}

		if (typeof window !== "undefined") {
			window.location.reload();
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-10 text-gray-800">
			<div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-sm">
				<div className="flex items-start gap-4 px-8 py-7">
					<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-[#3f1d45]">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 9v4m0 4h.01M10.34 3.94 1.95 18.06c-.78 1.35.2 3.04 1.74 3.04h16.62c1.54 0 2.52-1.69 1.74-3.04L13.66 3.94a2 2 0 0 0-3.32 0Z"
							/>
						</svg>
					</div>

					<div className="space-y-3">
						<p className="text-xs font-semibold uppercase tracking-wide text-[#3f1d45]">Error</p>
						<h1 className="text-xl font-semibold text-gray-900">{title}</h1>
						<p className="text-sm leading-relaxed text-gray-600">{message}</p>
						<div className="flex flex-wrap items-center gap-3 pt-2">
							<button
								type="button"
								onClick={handleRetry}
								className="rounded-lg bg-[#3f1d45] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#33153a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f1d45]"
							>
								{actionLabel}
							</button>
							<p className="text-xs text-gray-500">Si el problema persiste, revisa tu conexión o inténtalo más tarde.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Error;
