import type { JSX, FC } from "react";

import { FormatTimeUnit } from "@/../config";
import { Loading } from "@/components";

const MemberInfoWidget: FC<any> = (props: any): JSX.Element => {
	const { memberTimeDataDay, memberTimeDataWeek, memberTimeLoadingDay, memberTimeLoadingWeek } = props;

	return (
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
					{memberTimeLoadingDay && memberTimeLoadingWeek ? (
						<div className="p-7">
							<Loading />
						</div>
					) : (
						memberTimeDataDay?.map((member: any, index: number) => {
							const totalIntervalD = member.total_interval ?? {};
							const hoursD = FormatTimeUnit(totalIntervalD.hour);
							const minutesD = FormatTimeUnit(totalIntervalD.minutes);
							const secondsD = FormatTimeUnit(totalIntervalD.seconds);

							const totalIntervalW = memberTimeDataWeek?.[index]?.total_interval ?? {};
							const hoursW = FormatTimeUnit(totalIntervalW.hour);
							const minutesW = FormatTimeUnit(totalIntervalW.minutes);
							const secondsW = FormatTimeUnit(totalIntervalW.seconds);

							return (
								<div key={index} className="grid grid-cols-[1.5fr_0.9fr_1fr] items-center py-4 gap-4">
									<div className="flex items-center gap-3">
										<div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
											CLG
										</div>
										<div className="flex flex-col">
											<span className="text-sm font-semibold text-gray-900">{member.username}</span>
											<span className="text-sm text-gray-600">Cordoba Legal Group</span>
											<span className="text-xs text-gray-400">{member.state}</span>
										</div>
									</div>

									<span className="text-sm font-semibold text-gray-900 flex justify-end">
										{hoursD}:{minutesD}:{secondsD}
									</span>

									<div className="flex items-center justify-end gap-4">
										<span className="text-sm font-semibold text-gray-900">
											{hoursW}:{minutesW}:{secondsW}
										</span>

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
							);
						})
					)}
				</div>
			</div>
		</div>
	);
};

export default MemberInfoWidget;
