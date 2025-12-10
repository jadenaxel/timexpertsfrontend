"use client";

import type { FC } from "react";
import type { PeoplePageProps } from "@/types";

import { useState, use } from "react";

import { NavSide, Nav, ProtectedRoute, Loading, ScheduleIcon, ClockIcon, InfoIcon, ImageOverlay, Error } from "@/components";
import { useFetch } from "@/hooks";
import { API_ENPOINT_V1, FormatDate, FullName, GetNameInitials } from "@/../config";

import Tabs from "./tabs";

const PeoplePage: FC<PeoplePageProps> = ({ params }) => {
	const UserID: any = use(params as Promise<{ id: string }>);

	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	const { data, loading, error }: any = useFetch<any>(`${API_ENPOINT_V1.GET_PERSON_BY_ID}${UserID.id}`);

	if (loading) return <Loading full />;
	if (error) return <Error />;

	const { id_user, name, last_name, roles, email, project, department, site, status }: any = data.user[0];
	const fullName: string = FullName(name, last_name);

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
						<Tabs data={data} selectedDate={selectedDate} setSelectedDate={setSelectedDate} setSelectedImageIndex={setSelectedImageIndex} />
					</main>
				</div>

				<ImageOverlay
					images={data.screenshots}
					selectedIndex={selectedImageIndex ?? -1}
					onClose={() => {
						setSelectedImageIndex(null);
					}}
					onIndexChange={setSelectedImageIndex}
				/>
			</div>
		</ProtectedRoute>
	);
};

export default PeoplePage;
