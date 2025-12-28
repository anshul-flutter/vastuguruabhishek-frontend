import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaCheckCircle, FaTrash } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import {
	useNotificationsQuery,
	useMarkAsReadMutation,
	useMarkAllAsReadMutation,
	useDeleteNotificationMutation,
} from "../hooks/useNotificationsApi";
import { useAppSelector } from "../store/hooks";
import { selectCurrentUser } from "../store/slices/authSlice";

const Notifications = () => {
	const currentUser = useAppSelector(selectCurrentUser);
	const [filter, setFilter] = useState("all"); // 'all', 'unread', 'read'
	const [page, setPage] = useState(1);
	const limit = 20;

	const { data, isLoading, isError } = useNotificationsQuery({
		userId: currentUser?._id,
		limit,
		page,
		isRead: filter === "all" ? undefined : filter === "read",
		enabled: Boolean(currentUser?._id),
	});

	const markAsReadMutation = useMarkAsReadMutation();
	const markAllAsReadMutation = useMarkAllAsReadMutation();
	const deleteNotificationMutation = useDeleteNotificationMutation();

	const notifications = data?.notifications || [];
	const unreadCount = data?.unreadCount || 0;
	const pagination = data?.pagination || {};

	const handleNotificationClick = (notificationId) => {
		if (notificationId) {
			markAsReadMutation.mutate(notificationId);
		}
	};

	const handleMarkAllAsRead = () => {
		if (currentUser?._id) {
			markAllAsReadMutation.mutate(currentUser._id);
		}
	};

	const handleDeleteNotification = (e, notificationId) => {
		e.preventDefault();
		e.stopPropagation();
		if (window.confirm("Are you sure you want to delete this notification?")) {
			deleteNotificationMutation.mutate(notificationId);
		}
	};

	const getNotificationIcon = (type) => {
		const iconClasses = "text-2xl";
		switch (type) {
			case "course":
			case "session":
				return (
					<div className="bg-blue-100 p-3 rounded-full">
						<FaBell className={`${iconClasses} text-blue-600`} />
					</div>
				);
			case "payment":
				return (
					<div className="bg-green-100 p-3 rounded-full">
						<FaCheckCircle className={`${iconClasses} text-green-600`} />
					</div>
				);
			case "warning":
			case "error":
				return (
					<div className="bg-red-100 p-3 rounded-full">
						<FaBell className={`${iconClasses} text-red-600`} />
					</div>
				);
			case "enquiry":
				return (
					<div className="bg-purple-100 p-3 rounded-full">
						<FaBell className={`${iconClasses} text-purple-600`} />
					</div>
				);
			default:
				return (
					<div className="bg-gray-100 p-3 rounded-full">
						<FaBell className={`${iconClasses} text-gray-600`} />
					</div>
				);
		}
	};

	const getPriorityBadge = (priority) => {
		switch (priority) {
			case "high":
				return (
					<span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-full">
						High
					</span>
				);
			case "medium":
				return (
					<span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-600 rounded-full">
						Medium
					</span>
				);
			case "low":
				return (
					<span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-600 rounded-full">
						Low
					</span>
				);
			default:
				return null;
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-600 text-lg mb-4">
						Failed to load notifications
					</p>
					<button
						onClick={() => window.location.reload()}
						className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-6 sm:py-10">
			<div className="max-w-4xl mx-auto px-4 sm:px-6">
				{/* Header */}
				<div className="mb-6 sm:mb-8">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
								<FaBell className="text-orange-600" />
								Notifications
							</h1>
							<p className="text-sm text-gray-600 mt-1">
								{unreadCount > 0 ? (
									<span>
										You have{" "}
										<span className="font-semibold text-orange-600">
											{unreadCount}
										</span>{" "}
										unread notification{unreadCount > 1 ? "s" : ""}
									</span>
								) : (
									"You're all caught up!"
								)}
							</p>
						</div>
						{unreadCount > 0 && (
							<button
								onClick={handleMarkAllAsRead}
								disabled={markAllAsReadMutation.isPending}
								className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 text-sm sm:text-base whitespace-nowrap"
							>
								{markAllAsReadMutation.isPending
									? "Marking..."
									: "Mark all as read"}
							</button>
						)}
					</div>
				</div>

				{/* Filter Tabs */}
				<div className="bg-white rounded-lg shadow-sm p-2 mb-6 flex gap-2 overflow-x-auto scrollbar-hide">
					<button
						onClick={() => setFilter("all")}
						className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm sm:text-base ${
							filter === "all"
								? "bg-orange-600 text-white"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
					>
						All ({data?.pagination?.total || 0})
					</button>
					<button
						onClick={() => setFilter("unread")}
						className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm sm:text-base ${
							filter === "unread"
								? "bg-orange-600 text-white"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
					>
						Unread ({unreadCount})
					</button>
					<button
						onClick={() => setFilter("read")}
						className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm sm:text-base ${
							filter === "read"
								? "bg-orange-600 text-white"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
					>
						Read
					</button>
				</div>

				{/* Notifications List */}
				{notifications.length === 0 ? (
					<div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
						<FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							No notifications
						</h3>
						<p className="text-gray-600">
							{filter === "unread"
								? "You have no unread notifications"
								: filter === "read"
								? "You have no read notifications"
								: "You don't have any notifications yet"}
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{notifications.map((notification) => (
							<Link
								key={notification._id}
								to={notification.path || "#"}
								onClick={() => handleNotificationClick(notification._id)}
								className={`block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
									!notification.isRead ? "border-l-4 border-orange-500" : ""
								}`}
							>
								<div className="p-4 sm:p-5">
									<div className="flex gap-3 sm:gap-4">
										{/* Icon */}
										<div className="flex-shrink-0">
											{getNotificationIcon(notification.type)}
										</div>

										{/* Content */}
										<div className="flex-1 min-w-0">
											<div className="flex items-start justify-between gap-2 mb-2">
												<div className="flex-1">
													<h3
														className={`text-sm sm:text-base font-semibold ${
															!notification.isRead
																? "text-gray-900"
																: "text-gray-600"
														}`}
													>
														{notification.title}
													</h3>
												</div>
												<div className="flex items-center gap-2 flex-shrink-0">
													{!notification.isRead && (
														<span className="w-2 h-2 bg-blue-500 rounded-full"></span>
													)}
													{getPriorityBadge(notification.priority)}
												</div>
											</div>

											<p
												className={`text-sm mb-2 break-words ${
													!notification.isRead
														? "text-gray-700"
														: "text-gray-500"
												}`}
											>
												{notification.message}
											</p>

											<div className="flex items-center justify-between gap-2 text-xs text-gray-500">
												<div className="flex items-center gap-1">
													<IoMdTime />
													<span>
														{new Date(notification.createdAt).toLocaleString(
															"en-US",
															{
																month: "short",
																day: "numeric",
																year: "numeric",
																hour: "numeric",
																minute: "2-digit",
																hour12: true,
															}
														)}
													</span>
												</div>

												<button
													onClick={(e) =>
														handleDeleteNotification(e, notification._id)
													}
													disabled={deleteNotificationMutation.isPending}
													className="text-red-500 hover:text-red-700 transition-colors p-1"
													title="Delete notification"
												>
													<FaTrash />
												</button>
											</div>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				)}

				{/* Pagination */}
				{pagination.totalPages > 1 && (
					<div className="mt-6 flex items-center justify-center gap-2">
						<button
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={!pagination.hasPrev}
							className="px-4 py-2 bg-white rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
						>
							Previous
						</button>
						<span className="text-sm sm:text-base text-gray-600">
							Page {pagination.currentPage} of {pagination.totalPages}
						</span>
						<button
							onClick={() =>
								setPage((p) => Math.min(pagination.totalPages, p + 1))
							}
							disabled={!pagination.hasNext}
							className="px-4 py-2 bg-white rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
						>
							Next
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Notifications;
