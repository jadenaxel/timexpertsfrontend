"use client";

import type { JSX } from 'react';

import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';

import { LogOutIcon, SettingsIcon, DashboardIcon, PayStubIcon, TransportationIcon, WarningIcon, ScheduleIcon } from "./index";


const NavSide = (): JSX.Element => {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const getLinkClass = (path: string) => {
        const baseClass = "h-12 w-full flex items-center transition-all duration-300 justify-start p-0 cursor-pointer";
        const activeClass = "bg-white/20 border-l-4 border-white text-white shadow-lg";
        const inactiveClass = "text-white/60 hover:text-white hover:bg-white/10";

        return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
    };

    return (
        <aside className="w-24 hover:w-64 bg-[#7e3a8a] flex flex-col py-8 fixed h-full left-0 top-0 z-50 transition-all duration-300 ease-in-out group overflow-x-hidden overflow-y-auto shadow-2xl scrollbar-thin">
            <div className="mb-12 w-full flex items-center transition-all">
                <div className="w-24 flex justify-center shrink-0">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-xl">T</div>
                </div>
                <span className="text-white font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                    TimeXperts
                </span>
            </div>
            <nav className="flex flex-col space-y-4 w-full">
                <Link href="/" className={getLinkClass("/")}>
                    <div className="w-24 flex justify-center shrink-0">
                        <DashboardIcon />
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">Dashboard</span>
                </Link>
                <button className="h-12 w-full text-white/60 hover:text-white hover:bg-white/10 flex items-center transition-all duration-300 justify-start p-0 cursor-pointer">
                    <div className="w-24 flex justify-center shrink-0">
                        <PayStubIcon />
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">PayStub</span>
                </button>
                <button className="h-12 w-full text-white/60 hover:text-white hover:bg-white/10 flex items-center transition-all duration-300 justify-start p-0 cursor-pointer">
                    <div className="w-24 flex justify-center shrink-0">
                        <WarningIcon />
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">Warning</span>
                </button>
                <button className="h-12 w-full text-white/60 hover:text-white hover:bg-white/10 flex items-center transition-all duration-300 justify-start p-0 cursor-pointer">
                    <div className="w-24 flex justify-center shrink-0">
                        <TransportationIcon />
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">Transportation</span>
                </button>
                <button className="h-12 w-full text-white/60 hover:text-white hover:bg-white/10 flex items-center transition-all duration-300 justify-start p-0 cursor-pointer">
                    <div className="w-24 flex justify-center shrink-0">
                        <ScheduleIcon />
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">Schedule</span>
                </button>
                <Link href="/settings" className={getLinkClass("/settings")}>
                    <div className="w-24 flex justify-center shrink-0">
                        <SettingsIcon />
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">Settings</span>
                </Link>
            </nav>
            <div className="mt-auto w-full">
                <button
                    className="h-12 w-full text-white/60 hover:text-white hover:bg-white/10 flex items-center transition-all duration-300 justify-start p-0 cursor-pointer"
                    onClick={() => router.push("/auth")}
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