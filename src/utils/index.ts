// Import Auth Utils
import { validateToken } from "./auth-api";
import { hasToken, getToken, setToken, removeToken, getAuthHeader } from "./token";
import { normalizeTokenValue } from "./token-normalizer";

// Import Name Utils
import { FullName, GetNameInitials } from "./name";

// Import Time Utils
import {
	FormatDate,
	FormatHour,
	MonthNames,
	IsSameDay,
	IsToday,
	IsFutureDate,
	GenerateCalendar,
	FormatTimeUnit,
	StartOfDay,
	GetWeekStart,
	AddDays,
	FormatDuration,
	IntervalToSeconds,
	BuildWeekDays,
	ExtractDayEntries,
	TransformTimeData,
	BuildDailyEntries
} from "./time";

// Export Auth Utils
export { validateToken, hasToken, getToken, setToken, removeToken, getAuthHeader, normalizeTokenValue };

// Export Name Utils
export { FullName, GetNameInitials };

// Export Time Utils
export {
	FormatDate,
	FormatHour,
	MonthNames,
	IsSameDay,
	IsToday,
	IsFutureDate,
	GenerateCalendar,
	FormatTimeUnit,
	StartOfDay,
	GetWeekStart,
	AddDays,
	FormatDuration,
	IntervalToSeconds,
	BuildWeekDays,
	ExtractDayEntries,
	TransformTimeData,
	BuildDailyEntries
};
