"use client";

import type { JSX } from "react";

import { useEffect, useMemo, useState } from "react";

import { NavSide, Nav, ProtectedRoute, Loading } from "@/components";
import { useAuth } from "@/contexts";
import { API_ENPOINT_V1 } from "@/config";
import { FormatDate, FullName, GetNameInitials, getAuthHeader } from "@/utils";

const Settings = (): JSX.Element => {
	const { employeeId, token } = useAuth();
	const [profileData, setProfileData] = useState<any | null>(null);
	const [profileLoading, setProfileLoading] = useState<boolean>(true);
	const [profileError, setProfileError] = useState<string | null>(null);

	console.log(employeeId, token);

	useEffect(() => {
		if (!employeeId) {
			setProfileData(null);
			setProfileError("No pudimos identificar tu usuario.");
			setProfileLoading(false);
			return;
		}

		const controller = new AbortController();

		const fetchProfile = async () => {
			setProfileLoading(true);
			setProfileError(null);

			try {
				const response = await fetch(`${API_ENPOINT_V1.GET_PERSON_BY_ID}${employeeId}`, {
					headers: {
						"Content-Type": "application/json",
						...getAuthHeader()
					},
					signal: controller.signal
				});

				if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

				const data = await response.json();
				if (!controller.signal.aborted) setProfileData(data);
			} catch (error: any) {
				if (controller.signal.aborted) return;
				setProfileData(null);
				setProfileError(error?.message ?? "No pudimos cargar tu información.");
			} finally {
				if (!controller.signal.aborted) setProfileLoading(false);
			}
		};

		void fetchProfile();

		return () => {
			controller.abort();
		};
	}, [employeeId]);

	const user = profileData?.user?.[0];
	const fullName = user ? FullName(user.name, user.last_name) : "Mi cuenta";
	const initials = user ? GetNameInitials(user.name, user.last_name) : "MX";
	const role = user?.roles ?? "Team member";
	const workEmail = user?.email ?? "Sin correo";
	const department = user?.department ?? "Sin asignar";
	const project = user?.project ?? "Sin asignar";
	const site = user?.site ?? "No definido";
	const joined = user?.["He-hired"] ? FormatDate(user["He-hired"]) : "Fecha no disponible";

	const timezoneLabel = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

	const infoHighlights = useMemo(
		() => [
			{ label: "Correo corporativo", value: workEmail },
			{ label: "Departamento", value: department },
			{ label: "Proyecto", value: project },
			{ label: "Ubicación", value: site },
			{ label: "Fecha de ingreso", value: joined }
		],
		[department, joined, project, site, workEmail]
	);

	return (
		<ProtectedRoute>
			<div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
				<NavSide />

				<div className="flex-1 ml-24 flex flex-col">
					<Nav title="Settings" />

					<main className="flex-1 bg-gray-50 p-8">
						{profileLoading ? (
							<div className="flex h-[60vh] items-center justify-center rounded-3xl border border-gray-200 bg-white">
								<Loading />
							</div>
						) : profileError ? (
							<div className="rounded-3xl border border-red-100 bg-white p-8 text-center text-red-600 shadow-sm">
								<p className="text-lg font-semibold">Ocurrió un problema al cargar tu información.</p>
								<p className="mt-2 text-sm text-red-500">{profileError}</p>
							</div>
						) : (
							<div>
								<section className="space-y-6">
									<article className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
										<div className="bg-[#3f1d45] px-6 py-5 text-white">
											<div className="flex flex-wrap items-center gap-5">
												<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-xl font-semibold uppercase text-white">
													{initials}
												</div>
												<div className="flex-1 min-w-[220px]">
													<div className="flex flex-wrap items-center gap-3">
														<h1 className="text-3xl font-semibold">{fullName}</h1>
													</div>
													<p className="text-sm text-white/80 mt-1">{role}</p>
													<p className="text-xs uppercase tracking-wide text-white/70 mt-1">ID empleado · {employeeId ?? "N/D"}</p>
												</div>
											</div>
											<div className="mt-4 flex flex-wrap gap-3 text-xs text-white/80">
												<span className="rounded-full bg-white/10 px-3 py-1">{workEmail}</span>
												<span className="rounded-full bg-white/10 px-3 py-1">{site}</span>
												<span className="rounded-full bg-white/10 px-3 py-1">{timezoneLabel}</span>
											</div>
										</div>

										<div className="p-6 space-y-6">
											<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
												{infoHighlights.map(item => (
													<div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3">
														<p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</p>
														<p className="mt-1 text-sm font-medium text-gray-900">{item.value}</p>
													</div>
												))}
												{[{ label: "Zona horaria", value: timezoneLabel }].map(item => (
													<div key={item.label} className="rounded-2xl border border-gray-100 p-4">
														<p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</p>
														<p className="mt-1 text-sm font-semibold text-gray-900">{item.value}</p>
													</div>
												))}
											</div>
										</div>
									</article>
								</section>
							</div>
						)}
					</main>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default Settings;
