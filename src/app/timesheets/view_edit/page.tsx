"use client";

import type { FC, JSX } from "react";
import { useMemo, useState } from "react";
import { NavSide, Nav, ProtectedRoute, UserSelector, Calendar, ScheduleIcon } from "@/components";

interface User {
	id_user: string;
	name: string;
	last_name: string;
}

interface TimelineSegment {
	id: string;
	label: string;
	width: string;
	color: string;
}

interface DailyEntry {
	id: string;
	project: string;
	client: string;
	task: string;
	color: string;
	icon: string;
	activity: string;
	idle: string;
	manual: string;
	duration: string;
	time: string;
}

interface WeeklyRow {
	id: string;
	project: string;
	type: string;
	color: string;
	entries: Record<string, string>;
	total: string;
}

interface CalendarDay {
	id: string;
	label: string;
	month: string;
	date: number;
	events: {
		id: string;
		title: string;
		time: string;
		color: string;
	}[];
}

const mockUsers: User[] = [
	{ id_user: "H000001", name: "Adrianny Michell", last_name: "Jimenez Holguin" },
	{ id_user: "H000002", name: "Karen Ailin", last_name: "Caraballo Zabala" },
	{ id_user: "H000003", name: "Luis David", last_name: "Toribio Zayas" }
];

const timelineSegments: TimelineSegment[] = [
	{ id: "seg-1", label: "Cordoba Legal Group", width: "22%", color: "bg-fuchsia-500" },
	{ id: "seg-2", label: "Break", width: "6%", color: "bg-emerald-500" },
	{ id: "seg-3", label: "Cordoba Legal Group", width: "27%", color: "bg-fuchsia-500" },
	{ id: "seg-4", label: "Lunch", width: "8%", color: "bg-lime-600" },
	{ id: "seg-5", label: "Cordoba Legal Group", width: "25%", color: "bg-fuchsia-500" },
	{ id: "seg-6", label: "Meeting", width: "12%", color: "bg-teal-500" }
];

const dailyEntries: DailyEntry[] = [
	{
		id: "daily-1",
		project: "Cordoba Legal Group",
		client: "HIRED EXPERTS DR1",
		task: "No to-do",
		color: "bg-fuchsia-500",
		icon: "C",
		activity: "100%",
		idle: "0%",
		manual: "0%",
		duration: "0:00:02",
		time: "10:08 am - 10:08 am"
	},
	{
		id: "daily-2",
		project: "Cordoba Legal Group",
		client: "HIRED EXPERTS DR1",
		task: "No to-do",
		color: "bg-fuchsia-500",
		icon: "C",
		activity: "65%",
		idle: "0%",
		manual: "0%",
		duration: "1:52:08",
		time: "10:08 am - 12:00 pm"
	},
	{
		id: "daily-3",
		project: "BREAK",
		client: "HIRED EXPERTS DR1",
		task: "Work break",
		color: "bg-emerald-500",
		icon: "☕",
		activity: "-",
		idle: "-",
		manual: "-",
		duration: "0:15:50",
		time: "12:00 pm - 12:16 pm"
	},
	{
		id: "daily-4",
		project: "Cordoba Legal Group",
		client: "HIRED EXPERTS DR1",
		task: "No to-do",
		color: "bg-fuchsia-500",
		icon: "C",
		activity: "66%",
		idle: "0%",
		manual: "0%",
		duration: "1:24:20",
		time: "12:16 pm - 1:40 pm"
	},
	{
		id: "daily-5",
		project: "Bathroom $",
		client: "HIRED EXPERTS DR1",
		task: "Work break",
		color: "bg-lime-600",
		icon: "B",
		activity: "-",
		idle: "-",
		manual: "-",
		duration: "0:08:31",
		time: "1:40 pm - 1:48 pm"
	}
];

const weekDays = [
	{ key: "mon", label: "MON", month: "Dec", date: 1 },
	{ key: "tue", label: "TUE", month: "Dec", date: 2 },
	{ key: "wed", label: "WED", month: "Dec", date: 3 },
	{ key: "thu", label: "THU", month: "Dec", date: 4 },
	{ key: "fri", label: "FRI", month: "Dec", date: 5 },
	{ key: "sat", label: "SAT", month: "Dec", date: 6 },
	{ key: "sun", label: "SUN", month: "Dec", date: 7 }
];

