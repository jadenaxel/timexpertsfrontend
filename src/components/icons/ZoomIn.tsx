import type { JSX, FC } from "react";

const ZoomInIcon: FC = (): JSX.Element => {
	return (
		<svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
			<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
		</svg>
	);
};

export default ZoomInIcon;
