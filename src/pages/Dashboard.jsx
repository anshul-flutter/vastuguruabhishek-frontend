import React, { useState, useEffect, useMemo } from "react";
import ImageWithFallback from "../components/common/ImageWithFallback";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
	FaBell,
	FaChevronLeft,
	FaChevronRight,
	FaRupeeSign,
	FaUser,
	FaShoppingCart,
	FaGraduationCap,
	FaClock,
	FaCheckCircle,
	FaSpinner,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import {
	useAdminEnquiriesQuery,
	useAdminEventsQuery,
	useAdminUsersQuery,
	useDashboardOrdersQuery,
	useDashboardCoursesQuery,
} from "../hooks/useAdminApi";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const Dashboard = () => {
	const [currentEventIndex, setCurrentEventIndex] = useState(0);

	// Use dashboard data hooks
	const { data: eventsData, isLoading: eventsLoading } = useAdminEventsQuery();
	const { data: userStats } = useAdminUsersQuery();
	const { data: enquiriesData, isLoading: enquiriesLoading } =
		useAdminEnquiriesQuery();
	const { data: ordersData, isLoading: ordersLoading } =
		useDashboardOrdersQuery();
	const { data: coursesData, isLoading: coursesLoading } =
		useDashboardCoursesQuery();

	// Extract data with defaults
	const events = useMemo(() => eventsData ?? [], [eventsData]);
	const enquiries = (enquiriesData ?? []).slice(0, 5); // Show only 5 recent
	const users = userStats?.count ?? 0;
	const loading = ordersLoading || coursesLoading;

	// Order status distribution for pie chart
	const orderStatusData = useMemo(() => {
		if (!ordersData?.recentOrders?.length) return [];

		const statusCount = ordersData.recentOrders.reduce((acc, order) => {
			acc[order.status] = (acc[order.status] || 0) + 1;
			return acc;
		}, {});

		return Object.entries(statusCount).map(([status, count]) => ({
			name: status.charAt(0).toUpperCase() + status.slice(1),
			value: count,
		}));
	}, [ordersData?.recentOrders]);

	useEffect(() => {
		if (currentEventIndex >= events.length && events.length > 0) {
			setCurrentEventIndex(0);
		}
	}, [currentEventIndex, events.length]);

	const goToPrevious = () => {
		setCurrentEventIndex(
			currentEventIndex === 0 ? events.length - 1 : currentEventIndex - 1
		);
	};

	const goToNext = () => {
		setCurrentEventIndex(
			currentEventIndex === events.length - 1 ? 0 : currentEventIndex + 1
		);
	};

	const goToSlide = (index) => {
		setCurrentEventIndex(index);
	};

	return (
		<div className="flex flex-col lg:flex-row h-screen overflow-scroll bg-gray-50 hide-scrollbar">
			<div className="flex-1 w-full min-w-0 p-3 sm:p-4 md:p-6 lg:p-8">
				<div className="mt-6 lg:mt-10">
					<h2 className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
						Overview
					</h2>
				</div>

				{/* Stats Cards */}
				<div className="grid gap-4 sm:gap-6 mt-4 sm:mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
					{/* Total Users */}
					<Link
						to="/admin/student-management"
						className="rounded-2xl border border-gray-200 bg-white flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200"
					>
						<div className="flex flex-1 items-center justify-center p-4 sm:p-6">
							<div className="flex items-center gap-3 sm:gap-4">
								<div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-indigo-400 via-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
									<FaUser className="text-white text-lg sm:text-xl" />
								</div>
								<div className="flex flex-col">
									<span className="font-bold text-gray-900 text-2xl sm:text-3xl">
										{users}
									</span>
									<span className="text-xs text-gray-500">Registered</span>
								</div>
							</div>
						</div>
						<div className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-between px-4 sm:px-6 rounded-b-2xl">
							<span className="text-white font-semibold text-sm sm:text-base">
								Total Users
							</span>
							<span className="text-white text-lg">→</span>
						</div>
					</Link>

					{/* Total Revenue */}
					<Link
						to="/admin/orders"
						className="rounded-2xl border border-gray-200 bg-white flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200"
					>
						<div className="flex flex-1 items-center justify-center p-4 sm:p-6">
							<div className="flex items-center gap-3 sm:gap-4">
								<div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-400 via-green-500 to-green-600 flex items-center justify-center shadow-lg">
									<FaRupeeSign className="text-white text-lg sm:text-xl" />
								</div>
								<div className="flex flex-col">
									<span className="font-bold text-gray-900 text-2xl sm:text-3xl">
										{loading
											? "..."
											: `₹${((ordersData?.revenue ?? 0) / 1000).toFixed(1)}K`}
									</span>
									<span className="text-xs text-gray-500">Paid Revenue</span>
								</div>
							</div>
						</div>
						<div className="w-full h-12 sm:h-14 bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-between px-4 sm:px-6 rounded-b-2xl">
							<span className="text-white font-semibold text-sm sm:text-base">
								Total Revenue
							</span>
							<span className="text-white text-lg">→</span>
						</div>
					</Link>

					{/* Total Orders */}
					<Link
						to="/admin/orders"
						className="rounded-2xl border border-gray-200 bg-white flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200"
					>
						<div className="flex flex-1 items-center justify-center p-4 sm:p-6">
							<div className="flex items-center gap-3 sm:gap-4">
								<div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
									<FaShoppingCart className="text-white text-lg sm:text-xl" />
								</div>
								<div className="flex flex-col">
									<span className="font-bold text-gray-900 text-2xl sm:text-3xl">
										{loading ? "..." : ordersData?.total ?? 0}
									</span>
									<span className="text-xs text-gray-500">
										{loading ? "..." : `${ordersData?.pending ?? 0} Pending`}
									</span>
								</div>
							</div>
						</div>
						<div className="w-full h-12 sm:h-14 bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-between px-4 sm:px-6 rounded-b-2xl">
							<span className="text-white font-semibold text-sm sm:text-base">
								Total Orders
							</span>
							<span className="text-white text-lg">→</span>
						</div>
					</Link>

					{/* Total Courses */}
					<Link
						to="/admin/courses"
						className="rounded-2xl border border-gray-200 bg-white flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200"
					>
						<div className="flex flex-1 items-center justify-center p-4 sm:p-6">
							<div className="flex items-center gap-3 sm:gap-4">
								<div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
									<FaGraduationCap className="text-white text-lg sm:text-xl" />
								</div>
								<div className="flex flex-col">
									<span className="font-bold text-gray-900 text-2xl sm:text-3xl">
										{loading ? "..." : coursesData?.total ?? 0}
									</span>
									<span className="text-xs text-gray-500">
										{loading ? "..." : `${coursesData?.enrolled ?? 0} Enrolled`}
									</span>
								</div>
							</div>
						</div>
						<div className="w-full h-12 sm:h-14 bg-gradient-to-r from-orange-600 to-orange-700 flex items-center justify-between px-4 sm:px-6 rounded-b-2xl">
							<span className="text-white font-semibold text-sm sm:text-base">
								Total Courses
							</span>
							<span className="text-white text-lg">→</span>
						</div>
					</Link>
				</div>

				{/* Recent Orders + Order Status Chart */}
				<div className="flex flex-col xl:flex-row justify-between gap-6 mt-8 sm:mt-12">
					{/* Recent Orders */}
					<div className="flex-1 bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-800">
								Recent Orders
							</h3>
							<Link
								to="/admin/orders"
								className="text-sm text-blue-600 hover:text-blue-700 font-medium"
							>
								View All →
							</Link>
						</div>

						{loading ? (
							<div className="flex items-center justify-center py-8">
								<FaSpinner className="animate-spin text-blue-600 text-2xl" />
							</div>
						) : !ordersData?.recentOrders?.length ? (
							<p className="text-gray-500 text-center py-8">No orders yet</p>
						) : (
							<div className="space-y-3">
								{ordersData.recentOrders.map((order) => (
									<Link
										key={order._id}
										to={`/admin/orders`}
										className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
									>
										<div className="flex items-center justify-between mb-2">
											<span className="font-semibold text-gray-800 text-sm">
												{order.orderNumber}
											</span>
											<span
												className={`px-2 py-1 rounded text-xs font-medium ${
													order.status === "completed"
														? "bg-green-100 text-green-800"
														: order.status === "pending"
														? "bg-yellow-100 text-yellow-800"
														: order.status === "cancelled"
														? "bg-red-100 text-red-800"
														: "bg-blue-100 text-blue-800"
												}`}
											>
												{order.status}
											</span>
										</div>
										<div className="flex items-center justify-between text-sm">
											<span className="text-gray-600">
												{order.user?.name || "Guest"}
											</span>
											<span className="font-bold text-gray-900">
												₹{order.totalAmount}
											</span>
										</div>
										<div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
											<FaClock className="text-xs" />
											{new Date(order.createdAt).toLocaleDateString()}
										</div>
									</Link>
								))}
							</div>
						)}
					</div>

					{/* Order Status Distribution */}
					<div className="flex-1 bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">
							Order Status Distribution
						</h3>

						{loading ? (
							<div className="flex items-center justify-center py-12">
								<FaSpinner className="animate-spin text-blue-600 text-2xl" />
							</div>
						) : orderStatusData.length === 0 ? (
							<p className="text-gray-500 text-center py-12">
								No data available
							</p>
						) : (
							<>
								<div className="flex flex-col items-center justify-center min-h-[280px]">
									<ResponsiveContainer width="100%" height={300}>
										<PieChart>
											<Pie
												data={orderStatusData}
												cx="50%"
												cy="50%"
												labelLine={false}
												label={(entry) => `${entry.name}: ${entry.value}`}
												outerRadius={80}
												fill="#8884d8"
												dataKey="value"
											>
												{orderStatusData.map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={COLORS[index % COLORS.length]}
													/>
												))}
											</Pie>
											<Tooltip />
										</PieChart>
									</ResponsiveContainer>

									{/* Legend */}
									<div className="grid grid-cols-2 gap-3 mt-4">
										<div className="flex items-center gap-2">
											<FaClock className="text-yellow-600" />
											<span className="text-sm text-gray-600">
												Pending: {ordersData?.pending ?? 0}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<FaCheckCircle className="text-green-600" />
											<span className="text-sm text-gray-600">
												Completed: {ordersData?.completed ?? 0}
											</span>
										</div>
									</div>
								</div>
							</>
						)}
					</div>
				</div>

				{/* Events & Enquiries */}
				<div className="flex flex-col xl:flex-row gap-6 mt-8 sm:mt-10">
					{/* Upcoming Events */}
					<div className="flex-1 bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
						<div className="flex items-center justify-between mb-4">
							<h4 className="text-lg sm:text-xl font-semibold text-gray-800">
								Upcoming Events
							</h4>
							<Link
								to="/admin/events"
								className="text-sm text-blue-600 hover:text-blue-700 font-medium"
							>
								Manage →
							</Link>
						</div>

						{eventsLoading ? (
							<p>Loading events...</p>
						) : events.length === 0 ? (
							<p>No events available</p>
						) : (
							<div className="relative bg-gray-50 p-3 rounded-xl">
								{/* Image Container */}
								<div className="relative w-full overflow-hidden rounded-xl">
									<div
										className="flex transition-transform duration-500 ease-in-out"
										style={{
											transform: `translateX(-${currentEventIndex * 100}%)`,
										}}
									>
										{events.map((event) => (
											<div key={event._id} className="w-full flex-shrink-0">
												<ImageWithFallback
													src={event.thumbnail}
													alt={event.title}
													className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-xl"
												/>

												<div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded text-sm font-semibold text-gray-800">
													{event.title}
												</div>
											</div>
										))}
									</div>

									{/* Navigation Arrows */}
									<button
										onClick={goToPrevious}
										className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 transition-all duration-200 shadow-md hover:shadow-lg"
									>
										<FaChevronLeft size={16} />
									</button>
									<button
										onClick={goToNext}
										className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 transition-all duration-200 shadow-md hover:shadow-lg"
									>
										<FaChevronRight size={16} />
									</button>
								</div>

								{/* Indicator Dots */}
								<div className="flex justify-center gap-2 mt-4">
									{events.map((_, index) => (
										<button
											key={index}
											onClick={() => goToSlide(index)}
											className={`rounded-full transition-all duration-200 ${
												index === currentEventIndex
													? "w-8 h-2 bg-blue-600"
													: "w-2 h-2 bg-gray-300 hover:bg-gray-400"
											}`}
										/>
									))}
								</div>
							</div>
						)}
					</div>

					{/* New Enquiries Section */}
					<div className="flex-1 bg-gray-50 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
						{/* Heading with Ring Icon */}
						<div className="flex items-center gap-3 mb-6">
							<div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
								<span className="text-white text-sm">
									<FaBell />
								</span>
							</div>
							<h4 className="text-lg sm:text-xl font-semibold text-gray-800">
								New Enquiries
							</h4>
							<Link
								to="/admin/enquiries"
								className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium"
							>
								View All →
							</Link>
						</div>

						<div className="space-y-4 max-h-96 overflow-y-auto hide-scrollbar">
							{/* Enquiry Cards */}
							{enquiriesLoading ? (
								<p className="text-gray-500">Loading enquiries...</p>
							) : enquiries.length === 0 ? (
								<p className="text-gray-500">No enquiries found.</p>
							) : (
								enquiries.map((enquiry) => (
									<div
										key={enquiry._id}
										className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow duration-200"
									>
										<div className="flex items-center gap-3 mb-3">
											<div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
												<span className="text-blue-600 font-semibold text-sm">
													{enquiry.name.charAt(0)}
												</span>
											</div>
											<div className="flex-1 min-w-0">
												<p className="font-bold text-gray-800 text-sm sm:text-base truncate">
													{enquiry.name}
												</p>
												<div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600 mt-1">
													<a
														className="text-blue-600 hover:underline truncate"
														href={`mailto:${encodeURIComponent(
															enquiry.email || ""
														)}`}
														title={enquiry.email}
													>
														{enquiry.email || "-"}
													</a>
													<span className="truncate">
														{enquiry.phone || "-"}
													</span>
													<span className="truncate">
														{[enquiry.city, enquiry.country]
															.filter(Boolean)
															.join(", ") || "-"}
													</span>
													<span className="text-gray-400">•</span>
													<span className="truncate">
														{new Date(enquiry.createdAt).toLocaleTimeString(
															[],
															{
																hour: "2-digit",
																minute: "2-digit",
															}
														)}
													</span>
												</div>
											</div>
										</div>
										<p className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
											Message
										</p>
										<p className="italic text-gray-600 mb-4 text-sm line-clamp-2">
											"{enquiry.message}"
										</p>
										<div className="flex justify-end">
											<a
												className="px-4 py-2 text-white rounded-lg font-medium bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 transition-all duration-200 text-sm"
												href={`mailto:${encodeURIComponent(
													enquiry.email || ""
												)}?subject=${encodeURIComponent(
													"Re: Your enquiry at Vastu Abhishek"
												)}&body=${encodeURIComponent(
													`Hi ${
														enquiry.name || ""
													},\n\nThanks for reaching out.\n\nYour message: \n${
														enquiry.message || ""
													}\n\n— Team Vastu Abhishek`
												)}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												Quick Reply
											</a>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
