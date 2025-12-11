import type { JSX, FC } from "react";

import { EncodeImage, CompanyName } from "@/../config";
import { FormatHour } from "@/utils";

const ActivityScreenshotsCard: FC<any> = (props: any): JSX.Element => {
	const { groupedScreenshots, currentDayScreenshots, setSelectedImageIndex } = props;

	return (
		<div className="space-y-8">
			{Object.entries(groupedScreenshots).map(([timeRange, screenshots]: [string, any]) => (
				<div key={timeRange} className="relative pl-8 border-l border-gray-200 z-0">
					<div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full border-2 border-gray-200 bg-white"></div>
					<div className="mb-4 flex items-baseline gap-4">
						<h3 className="text-lg font-medium text-gray-900">{timeRange}</h3>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 grid-flow-dense">
						{screenshots.map((item: any, index: number) => {
							const base64: string = EncodeImage(item.image_data);
							const overlayIndex = currentDayScreenshots.findIndex((s: any) => s === item);

							return (
								<div key={index} className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow">
									<div className="mb-2 flex justify-center">
										<span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">{CompanyName}</span>
									</div>
									<img
										src={`data:image/png;base64,${base64}`}
										alt=""
										className="w-full h-[150px] object-cover rounded-lg cursor-pointer transition hover:opacity-90 border border-gray-100"
										onClick={() => setSelectedImageIndex(overlayIndex)}
									/>

									<div className="mt-3 flex items-center justify-between">
										<span className="text-sm font-medium text-gray-700">{FormatHour(item.timestamp)}</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
};

export default ActivityScreenshotsCard;
