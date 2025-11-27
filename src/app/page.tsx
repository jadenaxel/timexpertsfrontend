"use client";

import type { JSX } from "react";

import { NavSide } from "@/components";

const Home = (): JSX.Element => {
	return (
		<div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
			{/* Sidebar */}
			<NavSide />

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
