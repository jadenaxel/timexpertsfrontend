const API_URL_V1: string = process.env.API_URL !== undefined ? `${process.env.API_URL}/api/v1` : "http://localhost:3001/api/v1";

const API_ENPOINT_V1: Record<string, string> = {
	GET_PEOPLE: `${API_URL_V1}/people`,
	GET_PERSON_BY_ID: `${API_URL_V1}/people/`,
	GET_LASTEST_SCREENSHOTS_PER_USER: `${API_URL_V1}/dashboard/screenshots`,
	GET_MEMBER_TIME_DAY: `${API_URL_V1}/dashboard/time/day`,
	GET_MEMBER_TIME_WEEK: `${API_URL_V1}/dashboard/time/week`,
	GET_USER_TIME_DAILY: `${API_URL_V1}/timesheet/daily`,
	GET_USER_TIME_WEEKLY: `${API_URL_V1}/timesheet/weekly`
};

export { API_ENPOINT_V1, API_URL_V1 };
