import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

export const CART_QUERY_KEY = ["cart"];

const resolveErrorMessage = (error, fallback) =>
	error?.response?.data?.message ?? error?.message ?? fallback;

const buildImageUrl = (imagePath) => {
	if (!imagePath) return null;
	if (imagePath.startsWith("http")) return imagePath;
	const baseUrl = import.meta.env.VITE_BACKEND_URL;
	if (!baseUrl) return imagePath;
	const normalizedPath = imagePath.startsWith("/")
		? imagePath.slice(1)
		: imagePath;
	return `${baseUrl}/${normalizedPath}`;
};

const transformCartItem = (item = {}) => {
	// Support both old (productId/kind) and new (itemId/itemType) structure
	const itemData = item.itemId ?? item.productId ?? item.product ?? {};
	const itemId =
		itemData._id ?? itemData.id ?? item.itemId ?? item.productId ?? item.id;

	// Use cached fields from cart model or fetch from populated item
	const price = Number(item.price ?? itemData.price ?? 0);
	const oldPrice = Number(
		itemData.oldPrice ?? itemData.actualPrice ?? item.oldPrice ?? price
	);
	const quantity = Number(item.quantity ?? 1);
	const title = item.title ?? itemData.name ?? itemData.title ?? "Item";
	const image = item.image ?? itemData.coverImage ?? itemData.image ?? null;
	const itemType = item.itemType ?? item.kind ?? "Product";

	return {
		id: item._id ?? item.id ?? itemId,
		cartItemId: item._id ?? item.id ?? null,
		itemId, // New field
		productId: itemId, // Keep for backward compatibility
		name: title,
		title,
		description: itemData.description ?? item.description ?? "",
		price,
		oldPrice,
		quantity,
		favorited: Boolean(item.favorited),
		image,
		imageUrl: buildImageUrl(image),
		itemType, // New field
		kind: itemType, // Keep for backward compatibility
		scheduledDate: item.scheduledDate ?? null,
		scheduledTime: item.scheduledTime ?? null,
		raw: item,
	};
};

const transformCartItems = (items = []) => items.map(transformCartItem);

const computeTotals = (items = []) => {
	const totals = items.reduce(
		(acc, item) => {
			acc.totalAmount += Number(item.price ?? 0) * Number(item.quantity ?? 0);
			acc.totalMRP +=
				Number(item.oldPrice ?? item.price ?? 0) * Number(item.quantity ?? 0);
			return acc;
		},
		{ totalMRP: 0, totalAmount: 0 }
	);

	totals.discount = Math.max(totals.totalMRP - totals.totalAmount, 0);

	return totals;
};

const extractCartPayload = (data) => {
	if (!data) return {};
	if (data.cart) return data.cart;
	if (data.data?.cart) return data.data.cart;
	if (data.data) return data.data;
	return data;
};

export const useCartQuery = (options = {}) => {
	const {
		queryKey = CART_QUERY_KEY,
		onError,
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get("/cart");
			const cartPayload = extractCartPayload(response.data);
			const rawItems = cartPayload?.items ?? [];
			const items = transformCartItems(rawItems);
			const totals = computeTotals(items);

			return {
				cart: { ...cartPayload, items: rawItems },
				items,
				totals,
			};
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = resolveErrorMessage(
				error,
				"Unable to load cart. Please try again."
			);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

const updateCacheItems = (queryClient, queryKey, updater) => {
	queryClient.setQueryData(queryKey, (previous) => {
		if (!previous) return previous;
		const nextItems = updater(previous.items ?? []);
		const totals = computeTotals(nextItems);
		return {
			...previous,
			items: nextItems,
			totals,
		};
	});
};

export const useUpdateCartItemMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const {
		onSuccess,
		onError,
		queryKey = CART_QUERY_KEY,
		showSuccessToast = true,
		...mutationOptions
	} = options;

	return useMutation({
		mutationFn: async ({ itemId, productId, quantity }) => {
			// Support both itemId (new) and productId (old) for backward compatibility
			const id = itemId ?? productId;
			if (!id || typeof quantity === "undefined") {
				throw new Error(
					"itemId/productId and quantity are required to update cart"
				);
			}
			const response = await apiClient.put(`/cart/${id}`, {
				quantity,
			});
			return { response, itemId: id, productId: id, quantity };
		},
		onSuccess: (data, variables, context) => {
			const id = variables.itemId ?? variables.productId;
			updateCacheItems(queryClient, queryKey, (items) =>
				items.map((item) =>
					item.itemId === id || item.productId === id
						? { ...item, quantity: variables.quantity }
						: item
				)
			);
			if (showSuccessToast) {
				toast.success("Cart updated");
			}
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = resolveErrorMessage(
				error,
				"Unable to update cart. Please try again."
			);
			toast.error(message);
			onError?.(error, variables, context);
		},
		...mutationOptions,
	});
};

export const useRemoveCartItemMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const {
		onSuccess,
		onError,
		queryKey = CART_QUERY_KEY,
		showSuccessToast = true,
		...mutationOptions
	} = options;

	return useMutation({
		mutationFn: async ({ itemId, productId }) => {
			// Support both itemId (new) and productId (old) for backward compatibility
			const id = itemId ?? productId;
			if (!id) {
				throw new Error("itemId/productId is required to remove cart item");
			}
			const response = await apiClient.delete(`/cart/${id}`);
			return { response, itemId: id, productId: id };
		},
		onSuccess: (data, variables, context) => {
			const id = variables.itemId ?? variables.productId;
			updateCacheItems(queryClient, queryKey, (items) =>
				items.filter((item) => item.itemId !== id && item.productId !== id)
			);
			if (showSuccessToast) {
				toast.success("Item removed from cart");
			}
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = resolveErrorMessage(
				error,
				"Unable to remove item. Please try again."
			);
			toast.error(message);
			onError?.(error, variables, context);
		},
		...mutationOptions,
	});
};

export const useAddToCartMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const {
		onSuccess,
		onError,
		queryKey = CART_QUERY_KEY,
		showSuccessToast = true,
		invalidateOnSuccess = true,
		...mutationOptions
	} = options;

	return useMutation({
		mutationFn: async ({
			itemId,
			productId,
			quantity = 1,
			itemType,
			kind,
			scheduledDate,
			scheduledTime,
		}) => {
			// Support both itemId (new) and productId (old) for backward compatibility
			const id = itemId ?? productId;
			const type = itemType ?? kind ?? "Product";

			if (!id) {
				throw new Error("itemId/productId is required to add to cart");
			}

			const payload = {
				itemId: id,
				itemType: type,
				quantity,
			};

			// Add scheduling info if provided (for consultations)
			if (scheduledDate) payload.scheduledDate = scheduledDate;
			if (scheduledTime) payload.scheduledTime = scheduledTime;

			const response = await apiClient.post("/cart/add", payload);
			return {
				response,
				itemId: id,
				productId: id,
				quantity,
				itemType: type,
				kind: type,
			};
		},
		onSuccess: (data, variables, context) => {
			if (invalidateOnSuccess) {
				queryClient.invalidateQueries({ queryKey });
			}
			if (showSuccessToast) {
				toast.success("Added to cart");
			}
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = resolveErrorMessage(
				error,
				"Unable to add to cart. Please try again."
			);
			toast.error(message);
			onError?.(error, variables, context);
		},
		...mutationOptions,
	});
};
