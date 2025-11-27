"use client";

import type { FC, JSX } from "react";

import { NavSide } from "@/components";

const Search: FC = (): JSX.Element => {
	return (
		<div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
			<NavSide />
		</div>
	);
};

export default Search;
