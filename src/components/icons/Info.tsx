import type { FC, JSX } from "react";

const InfoIcon: FC = (): JSX.Element => {
	return (
		<svg className="h-6 w-6 text-gray-400" fill="none" stroke="black" viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	);
};

export default InfoIcon;
