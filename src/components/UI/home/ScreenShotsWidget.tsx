import type { JSX, FC } from "react";

import { Loading, Error, ScreenShotsCard } from "@/components";

const ScreenShotsWidget: FC<any> = (props: any): JSX.Element => {
	const { loading, error, groupedScreenShots } = props;

	return (
		<div>
			<h1 className="text-xs font-semibold mb-3 uppercase tracking-[0.15em] text-gray-500">Recent Activity</h1>
			<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
				<div className="flex flex-col gap-6">
					{loading ? (
						<Loading />
					) : error ? (
						<Error />
					) : (
						groupedScreenShots.map((group: any) => <ScreenShotsCard key={group.user} user={group.user} screenshots={group.screenshots} />)
					)}
				</div>
			</div>
		</div>
	);
};

export default ScreenShotsWidget;
