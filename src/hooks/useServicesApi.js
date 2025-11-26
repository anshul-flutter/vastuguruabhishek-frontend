import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

// Helper function for error messages
const getErrorMessage = (error, fallback) =>
	error?.response?.data?.message ?? error?.message ?? fallback;

// Invalidation helper
const invalidateServices = (queryClient) => {
	queryClient.invalidateQueries({ queryKey: ["services"] });
};

// GET all services
export const useServicesQuery = (options = {}) => {
	const { queryKey = ["services"], params, onError, ...queryOptions } = options;

	return useQuery({
		queryKey: params ? [...queryKey, params] : queryKey,
		queryFn: async () => {
			const response = await apiClient.get("/services", { params });
			return response.data?.data ?? [];
		},
		staleTime: 1000 * 60, // 1 minute
		onError: (error) => {
			const message = getErrorMessage(error, "Failed to fetch services");
			toast.error(message);
			onError?.(error, message);
		},
		...queryOptions,
	});
};

// GET single service
export const useServiceQuery = (serviceId, options = {}) => {
	const {
		queryKey = ["services", serviceId],
		onError,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get(`/services/${serviceId}`);
			return response.data?.data ?? null;
		},
		enabled: !!serviceId,
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(error, "Failed to fetch service");
			toast.error(message);
			onError?.(error, message);
		},
		...queryOptions,
	});
};

// CREATE service
export const useCreateServiceMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (payload) => {
			const response = await apiClient.post("/services", payload);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Service created successfully");
			invalidateServices(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(error, "Failed to create service");
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

// UPDATE service
export const useUpdateServiceMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async ({ serviceId, payload }) => {
			const response = await apiClient.put(`/services/${serviceId}`, payload);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Service updated successfully");
			invalidateServices(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(error, "Failed to update service");
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

// DELETE service
export const useDeleteServiceMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (serviceId) => {
			const response = await apiClient.delete(`/services/${serviceId}`);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Service deleted successfully");
			invalidateServices(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(error, "Failed to delete service");
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

// Note: Packages are fetched via useServicesQuery with params { serviceType: 'package' }
