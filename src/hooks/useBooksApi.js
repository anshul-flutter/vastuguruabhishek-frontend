import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

const getErrorMessage = (error, fallback) =>
	error?.response?.data?.message ?? error?.message ?? fallback;

const invalidateBooks = (queryClient) => {
	queryClient.invalidateQueries({ queryKey: ["books"] });
};

export const useBooksQuery = (options = {}) => {
	const { queryKey = ["books"], onError, select, ...queryOptions } = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get("/books");
			return response.data?.data ?? [];
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(
				error,
				"Unable to fetch books. Please try again."
			);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useCreateBookMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (formData) => {
			const response = await apiClient.post("/books", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Book created successfully");
			invalidateBooks(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to create book. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

export const useUpdateBookMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async ({ bookId, payload }) => {
			if (!bookId) {
				throw new Error("bookId is required to update a book");
			}

			const config =
				payload instanceof FormData
					? {
							method: "put",
							url: `/books/${bookId}`,
							data: payload,
							headers: { "Content-Type": "multipart/form-data" },
					  }
					: {
							method: "put",
							url: `/books/${bookId}`,
							data: payload,
					  };

			const response = await apiClient.request(config);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Book updated successfully");
			invalidateBooks(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to update book. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

export const useDeleteBookMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (bookId) => {
			if (!bookId) {
				throw new Error("bookId is required to delete a book");
			}

			const response = await apiClient.delete(`/books/${bookId}`);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Book deleted successfully");
			invalidateBooks(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to delete book. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};
