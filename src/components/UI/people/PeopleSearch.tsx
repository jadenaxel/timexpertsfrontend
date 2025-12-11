import type { JSX, FC } from "react";

import { SearchIcon, XIcon } from "@/components";

const PLACEHOLDER: string = "Search by name, email or user ID";

const PoepleSearch: FC<any> = (props: any): JSX.Element => {
	const { searchQuery, setSearchQuery } = props;

	return (
		<div className="relative w-full">
			<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<SearchIcon />
			</div>
			<input
				type="text"
				value={searchQuery}
				onChange={e => setSearchQuery(e.target.value)}
				placeholder={PLACEHOLDER}
				className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
			/>
			{searchQuery && (
				<button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer">
					<XIcon />
				</button>
			)}
		</div>
	);
};

export default PoepleSearch;
