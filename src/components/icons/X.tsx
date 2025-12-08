import type { JSX, FC } from "react";

const XIcon: FC = (): JSX.Element => {
	return (
		<svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
			<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
		</svg>
	);
};

export default XIcon;
