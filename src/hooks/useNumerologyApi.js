import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

const getErrorMessage = (error, fallbackMessage) =>
	error?.response?.data?.message ?? error?.message ?? fallbackMessage;

export const useNumerologyMutation = (options = {}) => {
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async ({ fullName, dob }) => {
			if (!fullName || !dob) {
				throw new Error("Full name and date of birth are required");
			}

			const response = await apiClient.get("/numerology", {
				params: { fullName, dob },
			});

			return response.data ?? {};
		},
		onSuccess: (data, variables, context) => {
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Unable to calculate numerology right now. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};
