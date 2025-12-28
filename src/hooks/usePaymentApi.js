import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

// Initiate PayU checkout; returns { payuUrl, params } or { free: true, order }
export const useInitiatePayUMutation = (options = {}) => {
	const { onSuccess, onError, ...rest } = options;
	return useMutation({
		mutationFn: async () => {
			const resp = await apiClient.post("/payments/payu/initiate", {});

			// Check if this is a free order
			if (resp?.data?.free) {
				return {
					free: true,
					order: resp?.data?.order,
				};
			}

			// Regular paid order
			const payload = resp?.data?.data;
			if (!payload?.payuUrl || !payload?.params) {
				throw new Error("Invalid payment response from server");
			}
			return payload;
		},
		onSuccess: (data, variables, context) => {
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				"Payment initiation failed";
			toast.error(message);
			onError?.(error, variables, context);
		},
		...rest,
	});
};

// Optional: verify PayU hash (debugging/validation)
export const useVerifyPayUMutation = (options = {}) => {
	const { onSuccess, onError, ...rest } = options;
	return useMutation({
		mutationFn: async (fields) => {
			const resp = await apiClient.post("/payments/payu/verify", fields);
			return resp?.data;
		},
		onSuccess: (data, variables, context) => {
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message =
				error?.response?.data?.message || error?.message || "Verify failed";
			toast.error(message);
			onError?.(error, variables, context);
		},
		...rest,
	});
};
