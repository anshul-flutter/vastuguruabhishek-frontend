import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

const getErrorMessage = (error, fallback) =>
	error?.response?.data?.message ?? error?.message ?? fallback;

const invalidateCourses = (queryClient) => {
	queryClient.invalidateQueries({ queryKey: ["courses"] });
};

export const useCoursesQuery = (options = {}) => {
	const {
		queryKey = ["courses"],
		onError,
		select,
		enableToast = true,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get("/courses");
			return response.data?.data ?? [];
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(
				error,
				"Unable to fetch courses. Please try again."
			);
			if (enableToast) {
				toast.error(message);
			}
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useCourseQuery = (courseId, options = {}) => {
	const {
		enabled = true,
		queryKey = ["courses", courseId],
		onError,
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		enabled: Boolean(courseId) && enabled,
		queryFn: async () => {
			const response = await apiClient.get(`/courses/${courseId}`);
			return response.data?.data ?? null;
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(
				error,
				"Unable to fetch course details. Please try again."
			);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useCreateCourseMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (formData) => {
			const response = await apiClient.post("/courses", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Course created successfully");
			invalidateCourses(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to create course. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

export const useUpdateCourseMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async ({ courseId, payload }) => {
			if (!courseId) {
				throw new Error("courseId is required to update a course");
			}

			const config =
				payload instanceof FormData
					? {
							method: "put",
							url: `/courses/${courseId}`,
							data: payload,
							headers: { "Content-Type": "multipart/form-data" },
					  }
					: {
							method: "put",
							url: `/courses/${courseId}`,
							data: payload,
					  };

			const response = await apiClient.request(config);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Course updated successfully");
			invalidateCourses(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to update course. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

export const useDeleteCourseMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (courseId) => {
			if (!courseId) {
				throw new Error("courseId is required to delete a course");
			}

			const response = await apiClient.delete(`/courses/${courseId}`);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Course deleted successfully");
			invalidateCourses(queryClient);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to delete course. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

export const useAddCourseMaterialMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async ({ courseId, formData }) => {
			const response = await apiClient.post(
				`/courses/${courseId}/materials`,
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				}
			);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Material added successfully");
			queryClient.invalidateQueries({
				queryKey: ["courses", variables.courseId],
			});
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to add material. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

export const useRemoveCourseMaterialMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async ({ courseId, materialId }) => {
			const response = await apiClient.delete(
				`/courses/${courseId}/materials/${materialId}`
			);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Material removed successfully");
			queryClient.invalidateQueries({
				queryKey: ["courses", variables.courseId],
			});
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to remove material. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};
