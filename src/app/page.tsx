"use client";

import type { JSX } from "react";

import { useMemo } from "react";

import { NavSide, Nav, ProtectedRoute, Loading, Error, ScreenShotsCard } from "@/components";
import { useFetch } from "@/hooks";
import { API_ENPOINT_V1 } from "@/../config";

type Member = {
	id: string;
	initials: string;
	name: string;
	company: string;
	status: string;
	todayPercent: number;
	todayTime: string;
	weekPercent: number;
	weekTime: string;
	bars: number[];
};

const membersData: Member[] = [
	{
		id: "ana-vinctoriano",
		initials: "AV",
		name: "Ana Victoriano",
		company: "Cordoba Legal Group",
		status: "No to-do",
		todayPercent: 90,
		todayTime: "0:12",
		weekPercent: 41,
		weekTime: "16:30",
		bars: [24, 30, 18, 22, 10]
	},
	{
		id: "marco-hsilva",
		initials: "MS",
		name: "Marco Silva",
		company: "Cordoba Legal Group",
		status: "2 open tasks",
		todayPercent: 72,
		todayTime: "1:05",
		weekPercent: 58,
		weekTime: "11:20",
		bars: [12, 18, 20, 26, 16]
	},
	{
		id: "sonia-framirez",
		initials: "SR",
		name: "Sonia Ramirez",
		company: "Cordoba Legal Group",
		status: "Review pending",
		todayPercent: 35,
		todayTime: "0:42",
		weekPercent: 63,
		weekTime: "09:10",
		bars: [20, 16, 26, 18, 22]
	},
	{
		id: "marco-ssilva",
		initials: "MS",
		name: "Marco Silva",
		company: "Cordoba Legal Group",
		status: "2 open tasks",
		todayPercent: 72,
		todayTime: "1:05",
		weekPercent: 63,
		weekTime: "11:20",
		bars: [12, 18, 20, 26, 16]
	},
	{
		id: "ana-avictoriano",
		initials: "AV",
		name: "Ana Victoriano",
		company: "Cordoba Legal Group",
		status: "No to-do",
		todayPercent: 90,
		todayTime: "0:12",
		weekPercent: 41,
		weekTime: "16:30",
		bars: [24, 30, 18, 22, 10]
	}
];

const Home = (): JSX.Element => {
	const { data, loading, error } = useFetch<any[]>(API_ENPOINT_V1.GET_LASTEST_SCREENSHOTS_PER_USER);
	// const { data: memberTimeData, loading: memberTimeLoading, error: memberTimeError } = useFetch<any[]>(API_ENPOINT_V1.GET_MEMBER_TIME);

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

						<div>
							<h1 className="text-xs font-semibold mb-3 uppercase tracking-[0.15em] text-gray-500">Recent Activity</h1>
							<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
								<div className="flex flex-col gap-6">
									{loading ? (
										<Loading />
									) : error ? (
										<Error />
									) : (
										groupedScreenShots.map(group => <ScreenShotsCard key={group.user} user={group.user} screenshots={group.screenshots} />)
									)}
								</div>
							</div>
						</div>

						{/* Members Info */}
						<div className="w-[530px] max-w-full">
							<h1 className="text-xs font-semibold mb-3 uppercase tracking-[0.15em] text-gray-500">Members</h1>
							<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 overflow-x-hidden">
								<div className="border-b border-gray-100">
									<div className="grid grid-cols-[1.2fr_0.9fr_1fr] text-xs font-semibold text-gray-500">
										<span className="uppercase">Member info</span>
										<span className="uppercase text-right">Today</span>
										<span className="uppercase text-right">This week</span>
									</div>
								</div>
								<div className="divide-y divide-gray-100">
									{membersData.map(member => (
										<div key={member.id} className="grid grid-cols-[1.5fr_0.9fr_1fr] items-center py-4 gap-4">
											<div className="flex items-center gap-3">
												<div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
													{member.initials}
												</div>
												<div className="flex flex-col">
													<span className="text-sm font-semibold text-gray-900">{member.name}</span>
													<span className="text-sm text-gray-600">{member.company}</span>
													<span className="text-xs text-gray-400">{member.status}</span>
												</div>
											</div>

											<span className="text-sm font-semibold text-gray-900 flex justify-end">{member.todayTime}</span>

											<div className="flex items-center justify-end gap-4">
												<span className="text-sm font-semibold text-gray-900">{member.weekTime}</span>

												{/* <div className="flex items-end gap-[3px]">
													{member.bars.map((height, index) => (
														<span
															key={height + index.toString()}
															className="w-[6px] rounded-md bg-sky-500"
															style={{ height: `${height}px`, opacity: index === member.bars.length - 1 ? 0.35 : 1 }}
														/>
													))}
													<span className="w-10 border-t border-dashed border-sky-400 self-center" />
												</div> */}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</main>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default Home;
