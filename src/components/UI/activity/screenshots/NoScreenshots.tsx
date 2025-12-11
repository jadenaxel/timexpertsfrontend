import type { JSX, FC } from "react";

const NoScreenshots: FC<any> = (): JSX.Element => {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-3xl border border-dashed border-gray-200">
			<div className="rounded-full bg-gray-50 p-6 mb-4">
				<svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-12 w-12 text-gray-400">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
					/>
				</svg>
			</div>
			<h3 className="text-lg font-semibold text-gray-900 mb-2">No Screenshots Available</h3>
			<p className="text-sm text-gray-500 max-w-md">There are no screenshots for this user on the selected date.</p>
		</div>
	);
};

export default NoScreenshots;
