import { ScreenShotItem, TabType } from "@/types";

// Standard Config
const JWT_SECRET: string = process.env.JWT_SECRET || "test";
const CompanyName: string = "Cordoba Legal Group";
const ITEMS_PER_PAGE: number = 50;

const UserPageTabs: any[] = [
	{ id: "INFO" as TabType, label: "INFO" },
	{ id: "EMPLOYMENT" as TabType, label: "EMPLOYMENT" },
	{ id: "WORK_TIME" as TabType, label: "WORK TIME" },
	{ id: "CAPTURE" as TabType, label: "CAPTURES" }
];

const EncodeImage = (image: ScreenShotItem["image_data"]): string => {
	if (!image) return "";
	if (typeof image === "string") return image;
	try {
		if (image instanceof Uint8Array) {
			return Buffer.from(image).toString("base64");
		}
		if (typeof image === "object" && image !== null && "data" in image && Array.isArray((image as any).data)) {
			return Buffer.from((image as { data: number[] }).data).toString("base64");
		}
		return Buffer.from(image).toString("base64");
	} catch {
		return "";
	}
};

const FormatUserName = (user: string): string =>
	user
		.split(/[._\s]/)
		.filter(Boolean)
		.map(part => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ") || user;

export { JWT_SECRET, ITEMS_PER_PAGE, UserPageTabs, EncodeImage, CompanyName, FormatUserName };
