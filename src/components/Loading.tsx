import type { FC, JSX } from "react";

const Loading: FC = (): JSX.Element => {
	return (
		<div className="flex justify-center items-center h-screen">
			<div className="loader"></div>
		</div>
	);
};

export default Loading;
