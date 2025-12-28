import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

const getErrorMessage = (error) =>
	error?.response?.data?.message ??
	error?.message ??
	"Unable to load data. Please try again.";

// Additional queries for session management
export const useInstructorsQuery = (options = {}) => {
	const {
		onError,
		queryKey = ["instructors"],
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get("/instructors");
			return response.data?.data || response.data || [];
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useAdminCoursesQuery = (options = {}) => {
	const {
		onError,
		queryKey = ["admin", "courses"],
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get("/courses");
			return response.data?.data || response.data || [];
		},
		staleTime: 1000 * 60 * 2, // 2 minutes
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

// Student Session Hooks
export const useStudentSessionsQuery = (options = {}) => {
	const {
		onError,
		queryKey = ["sessions", "student"],
		select,
		upcoming,
		completed,
		missed,
		...queryOptions
	} = options;

	return useQuery({
		queryKey: [...queryKey, { upcoming, completed, missed }],
		queryFn: async () => {
			const params = new URLSearchParams();
			if (upcoming) params.append("upcoming", "true");
			if (completed) params.append("completed", "true");
			if (missed) params.append("missed", "true");

			const response = await apiClient.get(`/sessions/my-sessions?${params}`);
			return response.data?.data || [];
		},
		staleTime: 1000 * 30, // 30 seconds
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useCourseSessionsQuery = (courseId, options = {}) => {
	const {
		onError,
		queryKey = ["sessions", "course", courseId],
		select,
		status,
		upcoming,
		completed,
		...queryOptions
	} = options;

	return useQuery({
		queryKey: [...queryKey, { status, upcoming, completed }],
		queryFn: async () => {
			const params = new URLSearchParams();
			if (status) params.append("status", status);
			if (upcoming) params.append("upcoming", "true");
			if (completed) params.append("completed", "true");

			const response = await apiClient.get(
				`/sessions/${courseId}/sessions?${params}`
			);
			return response.data?.data || [];
		},
		enabled: !!courseId,
		staleTime: 1000 * 30,
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useJoinSessionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (sessionId) => {
			const response = await apiClient.post(`/sessions/${sessionId}/join`);
			return response.data;
		},
		onSuccess: (_data, sessionId) => {
			toast.success("Successfully joined session!");
			// Invalidate only the specific session to avoid refetch loops
			if (sessionId) {
				queryClient.invalidateQueries(["sessions", sessionId]);
			}
		},
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
		},
	});
};

export const useLeaveSessionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			sessionId,
			attendanceDuration,
			participationScore,
		}) => {
			const response = await apiClient.post(`/sessions/${sessionId}/leave`, {
				attendanceDuration,
				participationScore,
			});
			return response.data;
		},
		onSuccess: () => {
			toast.success("Session attendance recorded!");
			queryClient.invalidateQueries(["sessions"]);
		},
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
		},
	});
};

export const useSessionRecordingQuery = (sessionId, options = {}) => {
	const {
		onError,
		queryKey = ["sessions", "recording", sessionId],
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get(`/sessions/${sessionId}/recording`);
			return response.data?.data;
		},
		enabled: !!sessionId,
		staleTime: 1000 * 60 * 5, // 5 minutes
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

// Get single session details
export const useSessionQuery = (sessionId, options = {}) => {
	const {
		onError,
		queryKey = ["sessions", sessionId],
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get(`/sessions/${sessionId}`);
			return response.data?.data;
		},
		enabled: !!sessionId,
		staleTime: 1000 * 60 * 2, // 2 minutes
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

// Admin Session Hooks
export const useAdminSessionsQuery = (options = {}) => {
	const {
		onError,
		queryKey = ["admin", "sessions"],
		select,
		page = 1,
		limit = 10,
		status,
		courseId,
		instructorId,
		startDate,
		endDate,
		...queryOptions
	} = options;

	return useQuery({
		queryKey: [
			...queryKey,
			{ page, limit, status, courseId, instructorId, startDate, endDate },
		],
		queryFn: async () => {
			const params = new URLSearchParams();
			params.append("page", page);
			params.append("limit", limit);
			if (status) params.append("status", status);
			if (courseId) params.append("courseId", courseId);
			if (instructorId) params.append("instructorId", instructorId);
			if (startDate) params.append("startDate", startDate);
			if (endDate) params.append("endDate", endDate);

			const response = await apiClient.get(`/admin/sessions?${params}`);
			return response.data?.data;
		},
		staleTime: 1000 * 60, // 1 minute
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useCreateSessionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (sessionData) => {
			const response = await apiClient.post("/admin/sessions", sessionData);
			return response.data;
		},
		onSuccess: () => {
			toast.success("Session created successfully!");
			queryClient.invalidateQueries(["admin", "sessions"]);
			queryClient.invalidateQueries(["sessions"]);
		},
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
		},
	});
};

export const useUpdateSessionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ sessionId, updates }) => {
			const response = await apiClient.put(
				`/admin/sessions/${sessionId}`,
				updates
			);
			return response.data;
		},
		onSuccess: () => {
			toast.success("Session updated successfully!");
			queryClient.invalidateQueries(["admin", "sessions"]);
			queryClient.invalidateQueries(["sessions"]);
		},
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
		},
	});
};

export const useStartSessionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (sessionId) => {
			const response = await apiClient.post(
				`/admin/sessions/${sessionId}/start`
			);
			return response.data;
		},
		onSuccess: () => {
			toast.success("Session started successfully!");
			queryClient.invalidateQueries(["admin", "sessions"]);
			queryClient.invalidateQueries(["sessions"]);
		},
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
		},
	});
};

export const useEndSessionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ sessionId, sessionData }) => {
			const response = await apiClient.post(
				`/admin/sessions/${sessionId}/end`,
				sessionData
			);
			return response.data;
		},
		onSuccess: () => {
			toast.success("Session ended successfully!");
			queryClient.invalidateQueries(["admin", "sessions"]);
			queryClient.invalidateQueries(["sessions"]);
		},
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
		},
	});
};

export const useSessionAttendanceQuery = (sessionId, options = {}) => {
	const {
		onError,
		queryKey = ["admin", "sessions", "attendance", sessionId],
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get(
				`/admin/sessions/${sessionId}/attendance`
			);
			return response.data?.data;
		},
		enabled: !!sessionId,
		staleTime: 1000 * 30,
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useUploadRecordingMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ sessionId, recordingData }) => {
			const response = await apiClient.post(
				`/admin/sessions/${sessionId}/recording`,
				recordingData
			);
			return response.data;
		},
		onSuccess: () => {
			toast.success("Recording uploaded successfully!");
			queryClient.invalidateQueries(["admin", "sessions"]);
			queryClient.invalidateQueries(["sessions"]);
		},
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
		},
	});
};

export const useDeleteSessionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (sessionId) => {
			const response = await apiClient.delete(`/admin/sessions/${sessionId}`);
			return response.data;
		},
		onSuccess: () => {
			toast.success("Session deleted successfully!");
			queryClient.invalidateQueries(["admin", "sessions"]);
			queryClient.invalidateQueries(["sessions"]);
		},
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
		},
	});
};

/**
 * Fetch all sessions from enrolled courses
 * Used on student dashboard to show all upcoming sessions
 */
export const useEnrolledSessionsQuery = (options = {}) => {
	const {
		onError,
		queryKey = ["sessions", "enrolled"],
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get("/sessions/my-sessions");
			return response.data?.data || response.data || [];
		},
		staleTime: 1000 * 60 * 2, // 2 minutes
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};
