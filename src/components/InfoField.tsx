import type { JSX } from "react";
import type { InfoFieldProps } from "@/types";

const InfoField = ({ label, value, placeholder = "Not provided" }: InfoFieldProps): JSX.Element => {
	return (
		<div className="space-y-1">
			<p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
			<div className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900">{value ?? <span className="text-gray-400">{placeholder}</span>}</div>
		</div>
	);
};

export default InfoField;
