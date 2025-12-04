"use client";

import type { FC } from "react";
import type { PeoplePageProps, TabType } from "@/types";

import { useState, use } from "react";

import { NavSide, Nav, ProtectedRoute, Loading, InfoField } from "@/components";
import { useFetch } from "@/hooks";
import { API_ENPOINT_V1, FormatDate, FullName, GetNameInitials, UserPageTabs } from "@/../config";

const PeoplePage: FC<PeoplePageProps> = ({ params }) => {
	const UserID: any = use(params as Promise<{ id: string }>);
	const [activeTab, setActiveTab] = useState<TabType>("INFO");

	const { data, loading, error }: any = useFetch<any>(`${API_ENPOINT_V1.GET_PERSON_BY_ID}${UserID.id}`);

	if (loading) return <Loading />;
	if (error) return <div>Error: {error}</div>;

	const { id_user, name, last_name, roles, email, project, department, site, manager, status } = data[0];
	const fullName = FullName(name, last_name);

	const timeline = [
		{
			title: "Hired",
			date: new Date(),
			detail: "Start date registrado por HR"
		},
		{
			title: "Contract signed",
			date: new Date() || "Awaiting documents",
			detail: "Full-time contract"
		},
		{
			title: "Role update",
			date: new Date() || "No updates yet",
			detail: roles || "Role pendiente"
		}
	];

	return (
		<ProtectedRoute>
			<div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
				<NavSide />

				<div className="ml-24 flex flex-1 flex-col">
					<Nav title={fullName}></Nav>

					<main className="flex-1 space-y-6 bg-gray-50 p-6">
						<section className="grid gap-6">
							<article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
								<div className="flex flex-wrap items-center gap-4">
									<div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-2xl font-semibold uppercase text-white">
										{GetNameInitials(name, last_name)}
									</div>
									<div className="min-w-[200px] flex-1">
										<div className="flex flex-wrap items-center gap-3">
											<h1 className="text-2xl font-semibold text-gray-900">{fullName}</h1>
											<span
												className={`rounded-full px-3 py-1 text-xs font-semibold ${
													status === "Active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
												}`}
											>
												{status}
											</span>
										</div>
										<p className="text-sm text-gray-500">{roles || "Team member"}</p>
										<p className="text-xs uppercase tracking-wide text-gray-400">Employee ID · {id_user}</p>
									</div>
									<div className="flex flex-wrap gap-2">
										<button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
											Actions
										</button>
										<button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
											Guardar cambios
										</button>
									</div>
								</div>

								<div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
									{[
										{ label: "Work email", value: email || "No email" },
										{ label: "Project", value: project || "Not assigned" },
										{ label: "Department", value: department || "Not assigned" },
										{ label: "Location", value: site || "Not assigned" }
									].map(item => (
										<div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-3">
											<p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</p>
											<p className="mt-1 text-sm font-medium text-gray-900">{item.value}</p>
										</div>
									))}
								</div>

								<div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
									<div className="flex items-center gap-2">
										<svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-3.866 0-7 1.79-7 4v4h14v-4c0-2.21-3.134-4-7-4z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
										</svg>
										<span>{new Date().toLocaleDateString()}</span>
									</div>
									{data[0]["He-hired"] && (
										<div className="flex items-center gap-2">
											<svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M8 7V3m8 4V3m-9 8h10m-12 9h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z"
												/>
											</svg>
											<span>Joined {FormatDate(data[0]["He-hired"])}</span>
										</div>
									)}
									<div className="flex items-center gap-2">
										<svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										{/* <span>{lastTrackedLabel}</span> */}
										<span>lastTrackedLabel</span>
									</div>
								</div>
							</article>
						</section>

						<section className="rounded-3xl border border-gray-200 bg-white shadow-sm">
							<div className="flex flex-wrap gap-1 border-b border-gray-200 px-4 pt-4 md:px-6">
								{UserPageTabs.map((tab: any) => (
									<button
										key={tab.id}
										onClick={() => setActiveTab(tab.id)}
										className={`px-4 py-3 text-sm font-semibold transition cursor-pointer ${
											activeTab === tab.id ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
										}`}
									>
										{tab.label}
									</button>
								))}
							</div>

							<div className="p-6">
								{activeTab === "INFO" && (
									<div className="space-y-8">
										<div className="rounded-3xl border border-gray-100 bg-gray-50/60 p-4 sm:p-6">
											<div className="flex flex-wrap items-center justify-between gap-4">
												<div>
													<h3 className="text-lg font-semibold text-gray-900">Identidad y acceso</h3>
													<p className="text-sm text-gray-500">Datos básicos que se utilizan en los reportes y aprobaciones.</p>
												</div>
												<button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
													Editar identidad
												</button>
											</div>
											<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
												<InfoField label="Employee ID" value={id_user} />
												<InfoField label="Status" value={status} />
												<InfoField label="Role" value={roles || "Not assigned"} />
											</div>
										</div>

										<div className="rounded-3xl border border-gray-100 bg-white p-4 sm:p-6">
											<div className="flex flex-wrap items-center justify-between gap-4">
												<div>
													<h3 className="text-lg font-semibold text-gray-900">Contacto</h3>
													<p className="text-sm text-gray-500">Mantén actualizados los canales de contacto del colaborador.</p>
												</div>
												<button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
													Editar contacto
												</button>
											</div>
											<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
												<InfoField label="Work email" value={email} placeholder="No work email" />
												<InfoField label="City" value={site} placeholder="Add city" />
											</div>
										</div>

										<div className="rounded-3xl border border-dashed border-gray-300 bg-white/40 p-4 sm:p-6">
											<h3 className="text-lg font-semibold text-gray-900">Preferencias laborales</h3>
											<div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
												<InfoField label="Manager" value={manager || "Sin asignar"} />
												<InfoField label="Team" value={department || "No team"} />
											</div>
										</div>
									</div>
								)}

								{activeTab === "EMPLOYMENT" && (
									<div className="space-y-6">
										<div className="rounded-3xl border border-gray-100 bg-gray-50/60 p-6">
											<h3 className="text-lg font-semibold text-gray-900">Employment timeline Example</h3>
											<div className="mt-6 space-y-6">
												{timeline.map((item, index) => (
													<div key={item.title} className="flex gap-4">
														<div className="flex flex-col items-center">
															<span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
																{index + 1}
															</span>
															{index !== timeline.length - 1 && <span className="h-full w-px bg-blue-100"></span>}
														</div>
														<div>
															<p className="text-sm font-semibold text-gray-900">{item.title}</p>
															<p className="text-xs text-gray-500">{new Date().toLocaleDateString()}</p>
															<p className="mt-2 text-sm text-gray-600">{item.detail}</p>
														</div>
													</div>
												))}
											</div>
										</div>

										<div className="grid gap-4 md:grid-cols-2">
											<div className="rounded-3xl border border-gray-200 bg-white p-5">
												<h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Contract details</h4>
												<div className="mt-4 space-y-3 text-sm text-gray-600">
													<p className="flex items-center justify-between">
														<span>Type</span>
														<span className="font-semibold text-gray-900">Full-time</span>
													</p>
													<p className="flex items-center justify-between">
														<span>Rate</span>
														<span className="font-semibold text-gray-900">$15/hr</span>
													</p>
													<p className="flex items-center justify-between">
														<span>Probation</span>
														<span className="font-semibold text-gray-900">Completed</span>
													</p>
												</div>
											</div>

											<div className="rounded-3xl border border-gray-200 bg-white p-5">
												<h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Projects</h4>
												<div className="mt-4 space-y-3 text-sm text-gray-600">
													<p className="flex items-center justify-between">
														<span>Primary project</span>
														<span className="font-semibold text-gray-900">No assignment</span>
													</p>
													<p className="flex items-center justify-between">
														<span>Billable</span>
														<span className="font-semibold text-gray-900">Standard</span>
													</p>
													<p className="flex items-center justify-between">
														<span>Last assignment</span>
														<span className="font-semibold text-gray-900">Recently</span>
													</p>
												</div>
											</div>
										</div>
									</div>
								)}
								{activeTab === "CAPTURE" && <div>Still working on it</div>}

								{activeTab === "SETTINGS" && (
									<div className="space-y-4">
										<div className="rounded-3xl border border-dashed border-gray-300 p-4 text-sm text-gray-600">
											Configura alertas y validaciones para mantener bajo control los accesos del colaborador.
										</div>
									</div>
								)}
							</div>
						</section>
					</main>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default PeoplePage;
