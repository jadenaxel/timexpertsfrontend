import type { JSX, FC } from "react";

import { Calendar, UserSelector } from "@/components";
import { IsToday, IsFutureDate } from "@/utils";

const ActivityScreenShotHeader: FC<any> = (props: any): JSX.Element => {
	const { selectedDate, setSelectedDate, showCalendar, setShowCalendar, calendarDays, usersData, selectedUser, setSelectedUser } = props;

	return (
		<div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2">
					<button
						onClick={() => {
							const newDate = new Date(selectedDate);
							newDate.setDate(newDate.getDate() - 1);
							setSelectedDate(newDate);
						}}
						className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
					>
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
						className={`p-2 rounded-lg border border-gray-200 transition-colors ${IsToday(selectedDate) ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
					>
						<svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-gray-600">
							<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
						</svg>
					</button>
				</div>

				<div className="h-8 w-px bg-gray-200"></div>

				<div className="relative min-w-[340px]">
					<UserSelector users={usersData || []} selectedUserId={selectedUser} onSelect={setSelectedUser} />
				</div>
			</div>
		</div>
	);
};

export default ActivityScreenShotHeader;
