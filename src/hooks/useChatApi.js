import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

const getErrorMessage = (error) =>
	error?.response?.data?.message ??
	error?.message ??
	"Unable to load chat conversation. Please try again.";

const formatTimestamp = (timestamp) => {
	if (!timestamp) return "";
	const date = new Date(timestamp);
	if (Number.isNaN(date.getTime())) return "";
	return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const normalizeMessages = (messages = []) =>
	messages.map((message) => ({
		id: message._id ?? message.id ?? `${message.sender}-${message.time}`,
		sender: message.sender ?? message.role ?? "them",
		text: message.message ?? message.text ?? "",
		time: formatTimestamp(message.time ?? message.timestamp),
		raw: message,
	}));

export const useChatMessagesQuery = (
	{ userId, targetUserId },
	options = {}
) => {
	const {
		onError,
		queryKey = ["chat", userId, targetUserId],
		select,
		enabled = true,
		...queryOptions
	} = options;
	const { refetchInterval, ...restQueryOptions } = queryOptions;

	return useQuery({
		queryKey,
		enabled: Boolean(userId && targetUserId) && enabled,
		queryFn: async () => {
			const response = await apiClient.get("/chats/chat", {
				params: { userId, targetUserId },
			});
			return response.data?.messages ?? [];
		},
		staleTime: 1000 * 30,
		refetchInterval: refetchInterval ?? undefined,
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : normalizeMessages(data)),
		...restQueryOptions,
	});
};
