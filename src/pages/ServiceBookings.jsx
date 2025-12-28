import React, { useState } from "react";
import {
	useServiceBookingsQuery,
	useUpdateBookingStatusMutation,
} from "../hooks/useOrdersApi";

const ServiceBookings = () => {
	const [filter, setFilter] = useState({
		serviceType: "",
		status: "",
		page: 1,
		limit: 10,
	});

	// Build query params from filter
	const queryParams = {};
	if (filter.serviceType) queryParams.serviceType = filter.serviceType;
	if (filter.status) queryParams.status = filter.status;
	queryParams.page = filter.page;
	queryParams.limit = filter.limit;

	// Use the service bookings query hook
	const { data: bookings = [], isLoading: loading } = useServiceBookingsQuery({
		params: queryParams,
	});

	// Mutation hook for status updates
	const updateBookingStatusMutation = useUpdateBookingStatusMutation();

	const handleStatusUpdate = (orderId, newStatus) => {
		updateBookingStatusMutation.mutate({ orderId, status: newStatus });
	};

	const getServiceTypeLabel = (itemType, serviceType) => {
		if (itemType === "service") return "Standalone Service";
		if (itemType === "package") return "Package";
		if (serviceType === "consultation") return "Consultation";
		return itemType;
	};

	const getServiceTypeBadgeColor = (itemType) => {
		if (itemType === "consultation" || itemType === "package")
			return "bg-purple-100 text-purple-700";
		if (itemType === "package") return "bg-indigo-100 text-indigo-700";
		return "bg-green-100 text-green-700";
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-IN", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Service Bookings</h1>
			</div>

			{/* Filters */}
			<div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
				<select
					value={filter.serviceType}
					onChange={(e) =>
						setFilter({ ...filter, serviceType: e.target.value })
					}
					className="border rounded px-3 py-2"
				>
					<option value="">All Service Types</option>
					<option value="consultation">Consultations</option>
					<option value="package">Packages</option>
					<option value="service">Standalone Services</option>
				</select>

				<select
					value={filter.status}
					onChange={(e) => setFilter({ ...filter, status: e.target.value })}
					className="border rounded px-3 py-2"
				>
					<option value="">All Status</option>
					<option value="pending">Pending</option>
					<option value="processing">Processing</option>
					<option value="completed">Completed</option>
					<option value="cancelled">Cancelled</option>
				</select>

				<button
					onClick={() =>
						setFilter({ serviceType: "", status: "", page: 1, limit: 10 })
					}
					className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
				>
					Clear Filters
				</button>
			</div>

			{/* Bookings Table */}
			{loading ? (
				<div className="flex justify-center py-8">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				</div>
			) : (
				<div className="overflow-x-auto bg-white rounded-lg shadow">
					<table className="min-w-full">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
									Order #
								</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
									Date
								</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
									Customer
								</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
									Service Details
								</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
									Type
								</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
									Amount
								</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
									Status
								</th>
								{/* Actions column removed */}
							</tr>
						</thead>
						<tbody>
							{bookings.length === 0 ? (
								<tr>
									<td
										colSpan="7"
										className="px-6 py-8 text-center text-gray-500"
									>
										No service bookings found.
									</td>
								</tr>
							) : (
								bookings
									.filter(
										(booking) =>
											Array.isArray(booking.items) &&
											booking.items.some((item) =>
												["service", "package", "consultation"].includes(
													item.itemType
												)
											)
									)
									.map((booking) => (
										<tr key={booking._id} className="border-b hover:bg-gray-50">
											<td className="px-6 py-4 font-medium">
												{booking.orderNumber}
											</td>
											<td className="px-6 py-4">
												{formatDate(booking.createdAt)}
											</td>
											<td className="px-6 py-4">
												<div>
													<p className="font-medium">
														{booking.user?.name || "N/A"}
													</p>
													<p className="text-sm text-gray-500">
														{booking.user?.email}
													</p>
												</div>
											</td>
											<td className="px-6 py-4">
												{booking.items
													?.filter((item) =>
														["service", "package", "consultation"].includes(
															item.itemType
														)
													)
													.map((item, idx) => (
														<div key={idx} className="mb-1">
															<p className="font-medium text-sm">
																{item.title}
															</p>
														</div>
													))}
											</td>
											<td className="px-6 py-4">
												{booking.items
													?.filter((item) =>
														["service", "package", "consultation"].includes(
															item.itemType
														)
													)
													.map((item, idx) => (
														<span
															key={idx}
															className={`px-2 py-1 rounded-full text-xs ${getServiceTypeBadgeColor(
																item.itemType
															)} block mb-1 w-fit`}
														>
															{getServiceTypeLabel(
																item.itemType,
																item.serviceDetails?.serviceType
															)}
														</span>
													))}
											</td>
											<td className="px-6 py-4 font-medium">
												₹{booking.totalAmount}
											</td>
											<td className="px-6 py-4">
												<select
													value={booking.status}
													onChange={(e) =>
														handleStatusUpdate(booking._id, e.target.value)
													}
													className={`px-2 py-1 rounded text-sm border ${
														booking.status === "completed"
															? "bg-green-50 text-green-800 border-green-300"
															: booking.status === "processing"
															? "bg-blue-50 text-blue-800 border-blue-300"
															: booking.status === "cancelled"
															? "bg-red-50 text-red-800 border-red-300"
															: "bg-yellow-50 text-yellow-800 border-yellow-300"
													}`}
												>
													<option value="pending">Pending</option>
													<option value="processing">Processing</option>
													<option value="completed">Completed</option>
													<option value="cancelled">Cancelled</option>
												</select>
											</td>
											{/* Actions cell removed */}
										</tr>
									))
							)}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default ServiceBookings;
