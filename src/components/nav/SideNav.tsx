"use client";

import type { JSX } from "react";

import NavButton from "./button";
import { NavigationData } from "@/helpers";
import { LogOutIcon } from "../icons";
import { useAuth } from "@/contexts/auth-context";

const NavSide = (): JSX.Element => {
	const { logout: logoutClient } = useAuth();

	return (
		<aside className="w-24 hover:w-64 bg-[#7e3a8a] flex flex-col py-8 fixed h-full left-0 top-0 z-50 transition-all duration-300 ease-in-out group overflow-x-hidden overflow-y-auto shadow-2xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-white/30 hover:[&::-webkit-scrollbar-thumb]:rounded-full">
			<div className="mb-12 w-full flex items-center transition-all">
				<div className="w-24 flex justify-center shrink-0">
					<div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-xl">T</div>
				</div>
				<span className="text-white font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">TimeXperts</span>
			</div>
			<nav className="flex flex-col space-y-4 w-full mb-2">
				{NavigationData.map((item, index) => (
					<NavButton key={index} icon={item.icon} href={item.href} title={item.title} />
				))}
			</nav>
			<div className="mt-auto w-full">
				<button
					className="h-12 w-full text-white/60 hover:text-white hover:bg-white/10 flex items-center transition-all duration-300 justify-start p-0 cursor-pointer"
					onClick={() => {
						void logoutClient();
					}}
				>
					<div className="w-24 flex justify-center shrink-0">
						<LogOutIcon />
					</div>
					<span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">Logout</span>
				</button>
			</div>
		</aside>
	);
};

export default NavSide;
