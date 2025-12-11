import type { JSX, FC } from "react";
import { type TabType, EnumTabType } from "@/types";

import { useState, useMemo } from "react";

import { UserPageTabs, CompanyName } from "@/../config";
import { API_ENPOINT_V1 } from "@/config";
import { Calendar, InfoField, Loading } from "@/components";
import { IsFutureDate, IsToday, FormatHour, GenerateCalendar } from "@/utils";

const formatTimeUnit = (value?: number | string): string => String(value ?? 0).padStart(2, "0");

const Tabs: FC<any> = (props: any): JSX.Element => {
	const [activeTab, setActiveTab] = useState<TabType>(EnumTabType.INFO);
	const [showCalendarCapture, setShowCalendarCapture] = useState<boolean>(false);
	const [showCalendarStart, setShowCalendarStart] = useState<boolean>(false);
	const [showCalendarEnd, setShowCalendarEnd] = useState<boolean>(false);
	const [startDate, setStartDate] = useState<Date>(new Date());
	const [endDate, setEndDate] = useState<Date>(new Date());
	const [trackingData, setTrackingData] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const { data, selectedDate, setSelectedDate, setSelectedImageIndex }: any = props;
	const { id_user, roles, email, department, site, manager, status }: any = data.user[0];

	const groupedScreenshots = useMemo(() => {
		if (!data?.screenshots) return {};

		const groups: { [key: string]: any[] } = {};

		const filteredScreenshots = data.screenshots.filter((screenshot: any) => {
			const screenshotDate = new Date(screenshot.timestamp);
			return (
				screenshotDate.getUTCFullYear() === selectedDate.getUTCFullYear() &&
				screenshotDate.getUTCMonth() === selectedDate.getUTCMonth() &&
				screenshotDate.getUTCDate() === selectedDate.getUTCDate()
			);
		});

		filteredScreenshots.forEach((screenshot: any) => {
			const start: Date = new Date(screenshot.timestamp);
			start.setUTCMinutes(0, 0, 0);
			const end: Date = new Date(start);
			end.setUTCHours(start.getUTCHours() + 1);

			const formatHourOnly: (d: Date) => string = (d: Date): string => {
				let h: number = d.getUTCHours();
				const ampm: string = h >= 12 ? "pm" : "am";
				h = h % 12;
				h = h ? h : 12;
				return `${h}:00 ${ampm}`;
			};

			const key: string = `${formatHourOnly(start)} - ${formatHourOnly(end)}`;

			if (!groups[key]) groups[key] = [];
			groups[key].push(screenshot);
		});

		return groups;
	}, [data?.screenshots, selectedDate]);

	const calendarDays: (number | null)[] = GenerateCalendar(selectedDate);

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

	const handleFetchInfo = async () => {
		const start: string = new Date(startDate).toISOString();
		const end: string = new Date(endDate).toISOString();

		setLoading(true);
		const response = await fetch(`${API_ENPOINT_V1.GET_PERSON_BY_ID}ltoribio/date`, {
			method: "POST",
			body: JSON.stringify({ from: start, to: end }),
			headers: {
				"Content-Type": "application/json"
			}
		});
		const data = await response.json();
		setTrackingData(data);
		setLoading(false);
	};

	return (
		<section className="rounded-3xl border border-gray-200 bg-white shadow-sm">
			<div className="flex flex-wrap gap-1 border-b border-gray-200 px-4 pt-4 md:px-6">
				{UserPageTabs.map((tab: any) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`px-4 py-3 text-sm font-semibold transition cursor-pointer ${activeTab === tab.id ? "text-blue-600" : "text-gray-500 hover:text-gray-900"}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div className="p-6">
				{activeTab === EnumTabType.INFO && (
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

				{activeTab === EnumTabType.EMPLOYMENT && (
					<div className="space-y-6">
						<div className="rounded-3xl border border-gray-100 bg-gray-50/60 p-6">
							<h3 className="text-lg font-semibold text-gray-900">Employment timeline</h3>
							<div className="mt-6 space-y-6">
								{timeline.map((item: any, index: number) => (
									<div key={item.title} className="flex gap-4">
										<div className="flex flex-col items-center">
											<span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">{index + 1}</span>
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

				{activeTab === EnumTabType.WORK_TIME && (
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<Calendar
								selectedDate={startDate}
								setShowCalendar={(val: boolean) => {
									setShowCalendarStart(val);
									if (val) setShowCalendarEnd(false);
								}}
								showCalendar={showCalendarStart}
								setSelectedDate={setStartDate}
								calendarDays={calendarDays}
							/>
							<Calendar
								selectedDate={endDate}
								setShowCalendar={(val: boolean) => {
									setShowCalendarEnd(val);
									if (val) setShowCalendarStart(false);
								}}
								showCalendar={showCalendarEnd}
								setSelectedDate={setEndDate}
								calendarDays={calendarDays}
							/>
							<button
								className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
								onClick={async () => await handleFetchInfo()}
							>
								Get info
							</button>
						</div>
						<div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50 border-b border-gray-200">
										<tr>
											<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Activity</th>
											<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total hours</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{trackingData.length === 0 &&
											(loading ? (
												<tr>
													<td colSpan={7} className="px-4 py-12 text-center">
														<Loading />
													</td>
												</tr>
											) : (
												<tr>
													<td colSpan={7} className="px-4 py-12 text-center">
														<div className="flex flex-col items-center justify-center text-gray-500">
															<svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 mb-2 text-gray-400">
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
																/>
															</svg>
															<p className="text-sm font-medium">No data available</p>
														</div>
													</td>
												</tr>
											))}
										{trackingData.length > 0 && loading ? (
											<tr>
												<td colSpan={7} className="px-4 py-12 text-center">
													<Loading />
												</td>
											</tr>
										) : (
											trackingData.map((item: any, index: number) => {
												const totalInterval = item.total_interval ?? {};
												const hours = formatTimeUnit(totalInterval.hour);
												const minutes = formatTimeUnit(totalInterval.minutes);
												const seconds = formatTimeUnit(totalInterval.seconds);

												return (
													<tr key={index} className="hover:bg-gray-50 transition-colors">
														<td className="px-4 py-3 text-sm font-medium text-gray-900">{item.state}</td>
														<td className="px-4 py-3 text-sm font-medium text-gray-900">
															{hours}:{minutes}:{seconds}
														</td>
													</tr>
												);
											})
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				)}

				{activeTab === EnumTabType.CAPTURE && (
					<div className="space-y-6">
						<div className="flex items-center justify-between gap-4 pb-4">
							<div className="flex items-center gap-2">
								<button
									onClick={() => {
										const newDate = new Date(selectedDate);
										newDate.setDate(newDate.getDate() - 1);
										setSelectedDate(newDate);
									}}
									className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
									title="Previous day"
								>
									<svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-gray-600">
										<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
									</svg>
								</button>
								<button
									onClick={() => {
										const newDate = new Date(selectedDate);
										newDate.setDate(newDate.getDate() + 1);
										if (!IsFutureDate(newDate)) {
											setSelectedDate(newDate);
										}
									}}
									disabled={IsToday(selectedDate)}
									className={`p-2 rounded-lg border border-gray-300 bg-white transition-colors ${
										IsToday(selectedDate) ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"
									}`}
									title={IsToday(selectedDate) ? "Cannot select future dates" : "Next day"}
								>
									<svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-gray-600">
										<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
									</svg>
								</button>
								<div className="relative">
									<Calendar
										selectedDate={selectedDate}
										setShowCalendar={setShowCalendarCapture}
										showCalendar={showCalendarCapture}
										setSelectedDate={setSelectedDate}
										calendarDays={calendarDays}
									/>
								</div>
							</div>
						</div>
						{Object.keys(groupedScreenshots).length > 0 ? (
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
															<span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">{CompanyName}</span>
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
							</div>
						) : (
							<div className="flex flex-col items-center justify-center py-16 text-center">
								<div className="rounded-full bg-gray-100 p-6 mb-4">
									<svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-12 w-12 text-gray-400">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
										/>
									</svg>
								</div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">No Screenshots Available</h3>
								<p className="text-sm text-gray-500 max-w-md">This agent has no screenshots for the selected date. Try selecting a different date.</p>
							</div>
						)}
					</div>
				)}
			</div>
		</section>
	);
};

export default Tabs;
