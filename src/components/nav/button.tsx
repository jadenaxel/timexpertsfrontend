"use client";

import type { FC, JSX } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavButton: FC<any> = ({ icon, href, title }: { icon: JSX.Element; href: string; title: string }): JSX.Element => {
	const pathname: string = usePathname();

	const isActive = (path: string): boolean => pathname === path;

	const getLinkClass = (path: string): string => {
		const baseClass = "h-12 w-full flex items-center transition-all duration-300 justify-start p-0 cursor-pointer";
		const activeClass = "bg-white/20 border-l-4 border-white text-white shadow-lg";
		const inactiveClass = "text-white/60 hover:text-white hover:bg-white/10";

		return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
	};

	return (
		<Link href={href} className={getLinkClass(href)}>
			<div className="w-24 flex justify-center shrink-0">{icon}</div>
			<span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">{title}</span>
		</Link>
	);
};

export default NavButton;
