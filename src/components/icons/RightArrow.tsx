import type { JSX, FC } from "react";

const RightArrowIcon: FC = (): JSX.Element => {
	return (
		<svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-10 w-10">
			<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
		</svg>
	);
};

export default RightArrowIcon;
