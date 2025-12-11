"use client";

import type { JSX } from "react";

import { useMemo } from "react";

import { NavSide, Nav, ProtectedRoute, ScreenShotsWidget, MemberInfoWidget } from "@/components";
import { useFetch } from "@/hooks";
import { API_ENPOINT_V1 } from "@/../config";

const Home = (): JSX.Element => {
	const { data, loading, error } = useFetch<any[]>(API_ENPOINT_V1.GET_LASTEST_SCREENSHOTS_PER_USER);
	const { data: memberTimeDataDay, loading: memberTimeLoadingDay } = useFetch<any[]>(API_ENPOINT_V1.GET_MEMBER_TIME_DAY);
	const { data: memberTimeDataWeek, loading: memberTimeLoadingWeek } = useFetch<any[]>(API_ENPOINT_V1.GET_MEMBER_TIME_WEEK);

	const groupedScreenShots = useMemo(() => {
		if (!Array.isArray(data) || data.length === 0) return [];

		const grouped = data.reduce<Record<string, any[]>>((acc, item) => {
			const key = item.user_name || "Sin usuario";
			if (!acc[key]) acc[key] = [];
			acc[key].push(item);
			return acc;
		}, {});

		return Object.entries(grouped).map(([user, screenshots]) => ({
			user,
			screenshots: [...screenshots].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
		}));
	}, [data]);

	return (
		<ProtectedRoute>
			<div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
				<NavSide />
				<div className="flex-1 ml-24 flex flex-col">
					<Nav title="Dashboard" />
					<main className="flex p-8 gap-x-4">
						{/* ScreenShots */}
						<ScreenShotsWidget loading={loading} error={error} groupedScreenShots={groupedScreenShots} />

						{/* Members Info */}
						<MemberInfoWidget
							memberTimeDataDay={memberTimeDataDay}
							memberTimeDataWeek={memberTimeDataWeek}
							memberTimeLoadingDay={memberTimeLoadingDay}
							memberTimeLoadingWeek={memberTimeLoadingWeek}
						/>
					</main>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default Home;
