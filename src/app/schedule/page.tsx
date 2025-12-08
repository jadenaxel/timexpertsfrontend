"use client";

import type { JSX } from "react";

import { NavSide, Nav, ProtectedRoute, UnderConstruction } from "@/components";

const Schedule = (): JSX.Element => {
	return (
		<ProtectedRoute>
			<div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
				<NavSide />

				{/* Main Content Wrapper */}
				<div className="flex-1 ml-24 flex flex-col">
					{/* Header */}
					<Nav title="Schedule" />

					{/* Page Content */}
					<main className="flex-1 p-8">
						<UnderConstruction description="This view will be available soon. Reach out if you need early access." />
					</main>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default Schedule;
