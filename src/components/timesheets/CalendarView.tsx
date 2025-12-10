import type { JSX, FC } from "react";
import type { CalendarDay } from "@/types";

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

const CalendarView: FC<any> = ({ totalLabel }: any): JSX.Element => {
	return (
		<div className="space-y-6">
			<p className="text-lg font-medium text-gray-900">{totalLabel}</p>
			<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
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

				<div className="grid grid-cols-7 gap-4 min-h-[600px]">
					{calendarDays.map(day => (
						<div key={day.id} className="relative flex flex-col gap-1 border-t border-gray-100 pt-2">
							{day.events.length === 0 ? (
								<div className="flex-1 rounded-xl border border-dashed border-gray-100 bg-gray-50/50"></div>
							) : (
								day.events.map(event => (
									<div
										key={event.id}
										className={`${event.color} relative flex flex-col justify-center rounded-lg p-3 text-white shadow-sm transition hover:brightness-105`}
										style={{ minHeight: event.title === "Lunch" ? "60px" : "140px" }}
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
};

export default CalendarView;
