import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

const getErrorMessage = (error, fallback) =>
	error?.response?.data?.message ?? error?.message ?? fallback;

const invalidateConsultations = (queryClient) => {
	queryClient.invalidateQueries({ queryKey: ["consultations"] });
};

export const useConsultationsQuery = (options = {}) => {
	const {
		queryKey = ["consultations"],
		params,
		onError,
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey: params ? [...queryKey, params] : queryKey,
		queryFn: async () => {
			const response = await apiClient.get("/consultations", { params });
			return response.data?.data ?? [];
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(
				error,
				"Unable to fetch consultations. Please try again."
			);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useConsultationQuery = (consultationId, options = {}) => {
	const {
		queryKey = ["consultations", consultationId],
		onError,
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			if (!consultationId) {
				throw new Error("consultationId is required");
			}
			const response = await apiClient.get(`/consultations/${consultationId}`);
			return response.data?.data ?? null;
		},
		enabled: !!consultationId,
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(
				error,
				"Unable to fetch consultation details. Please try again."
			);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useCreateConsultationMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (payload) => {
			const response = await apiClient.post("/consultations", payload);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Consultation booked successfully");
			invalidateConsultations(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to book consultation. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

export const useUpdateConsultationMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async ({ consultationId, payload }) => {
			if (!consultationId) {
				throw new Error("consultationId is required to update a consultation");
			}

			const response = await apiClient.put(
				`/consultations/${consultationId}`,
				payload
			);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Consultation updated successfully");
			invalidateConsultations(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to update consultation. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

export const useDeleteConsultationMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (consultationId) => {
			if (!consultationId) {
				throw new Error("consultationId is required to delete a consultation");
			}

			const response = await apiClient.delete(
				`/consultations/${consultationId}`
			);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Consultation cancelled successfully");
			invalidateConsultations(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to cancel consultation. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};
