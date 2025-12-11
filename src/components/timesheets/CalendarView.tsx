import type { JSX, FC } from "react";
import type { CalendarDay } from "@/types";

type CalendarViewProps = {
	totalLabel: string;
	days?: CalendarDay[];
	loading?: boolean;
	error?: string | null;
};

const CalendarView: FC<CalendarViewProps> = ({ totalLabel, days = [], loading = false, error = null }: CalendarViewProps): JSX.Element => {
	const displayDays: CalendarDay[] = days ?? [];

	const renderMessage = (message: string, className: string) => (
		<div className="flex min-h-[600px] items-center justify-center text-sm font-medium">
			<span className={className}>{message}</span>
		</div>
	);

	return (
		<div className="space-y-6">
			<p className="text-lg font-medium text-gray-900">{totalLabel}</p>
			<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
				<div className="grid grid-cols-7 gap-4 mb-4">
					{displayDays.map(day => (
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

				{loading
					? renderMessage("Loading time entries...", "text-gray-500")
					: error
						? renderMessage(error, "text-red-600")
						: (
							<div className="grid grid-cols-7 gap-4 min-h-[600px]">
								{displayDays.map(day => (
									<div key={day.id} className="relative flex flex-col gap-1 border-t border-gray-100 pt-2">
										{day.events.length === 0 ? (
											<div className="flex-1 rounded-xl border border-dashed border-gray-100 bg-gray-50/50"></div>
										) : (
											day.events.map(event => {
												const isShortEvent: boolean = (event.title || "").toLowerCase().includes("lunch") || (event.title || "").toLowerCase().includes("break");
												return (
													<div
														key={event.id}
														className={`${event.color} relative flex flex-col justify-center rounded-lg p-3 text-white shadow-sm transition hover:brightness-105`}
														style={{ minHeight: isShortEvent ? "60px" : "140px" }}
													>
														<div className="flex flex-col gap-0.5">
															<span className="text-[10px] font-bold opacity-90">{event.time}</span>
															<span className="text-xs font-bold leading-tight">{event.title}</span>
														</div>
													</div>
												);
											})
										)}
									</div>
								))}
							</div>
						)}
			</div>
		</div>
	);
};

export default CalendarView;
