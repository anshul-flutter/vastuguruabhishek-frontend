import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

const getErrorMessage = (error) =>
	error?.response?.data?.message ??
	error?.message ??
	"Unable to load data. Please try again.";

export const useAdminUsersQuery = (options = {}) => {
	const {
		onError,
		queryKey = ["admin", "students"],
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get("/admin/users");
			// Handle nested data structure: response.data.data
			const apiData = response.data?.data || response.data;
			const students = apiData?.students ?? [];
			const count =
				apiData?.count ?? (Array.isArray(students) ? students.length : 0);

			return { students, count };
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useDeleteUserMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (userId) => {
			const response = await apiClient.delete(`/admin/users/${userId}`);
			return response.data;
		},
		onSuccess: () => {
			toast.success("User deleted successfully");
			queryClient.invalidateQueries(["admin", "students"]);
		},
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
		},
	});
};

export const useUpdateUserRoleMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ userId, role }) => {
			const response = await apiClient.put(`/admin/users/${userId}/role`, {
				role,
			});
			return response.data;
		},
		onSuccess: () => {
			toast.success("User role updated successfully");
			queryClient.invalidateQueries(["admin", "students"]);
		},
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
		},
	});
};

export const useStudentReportsQuery = (studentId = null, options = {}) => {
	const {
		onError,
		queryKey = studentId
			? ["admin", "students", "reports", studentId]
			: ["admin", "students", "reports"],
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const url = studentId
				? `/admin/students/reports?studentId=${studentId}`
				: "/admin/students/reports";
			const response = await apiClient.get(url);
			return response.data;
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useStudentBookingsQuery = (studentId = null, options = {}) => {
	const {
		onError,
		queryKey = studentId
			? ["admin", "students", "bookings", studentId]
			: ["admin", "students", "bookings"],
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const url = studentId
				? `/admin/students/bookings?studentId=${studentId}`
				: "/admin/students/bookings";
			const response = await apiClient.get(url);
			return response.data;
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useStudentProgressQuery = (studentId = null, options = {}) => {
	const {
		onError,
		queryKey = studentId
			? ["admin", "students", "progress", studentId]
			: ["admin", "students", "progress"],
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const url = studentId
				? `/admin/students/progress?studentId=${studentId}`
				: "/admin/students/progress";
			const response = await apiClient.get(url);
			return response.data;
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

// Fetch progress entries filtered by course for admin course detail page
export const useCourseEnrolledStudentsQuery = (courseId, options = {}) => {
	const {
		onError,
		queryKey = ["admin", "courses", courseId, "enrolled-students"],
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			if (!courseId) return { progress: [] };
			const response = await apiClient.get(`/admin/students/progress`, {
				params: { courseId },
			});
			return response.data;
		},
		enabled: !!courseId,
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

// NOTE: useStudentOrdersQuery has been removed because orders are now included
// in the useCustomerByIdQuery response, eliminating the need for a separate API call

export const useAdminEventsQuery = (options = {}) => {
	const {
		onError,
		queryKey = ["admin", "events"],
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get("/events");
			return response.data?.data ?? [];
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useAdminEnquiriesQuery = (options = {}) => {
	const {
		onError,
		queryKey = ["admin", "enquiries"],
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get("/contact");
			return response.data?.data ?? [];
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

// Customer Management Hooks
export const useCustomersQuery = (options = {}) => {
	const {
		onError,
		queryKey = ["admin", "customers"],
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get("/admin/customers");
			const customers = response.data?.data?.customers ?? [];
			const count = response.data?.data?.count ?? customers.length;
			return { customers, count };
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useCustomerByIdQuery = (customerId, options = {}) => {
	const {
		onError,
		queryKey = ["admin", "customers", customerId],
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get(`/admin/customers/${customerId}`);
			const payload = response.data?.data ?? {};
			const customer = payload.customer ?? payload; // support both shapes
			const orders = payload.orders ?? [];
			const totalOrders = payload.totalOrders ?? orders.length;

			// Flatten return so consumers can do userData.name, userData.email, etc.
			return {
				...customer,
				orders,
				totalOrders,
			};
		},
		enabled: !!customerId,
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useCustomerOrdersQuery = (customerId, options = {}) => {
	const {
		onError,
		queryKey = customerId
			? ["admin", "customers", customerId, "orders"]
			: ["admin", "customers", "orders"],
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const params = customerId ? { customerId } : {};
			const response = await apiClient.get("/admin/customers/orders", {
				params,
			});
			const orders = response.data?.data?.orders ?? [];
			const count = response.data?.data?.count ?? orders.length;
			return { orders, count };
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

// Dashboard Stats Hooks
export const useDashboardOrdersQuery = (options = {}) => {
	const {
		onError,
		queryKey = ["admin", "dashboard", "orders"],
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			// Prefer server-side aggregate stats for correctness
			try {
				const statsRes = await apiClient.get("/admin/orders/stats");
				const data = statsRes.data?.data ?? statsRes.data;
				return {
					orders: [],
					total: data?.totalOrders ?? 0,
					pending: data?.pendingCount ?? 0,
					completed: data?.completedCount ?? 0,
					revenue: data?.paidRevenue ?? 0,
					recentOrders: data?.recentOrders ?? [],
				};
			} catch {
				// Fallback to fetching orders list (may be paginated)
				const response = await apiClient.get("/orders");
				const orders = response.data?.data ?? [];
				const pending = orders.filter((o) => o.status === "pending").length;
				const completed = orders.filter((o) => o.status === "completed").length;
				const totalRevenue = orders
					.filter((o) => o.paymentStatus === "paid")
					.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
				return {
					orders,
					total: orders.length,
					pending,
					completed,
					revenue: totalRevenue,
					recentOrders: orders.slice(0, 5),
				};
			}
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};

export const useDashboardCoursesQuery = (options = {}) => {
	const {
		onError,
		queryKey = ["admin", "dashboard", "courses"],
		select,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			// Try admin stats endpoint first for accurate, cheap aggregates
			try {
				const statsRes = await apiClient.get("/admin/courses/stats");
				const data = statsRes.data?.data ?? statsRes.data;
				const total = data?.totalCourses ?? 0;
				const enrolled = data?.totalEnrollments ?? 0;
				return { courses: [], total, enrolled };
			} catch {
				// Fallback to fetching courses list and computing
				const response = await apiClient.get("/courses");
				const payload = response.data;
				const courses = Array.isArray(payload?.data)
					? payload.data
					: Array.isArray(payload)
					? payload
					: [];

				const totalEnrolled = courses.reduce(
					(sum, course) => sum + (course.enrolledStudents?.length || 0),
					0
				);

				return {
					courses,
					total: courses.length,
					enrolled: totalEnrolled,
				};
			}
		},
		staleTime: 1000 * 60,
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
			onError?.(error, message);
		},
		select: (data) => (select ? select(data) : data),
		...queryOptions,
	});
};
