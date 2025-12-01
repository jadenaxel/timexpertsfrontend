"use client";

import type { FC, JSX } from "react";

import { NavSide, Nav, ProtectedRoute } from "@/components";

const Credit: FC = (): JSX.Element => {
	return (
		<ProtectedRoute>
			<div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
				<NavSide />

				{/* Main Content Wrapper */}
				<div className="flex-1 ml-24 flex flex-col">
					{/* Header */}
					<Nav title="Credit" />

					{/* Page Content */}
					<main className="flex-1 p-8"></main>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default Credit;
