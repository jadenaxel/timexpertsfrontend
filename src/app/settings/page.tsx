"use client";

import type { JSX } from "react";

import { NavSide } from "@/components";

const Settings = (): JSX.Element => {
	return (
		<div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
			<NavSide />
		</div>
	);
};

export default Settings;
