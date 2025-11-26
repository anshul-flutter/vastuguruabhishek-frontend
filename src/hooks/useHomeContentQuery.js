import { useQuery } from "@tanstack/react-query";
import apiClient from "../utils/apiClient";

export function useHomeContentQuery(options = {}) {
	const { queryKey = ["homeContent"], ...queryOptions } = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const res = await apiClient.get("/home-content");
			// Controller returns { data: {...} }
			return res.data?.data ?? res.data ?? null;
		},
		staleTime: 1000 * 60 * 10, // 5 minutes
		retry: false,
		...queryOptions,
	});
}
