import type { JSX, FC } from "react";

import { ScheduleIcon } from "./icons";

import { IsFutureDate, IsSameDay, IsToday, MonthNames } from "@/utils";

const Calendar: FC<any> = (props: any): JSX.Element => {
	const { selectedDate, setShowCalendar, showCalendar, setSelectedDate, calendarDays }: any = props;

	return (
		<div className="relative">
			<button
				onClick={() => setShowCalendar(!showCalendar)}
				className="px-4 py-2 rounded-lg border border-gray-300 bg-white flex items-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer"
			>
				<span className="text-sm font-medium text-gray-900">
					{selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
				</span>
				<ScheduleIcon className="h-5 w-5" />
			</button>
			{showCalendar && (
				<div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-lg border border-gray-200 shadow-lg p-4 w-80">
					<div className="flex items-center justify-between mb-4">
						<button
							onClick={() => {
								const newDate = new Date(selectedDate);
								newDate.setMonth(newDate.getMonth() - 1);
								setSelectedDate(newDate);
							}}
							className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
						>
							<svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-gray-600">
								<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
							</svg>
						</button>
						<span className="text-sm font-semibold text-gray-900">
							{MonthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
						</span>
						<button
							onClick={() => {
								const newDate = new Date(selectedDate);
								newDate.setMonth(newDate.getMonth() + 1);
								const monthStart = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
								if (!IsFutureDate(monthStart)) {
									setSelectedDate(newDate);
								}
							}}
							disabled={IsFutureDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
							className={`p-1 rounded transition-colors ${
								IsFutureDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))
									? "opacity-50 cursor-not-allowed"
									: "hover:bg-gray-100 cursor-pointer"
							}`}
						>
							<svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-gray-600">
								<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
							</svg>
						</button>
					</div>

					<div className="grid grid-cols-7 gap-1 mb-2">
						{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
							<div key={day} className="text-center text-xs font-semibold text-gray-500 py-1">
								{day}
							</div>
						))}
					</div>
					<div className="grid grid-cols-7 gap-1">
						{calendarDays.map((day: any, index: number) => {
							if (day === null) return <div key={`empty-${index}`} className="aspect-square" />;

							const dayDate: Date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
							const isSelectedDay: boolean = IsSameDay(dayDate, selectedDate);
							const isTodayDay: boolean = IsToday(dayDate);
							const isFuture: boolean = IsFutureDate(dayDate);

							return (
								<button
									key={day}
									onClick={() => {
										if (!isFuture) {
											setSelectedDate(dayDate);
											setShowCalendar(false);
										}
									}}
									disabled={isFuture}
									className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
										isFuture
											? "text-gray-300 cursor-not-allowed"
											: isSelectedDay
											? "bg-blue-600 text-white font-semibold"
											: isTodayDay
											? "bg-blue-50 text-blue-600 font-semibold"
											: "text-gray-900 hover:bg-gray-100 cursor-pointer"
									}`}
								>
									{day}
								</button>
							);
						})}
					</div>
				</div>
			)}{" "}
		</div>
	);
};

export default Calendar;
