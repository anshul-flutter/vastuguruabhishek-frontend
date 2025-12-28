import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

const getErrorMessage = (error, fallback) =>
	error?.response?.data?.message ?? error?.message ?? fallback;

const invalidateTickets = (queryClient) => {
	queryClient.invalidateQueries({ queryKey: ["tickets"] });
};

export const useTicketsQuery = (options = {}) => {
	const {
		queryKey = ["tickets"],
		params,
		onError,
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey: params ? [...queryKey, params] : queryKey,
		queryFn: async () => {
			const response = await apiClient.get("/ticket", { params });
			return response.data?.data ?? [];
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(
				error,
				"Unable to fetch tickets. Please try again."
			);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useTicketQuery = (ticketId, options = {}) => {
	const {
		queryKey = ["tickets", ticketId],
		onError,
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			if (!ticketId) {
				throw new Error("ticketId is required");
			}
			const response = await apiClient.get(`/ticket/${ticketId}`);
			return response.data?.data ?? null;
		},
		enabled: !!ticketId,
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(
				error,
				"Unable to fetch ticket details. Please try again."
			);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useCreateTicketMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (payload) => {
			const response = await apiClient.post("/ticket", payload);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Ticket created successfully");
			invalidateTickets(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to create ticket. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

export const useUpdateTicketMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (payload) => {
			const response = await apiClient.put("/ticket", payload);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Ticket updated successfully");
			invalidateTickets(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to update ticket. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

export const useDeleteTicketMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (ticketId) => {
			const response = await apiClient.delete("/ticket", {
				data: { ticketId },
			});
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Ticket deleted successfully");
			invalidateTickets(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to delete ticket. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};
