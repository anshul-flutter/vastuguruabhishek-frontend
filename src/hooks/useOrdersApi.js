import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

// Helper function for error messages
const getErrorMessage = (error, fallback) =>
	error?.response?.data?.message ?? error?.message ?? fallback;

// Invalidation helper
const invalidateOrders = (queryClient) => {
	queryClient.invalidateQueries({ queryKey: ["orders"] });
};

// GET all orders with filters (Admin)
export const useOrdersQuery = (options = {}) => {
	const { queryKey = ["orders"], params, onError, ...queryOptions } = options;

	return useQuery({
		queryKey: params ? [...queryKey, params] : queryKey,
		queryFn: async () => {
			const response = await apiClient.get("/orders", { params });
			return {
				data: response.data?.data ?? [],
				pagination: response.data?.pagination ?? null,
			};
		},
		staleTime: 1000 * 60, // 1 minute
		onError: (error) => {
			const message = getErrorMessage(error, "Failed to fetch orders");
			toast.error(message);
			onError?.(error, message);
		},
		...queryOptions,
	});
};

// GET my orders (Student)
export const useMyOrdersQuery = (options = {}) => {
	const {
		queryKey = ["orders", "my-orders"],
		params,
		onError,
		...queryOptions
	} = options;

	return useQuery({
		queryKey: params ? [...queryKey, params] : queryKey,
		queryFn: async () => {
			const response = await apiClient.get("/orders/my-orders", { params });
			return {
				data: response.data?.data ?? [],
				pagination: response.data?.pagination ?? null,
			};
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(error, "Failed to fetch your orders");
			toast.error(message);
			onError?.(error, message);
		},
		...queryOptions,
	});
};

// GET single order
export const useOrderQuery = (orderId, options = {}) => {
	const { queryKey = ["orders", orderId], onError, ...queryOptions } = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get(`/orders/${orderId}`);
			return response.data?.data ?? null;
		},
		enabled: !!orderId,
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(error, "Failed to fetch order");
			toast.error(message);
			onError?.(error, message);
		},
		...queryOptions,
	});
};

// UPDATE order status
export const useUpdateOrderStatusMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async ({ orderId, status }) => {
			const response = await apiClient.put(`/orders/${orderId}/status`, {
				status,
			});
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Order status updated successfully");
			invalidateOrders(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(error, "Failed to update order status");
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

// UPDATE payment status
export const useUpdatePaymentStatusMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async ({ orderId, paymentStatus }) => {
			const response = await apiClient.put(`/orders/${orderId}/payment`, {
				paymentStatus,
			});
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Payment status updated successfully");
			invalidateOrders(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(error, "Failed to update payment status");
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

// CREATE new order
export const useCreateOrderMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (payload) => {
			const response = await apiClient.post("/orders", payload);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Order created successfully");
			invalidateOrders(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(error, "Failed to create order");
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

// UPDATE order status for service bookings
export const useUpdateBookingStatusMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async ({ orderId, status }) => {
			const response = await apiClient.patch(`/orders/${orderId}/status`, {
				status,
			});
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Status updated successfully");
			invalidateOrders(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(error, "Failed to update status");
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

// GET service bookings (orders with service items)
export const useServiceBookingsQuery = (options = {}) => {
	const {
		queryKey = ["orders", "service-bookings"],
		params = { hasServiceItems: "true" },
		onError,
		...queryOptions
	} = options;

	const queryParams = { ...params, hasServiceItems: "true" };

	return useQuery({
		queryKey: [...queryKey, queryParams],
		queryFn: async () => {
			const response = await apiClient.get("/orders", { params: queryParams });
			return response.data?.data ?? [];
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(
				error,
				"Failed to fetch service bookings"
			);
			toast.error(message);
			onError?.(error, message);
		},
		...queryOptions,
	});
};
