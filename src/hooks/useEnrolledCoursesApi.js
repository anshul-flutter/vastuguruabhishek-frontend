import { useQuery } from "@tanstack/react-query";
import apiClient from "../utils/apiClient";

// Hook to fetch user's enrolled courses
export const useEnrolledCoursesQuery = () => {
	return useQuery({
		queryKey: ["enrolled-courses"],
		queryFn: async () => {
			const response = await apiClient.get("/courses/enrolled");
			return response.data.data;
		},
	});
};
