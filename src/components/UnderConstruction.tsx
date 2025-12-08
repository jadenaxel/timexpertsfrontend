import type { FC, JSX, ReactNode } from "react";

interface UnderConstructionProps {
	title?: string;
	description?: ReactNode;
}

const UnderConstruction: FC<UnderConstructionProps> = ({
	title = "Page under construction",
	description = "We are working to enable this section very soon."
}): JSX.Element => {
	return (
		<section className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-gray-300 bg-white/80 p-10 text-center shadow-sm">
			<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 text-3xl text-white">⚠️</div>
			<div>
				<h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
				<p className="mt-2 text-sm text-gray-600">{description}</p>
			</div>
			<p className="text-xs uppercase tracking-wide text-gray-400">Thanks for your patience</p>
		</section>
	);
};

export default UnderConstruction;
