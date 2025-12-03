"use client";

import type { FC, JSX, ReactNode } from "react";

interface NavProps {
	title: string;
	children?: ReactNode;
}

const Nav: FC<NavProps> = ({ title, children }): JSX.Element => {
	return (
		<header className="w-full flex justify-between items-center px-8 py-4 bg-gray-50 border-b border-gray-200">
			<h1 className="text-3xl font-bold text-gray-800">{title}</h1>
			{children && <div className="flex-1 max-w-xl ml-8">{children}</div>}
		</header>
	);
};

export default Nav;
