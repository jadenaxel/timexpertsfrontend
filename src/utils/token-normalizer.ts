const WRAPPED_KEYS: string[] = ["token", "access_token", "accessToken", "jwt", "value"];

const stripWrappingQuotes = (value: string): string => {
	const first = value[0];
	const last = value[value.length - 1];

	if ((first === `"` && last === `"`) || (first === "'" && last === "'")) {
		return value.slice(1, -1);
	}

	return value;
};

const looksLikeJson = (value: string): boolean => {
	if (value.length < 2) return false;
	const first = value[0];
	const last = value[value.length - 1];
	return (first === "{" && last === "}") || (first === "[" && last === "]");
};

const normalizeTokenValue = (value: unknown): string | null => {
	if (value === null || value === undefined) return null;

	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) return null;

		if (looksLikeJson(trimmed)) {
			try {
				return normalizeTokenValue(JSON.parse(trimmed));
			} catch {
				const fallback = stripWrappingQuotes(trimmed).trim();
				return fallback || null;
			}
		}

		const cleaned = stripWrappingQuotes(trimmed).trim();
		return cleaned || null;
	}

	if (typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}

	if (Array.isArray(value)) {
		for (const entry of value) {
			const normalized = normalizeTokenValue(entry);
			if (normalized) return normalized;
		}
		return null;
	}

	if (typeof value === "object") {
		const record = value as Record<string, unknown>;
		for (const key of WRAPPED_KEYS) {
			if (key in record) {
				const normalized = normalizeTokenValue(record[key]);
				if (normalized) return normalized;
			}
		}
	}

	return null;
};

export { normalizeTokenValue };
