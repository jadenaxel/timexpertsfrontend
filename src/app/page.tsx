"use client";

import type { JSX } from "react";

// Icons
import { LogOut, Settings, Dashboard } from "../icons";
import { redirect } from "next/navigation";

const Home = (): JSX.Element => {
	return (
		<div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
			{/* Sidebar */}
			<aside className="w-24 hover:w-64 bg-[#7e3a8a] flex flex-col py-8 fixed h-full left-0 top-0 z-50 transition-all duration-300 ease-in-out group overflow-hidden shadow-2xl">
				<div className="mb-12 w-full flex items-center transition-all">
					<div className="w-24 flex justify-center shrink-0">
						<div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
					</div>
					<span className="text-white font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
						TimeXperts
					</span>
				</div>
				<nav className="flex flex-col space-y-4 w-full">
					<button className="h-12 w-full bg-white/20 border-l-4 border-white flex items-center text-white shadow-lg transition-all duration-300 justify-start p-0 cursor-pointer">
						<div className="w-24 flex justify-center shrink-0">
							<Dashboard />
						</div>
						<span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">Dashboard</span>
					</button>
					<button className="h-12 w-full text-white/60 hover:text-white hover:bg-white/10 flex items-center transition-all duration-300 justify-start p-0 cursor-pointer">
						<div className="w-24 flex justify-center shrink-0">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
								/>
							</svg>
						</div>
						<span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">PayStub</span>
					</button>
					<button className="h-12 w-full text-white/60 hover:text-white hover:bg-white/10 flex items-center transition-all duration-300 justify-start p-0 cursor-pointer">
						<div className="w-24 flex justify-center shrink-0">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						</div>
						<span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">Warning</span>
					</button>
					<button className="h-12 w-full text-white/60 hover:text-white hover:bg-white/10 flex items-center transition-all duration-300 justify-start p-0 cursor-pointer">
						<div className="w-24 flex justify-center shrink-0">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
								/>
							</svg>
						</div>
						<span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">Transportation</span>
					</button>
					<button className="h-12 w-full text-white/60 hover:text-white hover:bg-white/10 flex items-center transition-all duration-300 justify-start p-0 cursor-pointer">
						<div className="w-24 flex justify-center shrink-0">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">Schedule</span>
					</button>
					<button className="h-12 w-full text-white/60 hover:text-white hover:bg-white/10 flex items-center transition-all duration-300 justify-start p-0 cursor-pointer">
						<div className="w-24 flex justify-center shrink-0">
							<Settings />
						</div>
						<span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">Settings</span>
					</button>
				</nav>
				<div className="mt-auto mb-8 w-full">
					<button
						className="h-12 w-full text-white/60 hover:text-white hover:bg-white/10 flex items-center transition-all duration-300 justify-start p-0 cursor-pointer"
						onClick={() => redirect("/auth")}
					>
						<div className="w-24 flex justify-center shrink-0">
							<LogOut />
						</div>
						<span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">Logout</span>
					</button>
				</div>
			</aside>

			{/* Main Content */}
			<main className="flex-1 ml-24 p-8">
				{/* Header */}
				<header className="flex justify-between items-center mb-10">
					<h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
					<div className="flex items-center space-x-6">
						<div className="relative">
							<input
								type="text"
								placeholder="Search"
								className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 w-64"
							/>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>
						<button className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
								/>
							</svg>
							<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
						</button>
						<div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white overflow-hidden">
							<img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
						</div>
					</div>
				</header>
			</main>
		</div>
	);
};

export default Home;
