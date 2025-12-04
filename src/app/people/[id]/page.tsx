"use client";

import type { FC } from "react";
import type { PeoplePageProps, TabType } from "@/types";

import { useState, use, useMemo } from "react";

import { NavSide, Nav, ProtectedRoute, Loading, InfoField, ScheduleIcon, ClockIcon, InfoIcon } from "@/components";
import { useFetch } from "@/hooks";
import { API_ENPOINT_V1, FormatDate, FormatHour, FullName, GetNameInitials, UserPageTabs } from "@/../config";

const PeoplePage: FC<PeoplePageProps> = ({ params }) => {
	const UserID: any = use(params as Promise<{ id: string }>);
	const [activeTab, setActiveTab] = useState<TabType>("INFO");
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
	const [zoomLevel, setZoomLevel] = useState<number>(1);
	const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

	const { data, loading, error }: any = useFetch<any>(`${API_ENPOINT_V1.GET_PERSON_BY_ID}${UserID.id}`);

	const groupedScreenshots = useMemo(() => {
		if (!data?.screenshots) return {};

		const groups: { [key: string]: any[] } = {};

		data.screenshots.forEach((screenshot: any) => {
			const hour = new Date(screenshot.timestamp).getUTCHours();

			const start = new Date(screenshot.timestamp);
			start.setUTCMinutes(0, 0, 0);
			const end = new Date(start);
			end.setUTCHours(start.getUTCHours() + 1);

			const formatHourOnly = (d: Date) => {
				let h = d.getUTCHours();
				const m = d.getMinutes(); // always 0
				const ampm = h >= 12 ? "pm" : "am";
				h = h % 12;
				h = h ? h : 12;
				return `${h}:00 ${ampm}`;
			};

			const key = `${formatHourOnly(start)} - ${formatHourOnly(end)}`;

			if (!groups[key]) {
				groups[key] = [];
			}
			groups[key].push(screenshot);
		});

		return groups;
	}, [data?.screenshots]);

	if (loading) return <Loading />;
	if (error) return <div>Error: {error}</div>;

	console.log(data);
	console.log(data.screenshots);

	const { id_user, name, last_name, roles, email, project, department, site, manager, status }: any = data.user[0];
	const fullName: string = FullName(name, last_name);

	const timeline: any = [
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

	const InfoFields: any = [
		{ label: "Work email", value: email || "No email" },
		{ label: "Project", value: project || "Not assigned" },
		{ label: "Department", value: department || "Not assigned" },
		{ label: "Location", value: site || "Not assigned" }
	];

	return (
		<ProtectedRoute>
			<div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
				<NavSide />

				<div className="ml-24 flex flex-1 flex-col">
					<Nav title={fullName} />

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
									{InfoFields.map((item: any) => (
										<div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-3">
											<p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</p>
											<p className="mt-1 text-sm font-medium text-gray-900">{item.value}</p>
										</div>
									))}
								</div>

								<div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
									<div className="flex items-center gap-2">
										<ClockIcon />
										<span>{new Date().toLocaleDateString()}</span>
									</div>
									{data.user[0]["He-hired"] && (
										<div className="flex items-center gap-2">
											<ScheduleIcon />
											<span>Joined {FormatDate(data.user[0]["He-hired"])}</span>
										</div>
									)}
									<div className="flex items-center gap-2">
										<InfoIcon />
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
											<h3 className="text-lg font-semibold text-gray-900">Employment timeline</h3>
											<div className="mt-6 space-y-6">
												{timeline.map((item: any, index: number) => (
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
								{activeTab === "CAPTURE" && (
									<div className="space-y-8">
										{Object.entries(groupedScreenshots).map(([timeRange, screenshots]: [string, any]) => (
											<div key={timeRange} className="relative pl-8 border-l border-gray-200">
												<div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full border-2 border-gray-200 bg-white"></div>
												<div className="mb-4 flex items-baseline gap-4">
													<h3 className="text-lg font-medium text-gray-900">{timeRange}</h3>
												</div>
												<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 grid-flow-dense">
													{screenshots.map((item: any, index: number) => {
														const base64: string = Buffer.from(item.image_data).toString("base64");
														const globalIndex = data.screenshots.findIndex((s: any) => s === item);
														return (
															<div key={index} className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow">
																<div className="mb-2 flex justify-center">
																	<span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Cordoba Legal Group</span>
																</div>
																<img
																	src={`data:image/png;base64,${base64}`}
																	alt=""
																	className="w-full h-[150px] object-cover rounded-lg cursor-pointer transition hover:opacity-90 border border-gray-100"
																	onClick={() => setSelectedImageIndex(globalIndex)}
																/>

																<div className="mt-3 flex items-center justify-between">
																	<span className="text-sm font-medium text-gray-700">{FormatHour(item.timestamp)}</span>
																</div>
															</div>
														);
													})}
												</div>
											</div>
										))}
										{Object.keys(groupedScreenshots).length === 0 && <div className="text-center py-10 text-gray-500">No screenshots available</div>}
									</div>
								)}
							</div>
						</section>
					</main>
				</div>

				{selectedImageIndex !== null && (
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
						onClick={() => {
							setSelectedImageIndex(null);
							setZoomLevel(1);
							setPan({ x: 0, y: 0 });
						}}
						onWheel={e => {
							e.preventDefault();
							const delta = e.deltaY > 0 ? -0.1 : 0.1;
							setZoomLevel(prev => {
								const newZoom = Math.min(Math.max(0.5, prev + delta), 3);
								if (newZoom === 1) setPan({ x: 0, y: 0 });
								return newZoom;
							});
						}}
					>
						{/* Top Bar */}
						<div className="absolute left-4 top-4 text-lg font-medium text-white">
							{selectedImageIndex + 1} / {data.screenshots.length}
						</div>
						<button
							onClick={() => {
								setSelectedImageIndex(null);
								setZoomLevel(1);
								setPan({ x: 0, y: 0 });
							}}
							className="absolute right-4 top-4 text-white hover:text-gray-300 cursor-pointer"
						>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>

						{/* Zoom Controls */}
						<div className="absolute right-4 bottom-4 flex flex-col gap-2">
							<button
								onClick={e => {
									e.stopPropagation();
									setZoomLevel(prev => {
										const newZoom = Math.min(prev + 0.25, 3);
										if (prev === 1 && newZoom > 1) setPan({ x: 0, y: 0 });
										return newZoom;
									});
								}}
								className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/20 transition cursor-pointer"
								title="Zoom In"
							>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
									/>
								</svg>
							</button>
							<div className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium text-center">{Math.round(zoomLevel * 100)}%</div>
							<button
								onClick={e => {
									e.stopPropagation();
									setZoomLevel(prev => {
										const newZoom = Math.max(prev - 0.25, 0.5);
										if (newZoom === 1) setPan({ x: 0, y: 0 });
										return newZoom;
									});
								}}
								className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/20 transition cursor-pointer"
								title="Zoom Out"
							>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
									/>
								</svg>
							</button>
							<button
								onClick={e => {
									e.stopPropagation();
									setZoomLevel(1);
									setPan({ x: 0, y: 0 });
								}}
								className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/20 transition cursor-pointer text-xs"
								title="Reset Zoom"
							>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
									/>
								</svg>
							</button>
						</div>

						{/* Prev Button */}
						{selectedImageIndex > 0 && (
							<button
								onClick={e => {
									e.stopPropagation();
									setSelectedImageIndex(selectedImageIndex - 1);
									setZoomLevel(1);
									setPan({ x: 0, y: 0 });
								}}
								className="absolute left-4 p-2 text-white hover:text-gray-300 cursor-pointer transition hover:scale-110"
							>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-10 w-10">
									<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
								</svg>
							</button>
						)}

						{/* Image */}
						<img
							src={`data:image/png;base64,${Buffer.from(data.screenshots[selectedImageIndex].image_data).toString("base64")}`}
							alt={`Screenshot ${selectedImageIndex + 1}`}
							className={`max-h-[90vh] max-w-[80vw] object-contain shadow-2xl transition-transform duration-200 select-none ${
								zoomLevel > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
							}`}
							style={{
								transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)`,
								transformOrigin: "center"
							}}
							onClick={e => e.stopPropagation()}
							onMouseDown={e => {
								if (zoomLevel > 1) {
									e.preventDefault();
									e.stopPropagation();
									setIsDragging(true);
									setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
								}
							}}
							onMouseMove={e => {
								if (isDragging && zoomLevel > 1) {
									e.preventDefault();
									setPan({
										x: e.clientX - dragStart.x,
										y: e.clientY - dragStart.y
									});
								}
							}}
							onMouseUp={() => setIsDragging(false)}
							onMouseLeave={() => setIsDragging(false)}
						/>

						{/* Next Button */}
						{selectedImageIndex < data.screenshots.length - 1 && (
							<button
								onClick={e => {
									e.stopPropagation();
									setSelectedImageIndex(selectedImageIndex + 1);
									setZoomLevel(1);
									setPan({ x: 0, y: 0 });
								}}
								className="absolute right-4 p-2 text-white hover:text-gray-300 cursor-pointer transition hover:scale-110"
							>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-10 w-10">
									<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
								</svg>
							</button>
						)}
					</div>
				)}
			</div>
		</ProtectedRoute>
	);
};

export default PeoplePage;