const weeklyRows: WeeklyRow[] = [
	{
		id: "break",
		project: "BREAK",
		type: "Work break",
		color: "bg-emerald-500",
		entries: { mon: "0:15:03", tue: "0:30:09", wed: "0:29:34", thu: "0:29:55", fri: "0:29:29", sat: "-", sun: "-" },
		total: "2:14:10"
	},
	{
		id: "lunch",
		project: "LUNCH",
		type: "Work break",
		color: "bg-lime-600",
		entries: { mon: "0:28:51", tue: "0:30:45", wed: "0:29:09", thu: "0:29:07", fri: "0:29:16", sat: "-", sun: "-" },
		total: "2:27:08"
	},
	{
		id: "bathroom",
		project: "BATHROOM $",
		type: "Work break",
		color: "bg-blue-600",
		entries: { mon: "-", tue: "-", wed: "0:04:18", thu: "-", fri: "-", sat: "-", sun: "-" },
		total: "0:04:18"
	},
	{
		id: "meeting",
		project: "Meeting $",
		type: "Work break",
		color: "bg-teal-500",
		entries: { mon: "0:06:26", tue: "-", wed: "-", thu: "0:01:03", fri: "-", sat: "-", sun: "-" },
		total: "0:07:29"
	},
	{
		id: "cordoba",
		project: "Cordoba Legal Group",
		type: "No to-do",
		color: "bg-fuchsia-500",
		entries: { mon: "8:12:41", tue: "7:54:32", wed: "7:02:28", thu: "7:59:00", fri: "8:00:41", sat: "-", sun: "-" },
		total: "39:09:22"
	},
	{
		id: "all",
		project: "All projects / work orders",
		type: "",
		color: "bg-gray-200",
		entries: { mon: "9:03:01", tue: "8:59:44", wed: "8:01:11", thu: "8:59:05", fri: "8:59:26", sat: "-", sun: "-" },
		total: "44:02:27"
	}
];

const calendarDays: CalendarDay[] = [
	{
		id: "day-1",
		label: "MON",
		month: "Dec",
		date: 1,
		events: [
			{ id: "c1", title: "Cordoba Legal Group", time: "8:57 am - 2:30 pm", color: "bg-fuchsia-500" },
			{ id: "c2", title: "Lunch", time: "2:30 pm - 2:59 pm", color: "bg-lime-600" },
			{ id: "c3", title: "Cordoba Legal Group", time: "3:00 pm - 5:30 pm", color: "bg-fuchsia-500" },
			{ id: "c4", title: "Meeting", time: "5:00 pm - 5:15 pm", color: "bg-teal-500" }
		]
	},
	{
		id: "day-2",
		label: "TUE",
		month: "Dec",
		date: 2,
		events: [
			{ id: "c5", title: "Cordoba Legal Group", time: "9:00 am - 11:30 am", color: "bg-fuchsia-500" },
			{ id: "c6", title: "Lunch", time: "2:50 pm - 3:20 pm", color: "bg-lime-600" },
			{ id: "c7", title: "Cordoba Legal Group", time: "3:20 pm - 5:10 pm", color: "bg-fuchsia-500" },
			{ id: "c8", title: "Meeting", time: "5:10 pm - 5:25 pm", color: "bg-teal-500" }
		]
	},
	{
		id: "day-3",
		label: "WED",
		month: "Dec",
		date: 3,
		events: [
			{ id: "c9", title: "Cordoba Legal Group", time: "8:59 am - 11:05 am", color: "bg-fuchsia-500" },
			{ id: "c10", title: "Lunch", time: "11:05 am - 11:20 am", color: "bg-lime-600" },
			{ id: "c11", title: "Cordoba Legal Group", time: "11:20 am - 2:31 pm", color: "bg-fuchsia-500" }
		]
	},
	{
		id: "day-4",
		label: "THU",
		month: "Dec",
		date: 4,
		events: [
			{ id: "c12", title: "Cordoba Legal Group", time: "9:01 am - 11:15 am", color: "bg-fuchsia-500" },
			{ id: "c13", title: "Lunch", time: "11:15 am - 11:30 am", color: "bg-lime-600" },
			{ id: "c14", title: "Cordoba Legal Group", time: "11:30 am - 2:30 pm", color: "bg-fuchsia-500" },
			{ id: "c15", title: "Lunch", time: "2:59 pm - 5:00 pm", color: "bg-lime-600" }
		]
	},
	{
		id: "day-5",
		label: "FRI",
		month: "Dec",
		date: 5,
		events: [
			{ id: "c16", title: "Cordoba Legal Group", time: "9:00 am - 11:25 am", color: "bg-fuchsia-500" },
			{ id: "c17", title: "Lunch", time: "11:25 am - 11:40 am", color: "bg-lime-600" },
			{ id: "c18", title: "Cordoba Legal Group", time: "11:40 am - 2:30 pm", color: "bg-fuchsia-500" }
		]
	},
	{
		id: "day-6",
		label: "SAT",
		month: "Dec",
		date: 6,
		events: []
	},
	{
		id: "day-7",
		label: "SUN",
		month: "Dec",
		date: 7,
		events: []
	}
];

