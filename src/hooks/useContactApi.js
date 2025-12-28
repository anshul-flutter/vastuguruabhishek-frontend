import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

// Helper function for error messages
const getErrorMessage = (error, fallback) =>
	error?.response?.data?.message ?? error?.message ?? fallback;

// CREATE contact form submission
export const useContactMutation = (options = {}) => {
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (payload) => {
			const response = await apiClient.post("/contact", payload);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(
				data?.message ??
					"Message sent successfully! We'll get back to you soon."
			);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to send message. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

// GET all contact enquiries (Admin only)
export const useContactEnquiriesQuery = (options = {}) => {
	const {
		queryKey = ["contact", "enquiries"],
		params,
		onError,
		...queryOptions
	} = options;

	return useQuery({
		queryKey: params ? [...queryKey, params] : queryKey,
		queryFn: async () => {
			const response = await apiClient.get("/contact", { params });
			return response.data?.data ?? [];
		},
		staleTime: 1000 * 60, // 1 minute
		onError: (error) => {
			const message = getErrorMessage(error, "Failed to fetch enquiries");
			toast.error(message);
			onError?.(error, message);
		},
		...queryOptions,
	});
};
