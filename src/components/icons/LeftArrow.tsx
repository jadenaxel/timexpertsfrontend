import type { JSX, FC } from "react";

const LeftArrowIcon: FC = (): JSX.Element => {
	return (
		<svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-10 w-10">
			<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
		</svg>
	);
};

export default LeftArrowIcon;
