import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../utils/apiClient";
import toast from "react-hot-toast";

const getErrorMessage = (error, defaultMessage) => {
	return error?.response?.data?.message ?? error?.message ?? defaultMessage;
};

// Query to fetch notifications for a user
export const useNotificationsQuery = (options = {}) => {
	const {
		userId,
		isRead,
		limit = 50,
		page = 1,
		onError,
		queryKey = ["notifications", userId, { isRead, limit, page }],
		enabled = true,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		enabled: Boolean(userId) && enabled,
		queryFn: async () => {
			const params = new URLSearchParams({ userId, limit, page });
			if (isRead !== undefined) {
				params.append("isRead", isRead);
			}
			const response = await apiClient.get(
				`/notifications?${params.toString()}`
			);
			return response.data?.data ?? { notifications: [], unreadCount: 0 };
		},
		staleTime: 1000 * 30, // 30 seconds
		onError: (error) => {
			const message = getErrorMessage(error, "Failed to load notifications");
			toast.error(message);
			onError?.(error, message);
		},
		...queryOptions,
	});
};

// Query to fetch single notification
export const useNotificationQuery = (notificationId, options = {}) => {
	const {
		enabled = true,
		queryKey = ["notifications", notificationId],
		onError,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		enabled: Boolean(notificationId) && enabled,
		queryFn: async () => {
			const response = await apiClient.get(`/notifications/${notificationId}`);
			return response.data?.data ?? null;
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(error, "Failed to load notification");
			toast.error(message);
			onError?.(error, message);
		},
		...queryOptions,
	});
};

// Helper to invalidate notification queries
const invalidateNotifications = (queryClient, userId = null) => {
	if (userId) {
		queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
	} else {
		queryClient.invalidateQueries({ queryKey: ["notifications"] });
	}
};

// Mutation to mark notification as read
export const useMarkAsReadMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const {
		onSuccess,
		onError,
		enableToast = false,
		...mutationOptions
	} = options;

	return useMutation({
		mutationFn: async (notificationId) => {
			const response = await apiClient.patch(
				`/notifications/${notificationId}/read`
			);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			invalidateNotifications(queryClient);
			if (enableToast) {
				toast.success("Notification marked as read");
			}
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to mark notification as read"
			);
			if (enableToast) {
				toast.error(message);
			}
			console.error("Mark as read error:", error);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

// Mutation to mark all notifications as read
export const useMarkAllAsReadMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const {
		onSuccess,
		onError,
		enableToast = true,
		...mutationOptions
	} = options;

	return useMutation({
		mutationFn: async (userId) => {
			const response = await apiClient.patch("/notifications/read-all", {
				userId,
			});
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			invalidateNotifications(queryClient, variables);
			if (enableToast) {
				toast.success("All notifications marked as read");
			}
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to mark all notifications as read"
			);
			if (enableToast) {
				toast.error(message);
			}
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

// Mutation to delete notification
export const useDeleteNotificationMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (notificationId) => {
			const response = await apiClient.delete(
				`/notifications/${notificationId}`
			);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			invalidateNotifications(queryClient);
			toast.success("Notification deleted");
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(error, "Failed to delete notification");
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

// Mutation to delete all notifications
export const useDeleteAllNotificationsMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (userId) => {
			const response = await apiClient.delete("/notifications", {
				data: { userId },
			});
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			invalidateNotifications(queryClient, variables);
			toast.success("All notifications deleted");
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to delete all notifications"
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

// Mutation to create notification (admin only)
export const useCreateNotificationMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const {
		onSuccess,
		onError,
		enableToast = true,
		...mutationOptions
	} = options;

	return useMutation({
		mutationFn: async (notificationData) => {
			const response = await apiClient.post("/notifications", notificationData);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			invalidateNotifications(queryClient);
			if (enableToast) {
				toast.success(data?.message ?? "Notification created successfully");
			}
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(error, "Failed to create notification");
			if (enableToast) {
				toast.error(message);
			}
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

// Mutation to create bulk notifications (admin only)
export const useCreateBulkNotificationsMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const {
		onSuccess,
		onError,
		enableToast = true,
		...mutationOptions
	} = options;

	return useMutation({
		mutationFn: async (notificationData) => {
			const response = await apiClient.post(
				"/notifications/bulk",
				notificationData
			);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			invalidateNotifications(queryClient);
			if (enableToast) {
				toast.success(data?.message ?? "Notifications created successfully");
			}
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(error, "Failed to create notifications");
			if (enableToast) {
				toast.error(message);
			}
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};
