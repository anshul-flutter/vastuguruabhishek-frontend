import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

const getErrorMessage = (error, fallback) =>
	error?.response?.data?.message ?? error?.message ?? fallback;

const invalidateEvents = (queryClient) => {
	queryClient.invalidateQueries({ queryKey: ["events"] });
};

export const useEventsQuery = (options = {}) => {
	const {
		queryKey = ["events"],
		params,
		onError,
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey: params ? [...queryKey, params] : queryKey,
		queryFn: async () => {
			const response = await apiClient.get("/events", { params });
			return response.data?.data ?? [];
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(
				error,
				"Unable to fetch events. Please try again."
			);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useCreateEventMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (formData) => {
			const response = await apiClient.post("/events", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Event created successfully");
			invalidateEvents(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to create event. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

export const useUpdateEventMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async ({ eventId, payload }) => {
			if (!eventId) {
				throw new Error("eventId is required to update an event");
			}

			const config =
				payload instanceof FormData
					? {
							method: "put",
							url: `/events/${eventId}`,
							data: payload,
							headers: { "Content-Type": "multipart/form-data" },
					  }
					: {
							method: "put",
							url: `/events/${eventId}`,
							data: payload,
					  };

			const response = await apiClient.request(config);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Event updated successfully");
			invalidateEvents(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to update event. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

export const useDeleteEventMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (eventId) => {
			if (!eventId) {
				throw new Error("eventId is required to delete an event");
			}

			const response = await apiClient.delete(`/events/${eventId}`);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Event deleted successfully");
			invalidateEvents(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to delete event. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};
