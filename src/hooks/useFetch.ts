import { UseFetchOptions, UseFetchResult } from "@/types";

import { useState, useEffect, useCallback } from "react";
import { getAuthHeader } from "@/utils";

const useFetch = <T = any>(url: string, options: UseFetchOptions<T> = {}): UseFetchResult<T> => {
	const { method = "GET", init = {}, transformResponse } = options;

	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const optionsRef: UseFetchOptions<T> = useState(options)[0];

	const fetchData = useCallback(
		async (override?: Partial<UseFetchOptions<T>>) => {
			setLoading(true);
			setError(null);

			const finalOptions = { ...optionsRef, ...override } as UseFetchOptions<T>;
			const { method: m = "GET", init: i = {} } = finalOptions;

			const controller = new AbortController();
			const signal = controller.signal;

			const headers = {
				...getAuthHeader(),
				...(i.headers || {})
			};

			try {
				const response = await fetch(url, {
					method: m,
					signal,
					...i,
					headers
				});

				if (!response.ok) {
					const msg = `Request failed with status ${response.status}`;
					setError(msg);
					setLoading(false);
					return;
				}

				const parsed: T = transformResponse ? await transformResponse(response) : await response.json();
				setData(parsed);
			} catch (e: any) {
				if (e.name === "AbortError") {
					return;
				}
				setError(e.message || "Network error");
			} finally {
				setLoading(false);
			}
		},
		[url, optionsRef]
	);

	useEffect(() => {
		const controller = new AbortController();
		fetchData();
		return () => controller.abort();
	}, [url, method, JSON.stringify(init)]);

	return { data, loading, error, refetch: fetchData };
};

export default useFetch;
