import { useQuery } from "@tanstack/react-query";
import apiClient from "../utils/apiClient";

export const useAstrologersQuery = (options = {}) => {
	return useQuery({
		queryKey: ["astrologers"],
		queryFn: async () => {
			const response = await apiClient.get("/auth/astrologer");
			return response.data.astrologers || [];
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
		...options,
	});
};
