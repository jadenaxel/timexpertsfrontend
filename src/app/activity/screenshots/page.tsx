"use client";

import type { JSX, FC } from "react";
import { useState, useMemo, useEffect } from "react";
import { NavSide, Nav, ProtectedRoute, Loading, Error, Calendar, ImageOverlay, UserSelector } from "@/components";
import { useFetch } from "@/hooks";
import { API_ENPOINT_V1, GenerateCalendar, FormatHour, IsToday, IsFutureDate, EncodeImage, CompanyName, FormatDate } from "@/../config";

const ActivityScreenshots: FC = (): JSX.Element => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [showCalendar, setShowCalendar] = useState<boolean>(false);
	const [selectedUser, setSelectedUser] = useState<any>("");
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

	// Fetch all users for the dropdown
	const { data: usersData, loading: usersLoading, error: usersError } = useFetch<any[]>(API_ENPOINT_V1.GET_PEOPLE);

	// Set default user when users are loaded
	useEffect(() => {
		if (usersData && usersData.length > 0 && !selectedUser) {
			setSelectedUser(usersData[0].id_user);
		}
	}, [usersData, selectedUser]);

	// Fetch selected user's data (including screenshots)
	const { data: userData, loading: userLoading }: any = useFetch<any>(selectedUser ? `${API_ENPOINT_V1.GET_PERSON_BY_ID}${selectedUser}` : null);

	const calendarDays = useMemo(() => GenerateCalendar(selectedDate), [selectedDate]);

	const groupedScreenshots = useMemo(() => {
		if (!userData?.screenshots) return {};

		const groups: { [key: string]: any[] } = {};

		const filteredScreenshots = userData.screenshots.filter((screenshot: any) => {
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
	}, [userData, selectedDate]);

	// Flatten screenshots for the overlay
	const currentDayScreenshots = useMemo(() => {
		return Object.values(groupedScreenshots).flat();
	}, [groupedScreenshots]);

	if (usersLoading) return <Loading />;
	if (usersError) return <Error />;

	return (
		<ProtectedRoute>
			<div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
				<NavSide />
				<div className="flex-1 ml-24 flex flex-col">
					<Nav title="Screenshots" />

					<main className="flex-1 p-8">
						{/* Controls Header */}
						<div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
							<div className="flex items-center gap-4">
								{/* Date Navigation */}
								<div className="flex items-center gap-2">
									<button
										onClick={() => {
											const newDate = new Date(selectedDate);
											newDate.setDate(newDate.getDate() - 1);
											setSelectedDate(newDate);
										}}
										className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
									>
										{/* To Component */}
										<svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-gray-600">
											<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
										</svg>
									</button>

									<div className="relative">
										<Calendar
											selectedDate={selectedDate}
											setShowCalendar={setShowCalendar}
											showCalendar={showCalendar}
											setSelectedDate={setSelectedDate}
											calendarDays={calendarDays}
										/>
									</div>

									<button
										onClick={() => {
											const newDate = new Date(selectedDate);
											newDate.setDate(newDate.getDate() + 1);
											if (!IsFutureDate(newDate)) {
												setSelectedDate(newDate);
											}
										}}
										disabled={IsToday(selectedDate)}
										className={`p-2 rounded-lg border border-gray-200 transition-colors ${
											IsToday(selectedDate) ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
										}`}
									>
										<svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-gray-600">
											<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
										</svg>
									</button>
								</div>

								<div className="h-8 w-px bg-gray-200"></div>

								{/* User Select */}
								<div className="relative min-w-[340px]">
									<UserSelector users={usersData || []} selectedUserId={selectedUser} onSelect={setSelectedUser} />
								</div>
							</div>
						</div>

						{/* Content */}
						{userLoading ? (
							<div className="flex h-64 items-center justify-center">
								<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
							</div>
						) : Object.keys(groupedScreenshots).length > 0 ? (
							<div className="space-y-8">
								{Object.entries(groupedScreenshots).map(([timeRange, screenshots]: [string, any]) => (
									<div key={timeRange} className="relative pl-8 border-l border-gray-200 z-0">
										<div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full border-2 border-gray-200 bg-white"></div>
										<div className="mb-4 flex items-baseline gap-4">
											<h3 className="text-lg font-medium text-gray-900">{timeRange}</h3>
										</div>
										<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 grid-flow-dense">
											{screenshots.map((item: any, index: number) => {
												const base64: string = EncodeImage(item.image_data);
												// Find index in the flattened array for the overlay
												const overlayIndex = currentDayScreenshots.findIndex(s => s === item);

												return (
													<div key={index} className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow">
														<div className="mb-2 flex justify-center">
															<span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">{CompanyName}</span>
														</div>
														<img
															src={`data:image/png;base64,${base64}`}
															alt=""
															className="w-full h-[150px] object-cover rounded-lg cursor-pointer transition hover:opacity-90 border border-gray-100"
															onClick={() => setSelectedImageIndex(overlayIndex)}
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
							<div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-3xl border border-dashed border-gray-200">
								<div className="rounded-full bg-gray-50 p-6 mb-4">
									<svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-12 w-12 text-gray-400">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
										/>
									</svg>
								</div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">No Screenshots Available</h3>
								<p className="text-sm text-gray-500 max-w-md">There are no screenshots for this user on the selected date.</p>
							</div>
						)}
					</main>

					<ImageOverlay
						images={currentDayScreenshots}
						selectedIndex={selectedImageIndex ?? -1}
						onClose={() => setSelectedImageIndex(null)}
						onIndexChange={setSelectedImageIndex}
					/>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default ActivityScreenshots;