const viewOptions: Array<"daily" | "weekly" | "calendar"> = ["daily", "weekly", "calendar"];

const ViewEdit: FC = (): JSX.Element => {
	const [selectedUserId, setSelectedUserId] = useState<string>(mockUsers[0].id_user);
	const [selectedView, setSelectedView] = useState<"daily" | "weekly" | "calendar">("daily");

	const dateRangeLabel = useMemo(() => {
		if (selectedView === "daily") return "Mon, Dec 8, 2025 - Mon, Dec 8, 2025";
		return "Mon, Dec 1, 2025 - Sun, Dec 7, 2025";
	}, [selectedView]);

	const totalLabel = useMemo(() => {
		if (selectedView === "daily") return "Today: 8:51:18";
		return "Total: 44:02:27";
	}, [selectedView]);

	const renderDailyView = () => (
		<div className="space-y-8">
			{/* Timeline Section */}
			<div>
				<p className="text-base font-semibold text-gray-900">{totalLabel}</p>
				<div className="mt-4 relative">
					{/* Progress Bar */}
					<div className="relative flex h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
						{timelineSegments.map(segment => (
							<div key={segment.id} style={{ width: segment.width }} className={`h-full ${segment.color}`} title={segment.label}></div>
						))}
					</div>

					{/* Time Markers */}
					<div className="mt-2 relative h-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
						<span className="absolute left-[25%] -translate-x-1/2">6am</span>
						<span className="absolute left-[50%] -translate-x-1/2">12pm</span>
						<span className="absolute left-[75%] -translate-x-1/2">6pm</span>
					</div>

					{/* Current Time Indicator */}
					<div className="absolute top-0 left-[78%] h-3.5 w-0.5 bg-gray-800 rounded-full -translate-y-0.5 z-10"></div>
				</div>
			</div>

			{/* Entries Table */}
			<div className="bg-white">
				{/* Table Header */}
				<div className="border-b border-gray-100 py-3">
					<div className="grid grid-cols-[280px_repeat(7,1fr)_120px] items-center px-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">
						<span className="pl-8">Project / Work order</span>
						<span className="text-center">Activity</span>
						<span className="text-center">Idle</span>
						<span className="text-center">Manual</span>
						<span className="text-center">Duration</span>
						<span className="text-center">Time</span>
						<span className="text-center">Actions</span>
					</div>
				</div>

				{/* Table Body */}
				<div className="divide-y divide-gray-50">
					{dailyEntries.map(entry => (
						<div key={entry.id} className="grid grid-cols-[280px_repeat(7,1fr)_120px] items-center px-4 py-6 hover:bg-gray-50/30 transition-colors group">
							{/* Project Column */}
							<div className="flex items-start gap-4 pl-2">
								<div className="pt-1">
									<input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20" />
								</div>
								<div className="flex items-start gap-4">
									<div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm ${entry.color}`}>
										{entry.icon}
									</div>
									<div className="flex flex-col gap-0.5">
										<p className="text-sm font-bold text-gray-900">{entry.project}</p>
										<p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{entry.client}</p>
										<p className="text-sm font-medium text-gray-500">{entry.task}</p>
									</div>
								</div>
							</div>

							{/* Stats Columns */}
							<p className="text-center text-sm font-medium text-gray-700">{entry.activity}</p>
							<p className="text-center text-sm font-medium text-gray-500">{entry.idle}</p>
							<p className="text-center text-sm font-medium text-gray-500">{entry.manual}</p>

							{/* Duration & Time */}
							<div className="text-center">
								<p className="text-sm font-bold text-blue-600">{entry.duration} $</p>
							</div>
							<div className="text-center">
								<p className="text-sm font-medium text-blue-400">{entry.time}</p>
							</div>

							{/* Actions */}
							<div className="flex justify-end pr-2">
								<button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-600 shadow-sm hover:border-blue-300 hover:text-blue-600 transition-all">
									Actions
									<svg className="h-3 w-3 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
										<path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);

	const renderWeeklyView = () => (
		<div className="space-y-6">
			<p className="text-lg font-medium text-gray-900">{totalLabel}</p>
			<div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
				<div className="min-w-[1000px]">
					{/* Header Row */}
					<div className="grid grid-cols-[280px_repeat(7,1fr)_120px] divide-x divide-gray-100 border-b border-gray-100 bg-white">
						<div className="p-4 flex items-end pb-2">
							<span className="text-xs font-bold uppercase tracking-wider text-gray-400">Project / Work order</span>
						</div>
						{weekDays.map(day => (
							<div key={day.key} className="p-3 text-center">
								<div className="flex flex-col items-center justify-center">
									<span className="text-3xl font-light text-gray-900">{day.date}</span>
									<div className="flex flex-col leading-none">
										<span className="text-[10px] font-bold uppercase tracking-wider text-gray-900">{day.label}</span>
										<span className="text-[10px] font-medium text-gray-400">{day.month}</span>
									</div>
								</div>
							</div>
						))}
						<div className="p-4 flex items-end justify-end pb-2">
							<span className="text-xs font-bold uppercase tracking-wider text-gray-900">Total</span>
						</div>
					</div>

					{/* Rows */}
					<div className="divide-y divide-gray-100">
						{weeklyRows.map(row => (
							<div key={row.id} className="grid grid-cols-[280px_repeat(7,1fr)_120px] divide-x divide-gray-100 hover:bg-gray-50/50 transition-colors">
								{/* Project Info */}
								<div className="p-4 flex items-center gap-3">
									<div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ${row.color}`}>
										{row.project.charAt(0)}
									</div>
									<div className="flex flex-col min-w-0">
										<p className="truncate text-sm font-bold text-gray-900">{row.project}</p>
										{row.type && <p className="truncate text-xs text-gray-500">{row.type}</p>}
									</div>
								</div>

								{/* Days */}
								{weekDays.map(day => (
									<div key={day.key} className="flex items-center justify-center p-2">
										<span className={`text-sm ${row.entries[day.key] === "-" ? "text-gray-300" : "font-medium text-gray-700"}`}>{row.entries[day.key]}</span>
									</div>
								))}

								{/* Total */}
								<div className="flex items-center justify-end p-4 bg-gray-50/30">
									<span className="text-sm font-bold text-gray-900">{row.total}</span>
								</div>
							</div>
						))}
					</div>

					{/* Footer Totals Row (Mockup) */}
					<div className="grid grid-cols-[280px_repeat(7,1fr)_120px] divide-x divide-gray-100 border-t border-gray-100 bg-gray-50/50">
						<div className="p-4">
							<span className="text-sm font-bold text-gray-900">All projects / work orders</span>
						</div>
						{weekDays.map(day => (
							<div key={day.key} className="flex items-center justify-center p-3">
								<span className="text-sm font-bold text-gray-900">8:00:00</span>
							</div>
						))}
						<div className="flex items-center justify-end p-4">
							<span className="text-sm font-bold text-green-600">44:02:27</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const renderCalendarView = () => (
		<div className="space-y-6">
			<p className="text-lg font-medium text-gray-900">{totalLabel}</p>
			<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
				{/* Calendar Header */}
				<div className="grid grid-cols-7 gap-4 mb-4">
					{calendarDays.map(day => (
						<div key={day.id} className="text-center">
							<div className="flex flex-col items-center">
								<span className="text-4xl font-light text-gray-900">{day.date}</span>
								<div className="flex flex-col leading-none mt-1">
									<span className="text-[10px] font-bold uppercase tracking-wider text-gray-900">{day.label}</span>
									<span className="text-[10px] font-medium text-gray-400">{day.month}</span>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Calendar Grid */}
				<div className="grid grid-cols-7 gap-4 min-h-[600px]">
					{/* Time Labels Column (Implicit in design, but adding structure) */}
					{calendarDays.map(day => (
						<div key={day.id} className="relative flex flex-col gap-1 border-t border-gray-100 pt-2">
							{day.events.length === 0 ? (
								<div className="flex-1 rounded-xl border border-dashed border-gray-100 bg-gray-50/50"></div>
							) : (
								day.events.map(event => (
									<div
										key={event.id}
										className={`${event.color} relative flex flex-col justify-center rounded-lg p-3 text-white shadow-sm transition hover:brightness-105`}
										style={{ minHeight: event.title === "Lunch" ? "60px" : "140px" }} // Mock height based on duration
									>
										<div className="flex flex-col gap-0.5">
											<span className="text-[10px] font-bold opacity-90">{event.time}</span>
											<span className="text-xs font-bold leading-tight">{event.title}</span>
										</div>
									</div>
								))
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);

	return (
		<ProtectedRoute>
			<div className="flex min-h-screen bg-gray-50 text-gray-800">
				<NavSide />
				<div className="ml-24 flex flex-1 flex-col">
					<Nav title="Timesheets" />
					<main className="flex-1 space-y-8 p-8">
						<section className="flex flex-col gap-6">
							{/* Top Header: Title + View Switcher + Settings */}
							<div className="flex flex-wrap items-center justify-between gap-4">
								<h1 className="text-3xl font-normal text-gray-800">View & edit timesheets</h1>

								<div className="flex items-center gap-4">
									<div className="flex rounded-full bg-gray-100 p-1">
										{viewOptions.map(mode => (
											<button
												key={mode}
												onClick={() => setSelectedView(mode)}
												className={`min-w-[80px] rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all cursor-pointer ${
													selectedView === mode ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
												}`}
											>
												{mode}
											</button>
										))}
									</div>
									<button className="flex items-center gap-1 text-sm font-semibold text-blue-500 hover:text-blue-600">
										<svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
											<path
												fillRule="evenodd"
												d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
												clipRule="evenodd"
											/>
										</svg>
										Settings
									</button>
								</div>
							</div>

							{/* Filters Bar */}
							<div className="flex flex-wrap items-center justify-between gap-4">
								<div className="flex flex-wrap items-center gap-4">
									{/* Date Navigation */}
									<div className="flex items-center gap-2">
										<button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors">
											<svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
												<path d="M12 15l-5-5 5-5" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</button>
										<button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors">
											<svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
												<path d="M8 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</button>
										<div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
											<span className="text-sm font-medium text-gray-700">{dateRangeLabel}</span>
											<ScheduleIcon />
										</div>
									</div>
								</div>

								<div className="flex flex-wrap items-center gap-3">
									<div className="min-w-[280px]">
										<UserSelector users={mockUsers} selectedUserId={selectedUserId} onSelect={setSelectedUserId} />
									</div>

									<button className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-500 transition hover:bg-blue-50">
										Filters
									</button>

									<button className="rounded-lg bg-blue-500 px-8 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-600">Add time</button>
								</div>
							</div>
						</section>

						<section>
							{selectedView === "daily" && renderDailyView()}
							{selectedView === "weekly" && renderWeeklyView()}
							{selectedView === "calendar" && renderCalendarView()}
						</section>
					</main>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default ViewEdit;
