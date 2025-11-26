import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

const getErrorMessage = (error, fallbackMessage) =>
	error?.response?.data?.message ?? error?.message ?? fallbackMessage;

const buildMediaUrl = (path) => {
	if (!path) return null;
	if (path.startsWith("http")) return path;
	const baseUrl = import.meta.env.VITE_BACKEND_URL;
	if (!baseUrl) return path;
	const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
	return `${baseUrl}/${normalizedPath}`;
};

const invalidateContent = (queryClient, keys = []) => {
	keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
};

export const useAboutQuery = (options = {}) => {
	const { queryKey = ["about"], onError, select, ...queryOptions } = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get("/about");
			const data = response.data?.data ?? [];
			return data[0] ?? null; // Return first item or null
		},
		staleTime: 1000 * 60 * 5, // 5 minutes - About Us doesn't change frequently
		onError: (error) => {
			const message = getErrorMessage(
				error,
				"Failed to load about information. Please try again."
			);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useUpdateAboutMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (formData) => {
			const response = await apiClient.put("/about", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "About Us updated successfully");
			invalidateContent(queryClient, ["about"]);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to update About Us. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
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
				"Failed to load books. Please try again."
			);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useBlogsQuery = (options = {}) => {
	const { queryKey = ["blogs"], onError, select, ...queryOptions } = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get("/blogs");
			return response.data?.data ?? [];
		},
		staleTime: 1000 * 60 * 10, // 10 minutes - blogs don't change frequently
		cacheTime: 1000 * 60 * 30, // 30 minutes cache
		refetchOnMount: false, // Don't refetch if data is fresh
		onError: (error) => {
			const message = getErrorMessage(
				error,
				"Failed to load blogs. Please try again."
			);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useBookQuery = (bookId, options = {}) => {
	const {
		onError,
		queryKey = ["books", bookId],
		select,
		enabled = true,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		enabled: Boolean(bookId) && enabled,
		queryFn: async () => {
			const response = await apiClient.get(`/books/${bookId}`);
			const book = response.data?.data ?? null;
			if (!book) return null;
			return {
				...book,
				coverImageUrl: buildMediaUrl(book.coverImage ?? book.bannerImage),
				imageUrl: buildMediaUrl(book.image),
			};
		},
		onError: (error) => {
			const message = getErrorMessage(
				error,
				"Failed to load book details. Please try again."
			);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		staleTime: 1000 * 60,
		...queryOptions,
	});
};

export const useBlogQuery = (blogId, options = {}) => {
	const {
		onError,
		queryKey = ["blogs", blogId],
		select,
		enabled = true,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		enabled: Boolean(blogId) && enabled,
		queryFn: async () => {
			const response = await apiClient.get(`/blogs/${blogId}`);
			const blog = response.data?.data ?? null;
			if (!blog) return null;
			return {
				...blog,
				mainImage: buildMediaUrl(blog.mainImage),
				sections: blog.sections?.map((section) => ({
					...section,
					images: section.images?.map((img) => buildMediaUrl(img)),
				})),
			};
		},
		onError: (error) => {
			const message = getErrorMessage(
				error,
				"Failed to load blog details. Please try again."
			);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		staleTime: 1000 * 60,
		...queryOptions,
	});
};

export const usePodcastsQuery = (options = {}) => {
	const {
		queryKey = ["podcasts"],
		onError,
		select,
		params,
		...queryOptions
	} = options;

	return useQuery({
		queryKey: [...queryKey, params],
		queryFn: async () => {
			const response = await apiClient.get("/podcasts", { params });
			return response.data?.data ?? [];
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(
				error,
				"Failed to load content. Please try again."
			);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

// Blog Mutations
export const useCreateBlogMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (formData) => {
			const response = await apiClient.post("/blogs/create", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Blog created successfully");
			invalidateContent(queryClient, ["blogs"]);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to create blog. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

export const useUpdateBlogMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async ({ blogId, payload }) => {
			if (!blogId) {
				throw new Error("blogId is required to update a blog");
			}

			const config =
				payload instanceof FormData
					? {
							method: "put",
							url: `/blogs/${blogId}`,
							data: payload,
							headers: { "Content-Type": "multipart/form-data" },
					  }
					: {
							method: "put",
							url: `/blogs/${blogId}`,
							data: payload,
					  };

			const response = await apiClient.request(config);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Blog updated successfully");
			invalidateContent(queryClient, ["blogs"]);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to update blog. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

export const useDeleteBlogMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (blogId) => {
			if (!blogId) {
				throw new Error("blogId is required to delete a blog");
			}
			const response = await apiClient.delete(`/blogs/${blogId}`);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Blog deleted successfully");
			invalidateContent(queryClient, ["blogs"]);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to delete blog. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

// Podcast Mutations
export const useCreatePodcastMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (payload) => {
			const response = await apiClient.post("/podcasts", payload);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Podcast created successfully");
			invalidateContent(queryClient, ["podcasts"]);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to create podcast. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

export const useUpdatePodcastMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async ({ podcastId, payload }) => {
			if (!podcastId) {
				throw new Error("podcastId is required to update a podcast");
			}
			const response = await apiClient.put(`/podcasts/${podcastId}`, payload);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Podcast updated successfully");
			invalidateContent(queryClient, ["podcasts"]);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to update podcast. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};

export const useDeletePodcastMutation = (options = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError, ...mutationOptions } = options;

	return useMutation({
		mutationFn: async (podcastId) => {
			if (!podcastId) {
				throw new Error("podcastId is required to delete a podcast");
			}
			const response = await apiClient.delete(`/podcasts/${podcastId}`);
			return response.data;
		},
		onSuccess: (data, variables, context) => {
			toast.success(data?.message ?? "Podcast deleted successfully");
			invalidateContent(queryClient, ["podcasts"]);
			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = getErrorMessage(
				error,
				"Failed to delete podcast. Please try again."
			);
			toast.error(message);
			onError?.(error, message, variables, context);
		},
		...mutationOptions,
	});
};
