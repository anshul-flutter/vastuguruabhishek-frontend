import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";

// Helper function for error messages
const getErrorMessage = (error, fallback) =>
	error?.response?.data?.message ?? error?.message ?? fallback;

// Get student dashboard stats (my courses, progress, etc.)
export const useStudentDashboardQuery = (options = {}) => {
	const {
		queryKey = ["student", "dashboard"],
		onError,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			// Get my orders to calculate course stats
			const ordersResponse = await apiClient.get("/orders/my-orders");
			const orders = ordersResponse.data?.data ?? [];

			// Get all courses to match with purchases
			const coursesResponse = await apiClient.get("/courses");
			const allCourses = coursesResponse.data?.data ?? [];

			// Filter course orders (items that have courseId)
			const courseOrders = orders.filter((order) =>
				order.items?.some((item) => item.courseId)
			);

			// Get unique course IDs from orders
			const purchasedCourseIds = new Set();
			courseOrders.forEach((order) => {
				order.items?.forEach((item) => {
					if (item.courseId) {
						purchasedCourseIds.add(item.courseId);
					}
				});
			});

			// Match with actual course data
			const purchasedCourses = allCourses.filter((course) =>
				purchasedCourseIds.has(course._id)
			);

			// Calculate stats
			const totalCourses = purchasedCourses.length;
			const ongoingCourses = purchasedCourses.filter((course) => {
				// Assume ongoing if purchased in last 6 months and not completed
				const sixMonthsAgo = new Date();
				sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

				const courseOrder = courseOrders.find((order) =>
					order.items?.some((item) => item.courseId === course._id)
				);

				if (!courseOrder) return false;

				const orderDate = new Date(courseOrder.createdAt);
				return orderDate > sixMonthsAgo;
			}).length;

			const completedCourses = totalCourses - ongoingCourses;

			// Recent activity for chart (mock data based on orders)
			const activityData = [];
			const days = ["S", "M", "T", "W", "T", "F", "S"];
			const today = new Date();

			for (let i = 6; i >= 0; i--) {
				const date = new Date(today);
				date.setDate(date.getDate() - i);

				// Count orders for this day
				const dayOrders = orders.filter((order) => {
					const orderDate = new Date(order.createdAt);
					return orderDate.toDateString() === date.toDateString();
				}).length;

				activityData.push({
					day: days[date.getDay()],
					value: Math.max(dayOrders * 20, Math.floor(Math.random() * 80) + 20), // Add some activity
				});
			}

			// Recent orders for upcoming sessions section
			const recentOrders = orders.slice(0, 5).map((order) => ({
				id: order._id,
				title: order.items?.[0]?.name || "Course Session",
				date: order.createdAt,
				status: order.orderStatus,
				amount: order.totalAmount,
			}));

			return {
				stats: {
					totalCourses,
					ongoingCourses,
					completedCourses,
				},
				activityData,
				recentOrders,
				purchasedCourses: purchasedCourses.slice(0, 4), // Show first 4 for dashboard
			};
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
		onError: (error) => {
			const message = getErrorMessage(error, "Failed to fetch dashboard data");
			if (options.enableToast !== false) {
				toast.error(message);
			}
			onError?.(error, message);
		},
		...queryOptions,
	});
};

// Get student's purchased courses with progress
export const useMyCoursesQuery = (options = {}) => {
	const {
		queryKey = ["student", "my-courses"],
		onError,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const ordersResponse = await apiClient.get("/orders/my-orders");
			const orders = ordersResponse.data?.data ?? [];

			const coursesResponse = await apiClient.get("/courses");
			const allCourses = coursesResponse.data?.data ?? [];

			// Get purchased courses with order details
			const purchasedCourses = [];

			orders.forEach((order) => {
				order.items?.forEach((item) => {
					if (item.courseId) {
						const course = allCourses.find((c) => c._id === item.courseId);
						if (course) {
							purchasedCourses.push({
								...course,
								purchaseDate: order.createdAt,
								orderStatus: order.orderStatus,
								paymentStatus: order.paymentStatus,
								paidAmount: item.price || 0,
								progress: Math.floor(Math.random() * 100), // Mock progress
								lastAccessed: new Date(
									Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
								), // Random last access
							});
						}
					}
				});
			});

			return purchasedCourses;
		},
		staleTime: 1000 * 60 * 5,
		onError: (error) => {
			const message = getErrorMessage(error, "Failed to fetch your courses");
			if (options.enableToast !== false) {
				toast.error(message);
			}
			onError?.(error, message);
		},
		...queryOptions,
	});
};

// Get student's service bookings/consultations
export const useMyBookingsQuery = (options = {}) => {
	const {
		queryKey = ["student", "my-bookings"],
		onError,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const ordersResponse = await apiClient.get("/orders/my-orders");
			const orders = ordersResponse.data?.data ?? [];

			// Filter service/consultation orders
			const serviceOrders = orders.filter((order) =>
				order.items?.some(
					(item) => item.serviceId || item.type === "consultation"
				)
			);

			const bookings = serviceOrders.map((order) => ({
				id: order._id,
				serviceName: order.items?.[0]?.name || "Consultation",
				date: order.createdAt,
				scheduledDate: order.scheduledDate || null,
				status: order.orderStatus,
				amount: order.totalAmount,
				astrologer: order.astrologer || "TBD",
				type: order.items?.[0]?.type || "consultation",
			}));

			return bookings;
		},
		staleTime: 1000 * 60 * 5,
		onError: (error) => {
			const message = getErrorMessage(error, "Failed to fetch your bookings");
			if (options.enableToast !== false) {
				toast.error(message);
			}
			onError?.(error, message);
		},
		...queryOptions,
	});
};

// Get student's progress for a specific course
export const useStudentProgressQuery = (courseId, options = {}) => {
	const {
		queryKey = ["student", "progress", courseId],
		onError,
		...queryOptions
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get(`/courses/progress/${courseId}`);
			return response.data?.data;
		},
		enabled: !!courseId,
		staleTime: 1000 * 60 * 2, // 2 minutes
		onError: (error) => {
			const message = getErrorMessage(error, "Failed to fetch course progress");
			if (options.enableToast !== false) {
				toast.error(message);
			}
			onError?.(error, message);
		},
		...queryOptions,
	});
};
