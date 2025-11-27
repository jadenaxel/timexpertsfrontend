"use client";

import type { FC, JSX } from "react";

const Nav: FC<any> = ({ title }: { title: string }): JSX.Element => {
	return (
		<header className="w-full flex justify-between items-center px-8 py-4 bg-gray-50 border-b border-gray-200">
			<h1 className="text-3xl font-bold text-gray-800">{title}</h1>
		</header>
	);
};

export default Nav;
