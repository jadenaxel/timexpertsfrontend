import type { JSX, FC } from "react";
import type { WeeklyRow } from "@/types";

type WeekDayDisplay = { key: string; label: string; month: string; date: number };
type WeeklyViewProps = {
	totalLabel: string;
	weekDays: WeekDayDisplay[];
	rows: WeeklyRow[];
	dayTotals: Record<string, string>;
	weekTotal?: string;
};

const WeeklyView: FC<WeeklyViewProps> = ({ totalLabel, weekDays = [], rows = [], dayTotals = {}, weekTotal }: WeeklyViewProps): JSX.Element => {
	const totalValue: string = (weekTotal ?? totalLabel.replace(/^[^:]*:\s*/, "")) || "0:00:00";
	const hasData: boolean = rows.length > 0;

	return (
		<div className="space-y-6">
			<p className="text-lg font-medium text-gray-900">{totalLabel}</p>
			<div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
				<div className="min-w-[1000px]">
					<div className="grid grid-cols-[280px_repeat(7,1fr)_120px] divide-x divide-gray-100 border-b border-gray-100 bg-white">
						<div className="p-4 flex items-end pb-2">
							<span className="text-xs font-bold uppercase tracking-wider text-gray-400">Project / Work order</span>
						</div>
						{weekDays.map(day => (
							<div key={day.key} className="p-3 text-center">
								<div className="flex items-center justify-center gap-1">
									<span className="text-3xl font-bold text-gray-900">{day.date}</span>
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

					{hasData ? (
						<>
							<div className="divide-y divide-gray-100">
								{rows.map(row => (
									<div key={row.id} className="grid grid-cols-[280px_repeat(7,1fr)_120px] divide-x divide-gray-100 hover:bg-gray-50/50 transition-colors">
										<div className="p-4 flex items-center gap-3">
											<div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ${row.color}`}>
												{row.project.charAt(0)}
											</div>
											<div className="flex flex-col min-w-0">
												<p className="truncate text-sm font-bold text-gray-900">{row.project}</p>
												{row.type && <p className="truncate text-xs text-gray-500">{row.type}</p>}
											</div>
										</div>

										{weekDays.map(day => (
											<div key={day.key} className="flex items-center justify-center p-2">
												<span className={`text-sm ${row.entries[day.key] === "-" ? "text-gray-300" : "font-medium text-gray-700"}`}>
													{row.entries[day.key]}
												</span>
											</div>
										))}

										<div className="flex items-center justify-end p-4 bg-gray-50/30">
											<span className="text-sm font-bold text-gray-900">{row.total}</span>
										</div>
									</div>
								))}
							</div>

							<div className="grid grid-cols-[280px_repeat(7,1fr)_120px] divide-x divide-gray-100 border-t border-gray-100 bg-gray-50/50">
								<div className="p-4">
									<span className="text-sm font-bold text-gray-900">All projects / work orders</span>
								</div>
								{weekDays.map(day => (
									<div key={day.key} className="flex items-center justify-center p-3">
										<span className="text-sm font-bold text-gray-900">{dayTotals[day.key] ?? "-"}</span>
									</div>
								))}
								<div className="flex items-center justify-end p-4">
									<span className="text-sm font-bold text-green-600">{totalValue}</span>
								</div>
							</div>
						</>
					) : (
						<div className="p-8 text-center text-sm font-medium text-gray-500">No time data for this week.</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default WeeklyView;
