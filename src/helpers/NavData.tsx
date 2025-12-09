import type { NavigationItem } from "@/types";

import { DashboardIcon, PeopleIcon, ActivityIcon, ClockIcon } from "@/components";

const NavigationData: NavigationItem[] = [
	{
		icon: <DashboardIcon />,
		href: "/",
		title: "Dashboard"
	},
	{
		icon: <ClockIcon />,
		href: "/timesheets",
		title: "Timesheets",
		children: [{ href: "/timesheets/view_edit", title: "View & Edit" }]
	},
	{
		icon: <ActivityIcon />,
		href: "/activity",
		title: "Activity",
		children: [{ href: "/activity/screenshots", title: "Screenshots" }]
	},
	{
		icon: <PeopleIcon />,
		href: "/people",
		title: "People",
		children: [{ href: "/people/", title: "Members" }]
	}
	// {
	// 	icon: <SettingsIcon />,
	// 	href: "/settings",
	// 	title: "Settings"
	// }
];

export default NavigationData;
