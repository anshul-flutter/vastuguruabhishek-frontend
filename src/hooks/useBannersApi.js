import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../utils/apiClient";
import toast from "react-hot-toast";

// Fetch all banners for admin
export const useAdminBannersQuery = () => {
	return useQuery({
		queryKey: ["admin-banners"],
		queryFn: async () => {
			const response = await apiClient.get("/banners");
			return response.data.data;
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

// Fetch all banners for public display
export const useBannersQuery = () => {
	return useQuery({
		queryKey: ["banners"],
		queryFn: async () => {
			const response = await apiClient.get("/banners");
			return response.data.data;
		},
		staleTime: 1000 * 60 * 15, // 15 minutes - banners change rarely
		cacheTime: 1000 * 60 * 60, // 1 hour cache
		retry: 2, // Retry failed requests
		refetchOnMount: false, // Don't refetch on component mount if data is fresh
		refetchOnReconnect: true, // Refetch when coming back online
	});
};

// Fetch single banner by ID
export const useBannerQuery = (id) => {
	return useQuery({
		queryKey: ["banner", id],
		queryFn: async () => {
			const response = await apiClient.get(`/banners/${id}`);
			return response.data.data;
		},
		enabled: !!id,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

// Create banner mutation
export const useCreateBannerMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (bannerData) => {
			const formData = new FormData();

			// Append all banner fields
			formData.append("title", bannerData.title);
			formData.append("description", bannerData.description);
			formData.append("buttonText", bannerData.buttonText || "Learn More");
			formData.append("link", bannerData.link || "");
			formData.append("background", bannerData.background || "#bb1401");
			formData.append(
				"isFullImageBanner",
				bannerData.isFullImageBanner || false
			);

			// Append image if provided
			if (bannerData.image) {
				formData.append("image", bannerData.image);
			}

			const response = await apiClient.post("/banners", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
			queryClient.invalidateQueries({ queryKey: ["banners"] });
			toast.success("Banner created successfully!");
		},
		onError: (error) => {
			const message =
				error.response?.data?.message || "Failed to create banner";
			toast.error(message);
			console.error("Create banner error:", error);
		},
	});
};

// Update banner mutation
export const useUpdateBannerMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, bannerData }) => {
			const formData = new FormData();

			// Append all banner fields
			formData.append("title", bannerData.title);
			formData.append("description", bannerData.description);
			formData.append("buttonText", bannerData.buttonText || "Learn More");
			formData.append("link", bannerData.link || "");
			formData.append("background", bannerData.background || "#bb1401");
			formData.append(
				"isFullImageBanner",
				bannerData.isFullImageBanner || false
			);

			// Append image if provided
			if (bannerData.image) {
				formData.append("image", bannerData.image);
			}

			const response = await apiClient.put(`/banners/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
			queryClient.invalidateQueries({ queryKey: ["banners"] });
			queryClient.invalidateQueries({ queryKey: ["banner", data.data._id] });
			toast.success("Banner updated successfully!");
		},
		onError: (error) => {
			const message =
				error.response?.data?.message || "Failed to update banner";
			toast.error(message);
			console.error("Update banner error:", error);
		},
	});
};

// Delete banner mutation
export const useDeleteBannerMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id) => {
			const response = await apiClient.delete(`/banners/${id}`);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
			queryClient.invalidateQueries({ queryKey: ["banners"] });
			toast.success("Banner deleted successfully!");
		},
		onError: (error) => {
			const message =
				error.response?.data?.message || "Failed to delete banner";
			toast.error(message);
			console.error("Delete banner error:", error);
		},
	});
};
