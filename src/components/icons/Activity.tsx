import type { JSX, FC } from "react";

const ActivityIcon: FC = (): JSX.Element => {
	return (
		<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 14l4-4 3 3 6-6" />
			<circle cx="17" cy="17" r="3" strokeWidth={2} />
			<line x1="19" y1="19" x2="21" y2="21" strokeWidth={2} strokeLinecap="round" />
		</svg>
	);
};

export default ActivityIcon;
