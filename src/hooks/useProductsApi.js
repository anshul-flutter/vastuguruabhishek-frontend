import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

const getErrorMessage = (error, fallback) =>
	error?.response?.data?.message ?? error?.message ?? fallback;

const invalidateProducts = (queryClient) => {
	queryClient.invalidateQueries({ queryKey: ["products"] });
};

export const useProductsQuery = (options = {}) => {
	const {
		queryKey = ["products"],
		params,
		onError,
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey: params ? [...queryKey, params] : queryKey,
		queryFn: async () => {
			const response = await apiClient.get("/products", { params });
			return response.data?.data ?? [];
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(
				error,
				"Unable to fetch products. Please try again."
			);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useProductQuery = (productId, options = {}) => {
	const {
		queryKey = ["products", productId],
		onError,
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			if (!productId) {
				throw new Error("productId is required");
			}
			const response = await apiClient.get(`/products/${productId}`);
			return response.data?.data ?? null;
		},
		enabled: !!productId,
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(
				error,
				"Unable to fetch product details. Please try again."
			);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useCreateProductMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (formData) => {
			const response = await apiClient.post("/products", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Product created successfully");
			invalidateProducts(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to create product. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

export const useUpdateProductMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async ({ productId, payload }) => {
			if (!productId) {
				throw new Error("productId is required to update a product");
			}

			const config =
				payload instanceof FormData
					? {
							method: "put",
							url: `/products/${productId}`,
							data: payload,
							headers: { "Content-Type": "multipart/form-data" },
					  }
					: {
							method: "put",
							url: `/products/${productId}`,
							data: payload,
					  };

			const response = await apiClient.request(config);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Product updated successfully");
			invalidateProducts(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to update product. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

export const useDeleteProductMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (productId) => {
			if (!productId) {
				throw new Error("productId is required to delete a product");
			}

			const response = await apiClient.delete(`/products/${productId}`);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Product deleted successfully");
			invalidateProducts(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to delete product. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

export const useAddProductReviewMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async ({ productId, review }) => {
			if (!productId) {
				throw new Error("productId is required to add a review");
			}

			const response = await apiClient.post(
				`/products/${productId}/reviews`,
				review
			);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Review added successfully");
			invalidateProducts(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to add review. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};
