import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

const getErrorMessage = (error, fallbackMessage) =>
	error?.response?.data?.message ?? error?.message ?? fallbackMessage;

// Get all testimonials (public - for home page)
export const useTestimonialsQuery = (enabled = true) => {
	return useQuery({
		queryKey: ["testimonials"],
		queryFn: async () => {
			const response = await apiClient.get("/testimonials");
			return response.data;
		},
		enabled,
		staleTime: 10 * 60 * 1000, // 10 minutes - testimonials are quite static
		cacheTime: 60 * 60 * 1000, // 1 hour cache
		refetchOnMount: false, // Don't refetch if data is fresh
		refetchOnReconnect: true, // Refetch when coming back online
		onError: (error) => {
			const message = getErrorMessage(
				error,
				"Failed to load testimonials. Please try again."
			);
			toast.error(message);
		},
	});
};

// Get all testimonials for admin (includes pending/approved status)
export const useAdminTestimonialsQuery = (enabled = true) => {
	return useQuery({
		queryKey: ["admin", "testimonials"],
		queryFn: async () => {
			const response = await apiClient.get("/admin/testimonials");
			return response.data;
		},
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		onError: (error) => {
			const message = getErrorMessage(
				error,
				"Failed to load admin testimonials. Please try again."
			);
			toast.error(message);
		},
	});
};

// Get testimonial by ID
export const useTestimonialByIdQuery = (id, enabled = true) => {
	return useQuery({
		queryKey: ["testimonials", id],
		queryFn: async () => {
			const response = await apiClient.get(`/admin/testimonials/${id}`);
			return response.data;
		},
		enabled: enabled && !!id,
		onError: (error) => {
			const message = getErrorMessage(
				error,
				"Failed to load testimonial details. Please try again."
			);
			toast.error(message);
		},
	});
};

// Create testimonial mutation
export const useCreateTestimonialMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (testimonialData) => {
			const response = await apiClient.post(
				"/admin/testimonials",
				testimonialData
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
			queryClient.invalidateQueries({ queryKey: ["testimonials"] });
			toast.success("Testimonial created successfully!");
		},
		onError: (error) => {
			const message = getErrorMessage(error, "Failed to create testimonial");
			toast.error(message);
		},
	});
};

// Update testimonial mutation
export const useUpdateTestimonialMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, testimonialData }) => {
			const response = await apiClient.put(
				`/admin/testimonials/${id}`,
				testimonialData
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
			queryClient.invalidateQueries({ queryKey: ["testimonials"] });
			toast.success("Testimonial updated successfully!");
		},
		onError: (error) => {
			const message = getErrorMessage(error, "Failed to update testimonial");
			toast.error(message);
		},
	});
};

// Delete testimonial mutation
export const useDeleteTestimonialMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id) => {
			const response = await apiClient.delete(`/admin/testimonials/${id}`);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
			queryClient.invalidateQueries({ queryKey: ["testimonials"] });
			toast.success("Testimonial deleted successfully!");
		},
		onError: (error) => {
			const message = getErrorMessage(error, "Failed to delete testimonial");
			toast.error(message);
		},
	});
};
