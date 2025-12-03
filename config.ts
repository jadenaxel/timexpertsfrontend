const API_URL_V1: string = "http://localhost:3001/api/v1";

const API_ENPOINT_V1: Record<string, string> = {
	GET_PEOPLE: `${API_URL_V1}/people`
};

const JWT_SECRET: string = process.env.JWT_SECRET || "test";
const ITEMS_PER_PAGE: number = 50;

export { API_URL_V1, API_ENPOINT_V1, JWT_SECRET, ITEMS_PER_PAGE };
