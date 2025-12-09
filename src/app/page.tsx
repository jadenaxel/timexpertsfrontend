"use client";

import type { JSX } from "react";

import { useMemo } from "react";

import { NavSide, Nav, ProtectedRoute, Loading, Error, ScreenShotsCard } from "@/components";
import { useFetch } from "@/hooks";
import { API_ENPOINT_V1 } from "@/../config";

const Home = (): JSX.Element => {
	const { data, loading, error } = useFetch<any[]>(API_ENPOINT_V1.GET_LASTEST_SCREENSHOTS_PER_USER);

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

	if (loading) return <Loading />;
	if (error) return <Error />;

	return (
		<ProtectedRoute>
			<div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
				<NavSide />
				<div className="flex-1 ml-24 flex flex-col">
					<Nav title="Dashboard" />

					<main className="flex-1 p-8">
						<div className="flex flex-col gap-6">
							{groupedScreenShots.map(group => (
								<ScreenShotsCard key={group.user} user={group.user} screenshots={group.screenshots} />
							))}
						</div>
					</main>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default Home;
