"use client";

import type { JSX, FC } from "react";

import { useState, useMemo, useEffect } from "react";

import { NavSide, Nav, ProtectedRoute, Loading, Error, ImageOverlay, ActivityScreenShotHeader, ActivityNoScreenshots, ActivityScreenshotsCard } from "@/components";
import { useFetch } from "@/hooks";
import { GenerateCalendar } from "@/utils";
import { API_ENPOINT_V1 } from "@/config";

const ActivityScreenshots: FC = (): JSX.Element => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [showCalendar, setShowCalendar] = useState<boolean>(false);
	const [selectedUser, setSelectedUser] = useState<any>("");
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

	const ENDPOINT: any = selectedUser ? `${API_ENPOINT_V1.GET_PERSON_BY_ID}${selectedUser}` : null;

	const { data: usersData, loading: usersLoading, error: usersError } = useFetch<any[]>(API_ENPOINT_V1.GET_PEOPLE);
	const { data: userData, loading: userLoading }: any = useFetch<any>(ENDPOINT);

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

	const currentDayScreenshots = useMemo(() => {
		return Object.values(groupedScreenshots).flat();
	}, [groupedScreenshots]);

	useEffect(() => {
		if (usersData && usersData.length > 0 && !selectedUser) {
			setSelectedUser(usersData[0].id_user);
		}
	}, [usersData, selectedUser]);

	if (usersLoading) return <Loading full />;
	if (usersError) return <Error />;

	return (
		<ProtectedRoute>
			<div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
				<NavSide />
				<div className="flex-1 ml-24 flex flex-col">
					<Nav title="Screenshots" />

					<main className="flex-1 p-8">
						{usersData && usersData.length > 0 && (
							<ActivityScreenShotHeader
								selectedDate={selectedDate}
								setSelectedDate={setSelectedDate}
								showCalendar={showCalendar}
								setShowCalendar={setShowCalendar}
								calendarDays={calendarDays}
								usersData={usersData}
								selectedUser={selectedUser}
								setSelectedUser={setSelectedUser}
							/>
						)}

						{userLoading ? (
							<Loading />
						) : Object.keys(groupedScreenshots).length > 0 ? (
							<ActivityScreenshotsCard
								groupedScreenshots={groupedScreenshots}
								currentDayScreenshots={currentDayScreenshots}
								setSelectedImageIndex={setSelectedImageIndex}
							/>
						) : (
							<ActivityNoScreenshots />
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
