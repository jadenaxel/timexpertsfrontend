"use client";

import type { FC, JSX } from "react";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface NavChildItem {
	title: string;
	href: string;
}

interface NavButtonProps {
	icon: JSX.Element;
	href?: string;
	title: string;
	childrenItems?: NavChildItem[];
}

const normalizePath = (path: string = "/"): string => {
	const [clean] = path.split("?");
	const trimmed = clean.replace(/\/$/, "");
	return trimmed || "/";
};


const NavButton: FC<NavButtonProps> = ({ icon, href = "/", title, childrenItems = [] }): JSX.Element => {
	const pathname: string = usePathname();
	const router = useRouter();
	const hasChildren: boolean = childrenItems.length > 0;

	const matchesPath = (path: string): boolean => {
		const current = normalizePath(pathname);
		const target = normalizePath(path);
		return current === target || current.startsWith(`${target}/`);
	};

	const isActive = hasChildren ? childrenItems.some(child => matchesPath(child.href)) : matchesPath(href);
	const [isOpen, setIsOpen] = useState<boolean>(hasChildren && isActive);

	useEffect(() => {
		if (hasChildren && isActive) {
			setIsOpen(true);
		}
	}, [hasChildren, isActive]);

	const getTopLevelClass = (active: boolean): string => {
		const baseClass = "h-12 w-full flex items-center transition-all duration-300 justify-start p-0 cursor-pointer";
		const activeClass = "bg-white/20 border-l-4 border-white text-white shadow-lg";
		const inactiveClass = "text-white/60 hover:text-white hover:bg-white/10";
		return `${baseClass} ${active ? activeClass : inactiveClass}`;
	};

	const getChildClass = (active: boolean): string => {
		const baseClass = "h-10 w-full flex items-center transition-all duration-200 justify-start p-0 cursor-pointer text-sm";
		const activeClass = "text-white bg-white/10";
		const inactiveClass = "text-white/60 hover:text-white";
		return `${baseClass} ${active ? activeClass : inactiveClass}`;
	};

	const textVisibilityClass = "opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium";
	const dropdownId = useMemo(() => `nav-dropdown-${title.toLowerCase().replace(/\s+/g, "-")}`, [title]);

	const handleParentClick = (): void => {
		if (!hasChildren || childrenItems.length === 0) return;
		setIsOpen(true);
		const target = childrenItems[0]?.href;
		if (target) {
			void router.push(target);
		}
	};

	if (hasChildren) {
		return (
			<div className="w-full">
				<button
					type="button"
					className={getTopLevelClass(isActive)}
					onClick={handleParentClick}
					aria-expanded={isOpen}
					aria-controls={dropdownId}
				>
					<div className="w-24 flex justify-center shrink-0">{icon}</div>
					<span className={textVisibilityClass}>{title}</span>
					<span
						role="button"
						tabIndex={0}
						className="ml-auto pr-6 text-white/60 transition-colors duration-300 group-hover:text-white"
						onClick={event => {
							event.stopPropagation();
							setIsOpen(prev => !prev);
						}}
						onKeyDown={event => {
							if (event.key === "Enter" || event.key === " ") {
								event.preventDefault();
								event.stopPropagation();
								setIsOpen(prev => !prev);
							}
						}}
						aria-label={isOpen ? "Collapse section" : "Expand section"}
					>
						<svg
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
						</svg>
					</span>
				</button>
				<div
					id={dropdownId}
					className={`ml-2 overflow-hidden border-l border-white/10 transition-[max-height] duration-300 ease-in-out ${isOpen ? "max-h-96" : "max-h-0"}`}
				>
					<div className="flex flex-col py-2">
						{childrenItems.map(child => {
							const childActive = matchesPath(child.href);
							return (
								<Link key={`${child.title}-${child.href}`} href={child.href} className={getChildClass(childActive)}>
									<div className="w-24 flex justify-center shrink-0">
										<span className={`h-1.5 w-1.5 rounded-full ${childActive ? "bg-white" : "bg-white/40"}`} />
									</div>
									<span className={`${textVisibilityClass} text-sm`}>{child.title}</span>
								</Link>
							);
						})}
					</div>
				</div>
			</div>
		);
	}

	return (
		<Link href={href} className={getTopLevelClass(isActive)}>
			<div className="w-24 flex justify-center shrink-0">{icon}</div>
			<span className={textVisibilityClass}>{title}</span>
		</Link>
	);
};

export default NavButton;
