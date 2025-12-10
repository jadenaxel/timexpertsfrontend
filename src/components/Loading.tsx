import type { FC, JSX } from "react";

const Loading: FC<any> = (props: any): JSX.Element => {
	return (
		<div className={`flex justify-center items-center ${props.full ? "h-screen" : ""}`}>
			<div className="loader"></div>
		</div>
	);
};

export default Loading;
