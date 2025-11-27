"use client";

import type { JSX } from "react";

import { NavSide, Nav } from "@/components";

const Home = (): JSX.Element => {
	return (
		<div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
			{/* Sidebar */}
			<NavSide />

			{/* Main Content Wrapper */}
			<div className="flex-1 ml-24 flex flex-col">
				{/* Header */}
				<Nav title="Dashboard" />

				{/* Page Content */}
				<main className="flex-1 p-8"></main>
			</div>
		</div>
	);
};

export default Home;
