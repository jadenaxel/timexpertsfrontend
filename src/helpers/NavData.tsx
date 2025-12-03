import { DashboardIcon, PayStubIcon, WarningIcon, TransportationIcon, ScheduleIcon, SettingsIcon, SearchIcon, CreditIcon, PowerBIIcon, PeopleIcon } from "@/components";

const NavigationData = [
	{
		icon: <DashboardIcon />,
		href: "/",
		title: "Dashboard"
	},
	{
		icon: <SearchIcon />,
		href: "/search",
		title: "Search"
	},
	{
		icon: <PeopleIcon />,
		href: "/people",
		title: "People"
	},
	{
		icon: <CreditIcon />,
		href: "/adminpay",
		title: "Admin Pay"
	},
	{
		icon: <PowerBIIcon />,
		href: "/powerbi",
		title: "PowerBI"
	},
	{
		icon: <PayStubIcon />,
		href: "/paystub",
		title: "PayStub"
	},
	// {
	// 	icon: <WarningIcon />,
	// 	href: "/warning",
	// 	title: "Warning"
	// },
	// {
	// 	icon: <TransportationIcon />,
	// 	href: "/transportation",
	// 	title: "Transportation"
	// },
	{
		icon: <ScheduleIcon />,
		href: "/schedule",
		title: "Schedule"
	},
	{
		icon: <SettingsIcon />,
		href: "/settings",
		title: "Settings"
	}
];

export default NavigationData;
