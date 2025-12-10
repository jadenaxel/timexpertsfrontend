import type { JSX, FC } from "react";

type DailyEntryDisplay = {
	id: string;
	project?: string;
	type?: string;
	activity?: string;
	duration?: string;
	durationSeconds?: number;
	color?: string;
	state?: string;
	total_interval?: any;
};
type DailyViewProps = { totalLabel: string; entries: DailyEntryDisplay[] };

const formatTimeUnit = (value?: number | string): string => String(value ?? 0).padStart(2, "0");
const durationToSeconds = (value?: string): number => {
	if (!value) return 0;
	const parts = value.split(":").map(Number);
	if (parts.length === 3 && parts.every(n => !Number.isNaN(n))) return parts[0] * 3600 + parts[1] * 60 + parts[2];
	return 0;
};

const getColorForLabel = (label: string): string => {
	const value = (label || "").toLowerCase();
	if (value.includes("break")) return "bg-emerald-500";
	if (value.includes("lunch")) return "bg-lime-600";
	if (value.includes("bathroom")) return "bg-blue-600";
	if (value.includes("meeting")) return "bg-teal-500";
	if (value.includes("coaching")) return "bg-orange-500";
	if (value.includes("cordoba")) return "bg-fuchsia-500";
	const palette = ["bg-sky-500", "bg-indigo-500", "bg-amber-500", "bg-rose-500", "bg-cyan-600", "bg-purple-500"];
	const hash = value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
	return palette[hash % palette.length];
};

const DailyView: FC<DailyViewProps> = ({ totalLabel, entries = [] }: DailyViewProps): JSX.Element => {
	const entriesWithDurations = entries.map(entry => {
		const totalInterval = entry.total_interval ?? {};

		const hours = Number(totalInterval.hour ?? totalInterval.hours ?? totalInterval.h ?? 0);
		const minutes = Number(totalInterval.minutes ?? totalInterval.mins ?? totalInterval.minute ?? 0);
		const seconds = Number(totalInterval.seconds ?? totalInterval.secs ?? totalInterval.second ?? 0);
		const secondsFromInterval = hours * 3600 + minutes * 60 + seconds;

		const fallbackSeconds = durationToSeconds(entry.duration);
		const normalizedSeconds = Number.isFinite(entry.durationSeconds || NaN) ? Number(entry.durationSeconds) : 0;
		const durationSeconds = normalizedSeconds || secondsFromInterval || fallbackSeconds || 0;

		return { ...entry, durationSeconds };
	});

	const totalSeconds: number = entriesWithDurations.reduce((acc: number, entry: DailyEntryDisplay & { durationSeconds?: number }) => acc + (entry.durationSeconds || 0), 0);
	const timelineSegments =
		totalSeconds > 0
			? entriesWithDurations.map(entry => {
					const label = entry.activity || entry.state || entry.project || "Work item";
					const color = entry.color || getColorForLabel(label);
					const width = totalSeconds > 0 ? ((entry.durationSeconds || 0) / totalSeconds) * 100 : 0;
					return {
						id: entry.id,
						label,
						width: `${width.toFixed(2)}%`,
						color
					};
			  })
			: [];

	return (
		<div className="space-y-8">
			<div>
				<p className="text-base font-semibold text-gray-900">{totalLabel}</p>
				<div className="mt-4 relative">
					<div className="relative flex h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
						{timelineSegments.length > 0
							? timelineSegments.map(segment => (
									<div key={segment.id} style={{ width: segment.width }} className={`h-full ${segment.color}`} title={segment.label}></div>
							  ))
							: null}
					</div>

					<div className="mt-2 relative h-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
						<span className="absolute left-[25%] -translate-x-1/2">6AM</span>
						<span className="absolute left-1/2 -translate-x-1/2">12PM</span>
						<span className="absolute left-[75%] -translate-x-1/2">6PM</span>
					</div>
				</div>
			</div>

			<div className="bg-white">
				<div className="border-b border-gray-100 py-3">
					<div className="grid grid-cols-[280px_repeat(3,1fr)_120px] items-center px-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">
						<span className="pl-8">Project / Work order</span>
						<span className="text-center">Activity</span>
						<span className="text-center">Duration</span>
						<span className="text-center">Actions</span>
					</div>
				</div>

				{entries.length === 0 ? (
					<div className="px-4 py-10 text-center text-sm font-medium text-gray-500">No time entries for the selected day.</div>
				) : (
					<div className="divide-y divide-gray-50">
						{entriesWithDurations.map((entry: any) => {
							const totalInterval = entry.total_interval ?? {};
							const hours = formatTimeUnit(totalInterval.hour ?? totalInterval.hours);
							const minutes = formatTimeUnit(totalInterval.minutes ?? totalInterval.mins);
							const seconds = formatTimeUnit(totalInterval.seconds ?? totalInterval.secs);
							const displayDuration = entry.duration || `${hours}:${minutes}:${seconds}`;
							const displayProject = entry.project || entry.state || entry.activity || "Work item";
							const activity = entry.activity || entry.state || entry.type || displayProject;
							const initials = displayProject.slice(0, 2).toUpperCase() || "W";
							const badgeColor = entry.color || getColorForLabel(displayProject);

							return (
								<div key={entry.id} className="grid grid-cols-[280px_repeat(3,1fr)_120px] items-center px-4 py-6 hover:bg-gray-50/30 transition-colors group">
									<div className="flex items-start gap-4 pl-2">
										<div className="pt-1">
											<input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer" />
										</div>
										<div className="flex items-start gap-4">
											<div
												className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm ${badgeColor}`}
											>
												{initials}
											</div>
											<div className="flex flex-col gap-0.5">
												<p className="text-sm font-bold text-gray-900">Cordoba Legal Group</p>
												<p className="text-xs text-gray-500">Hired Experts DR1</p>
											</div>
										</div>
									</div>

									<p className="text-center text-sm font-medium text-gray-700">{activity}</p>
									<div className="text-center">
										<p className="text-sm font-bold text-blue-600">{displayDuration}</p>
									</div>

									<div className="flex justify-center">
										<button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-600 shadow-sm hover:border-blue-300 hover:text-blue-600 transition-all cursor-pointer">
											Actions
											<svg className="h-3 w-3 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
												<path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</button>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};

export default DailyView;
