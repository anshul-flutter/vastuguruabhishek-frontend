import React, { useState } from "react";
import { useMyOrdersQuery } from "../hooks/useOrdersApi";

const MyOrders = () => {
	const [filter, setFilter] = useState({
		status: "",
		itemType: "",
		page: 1,
		limit: 10,
	});

	// Build query params from filter
	const queryParams = {};
	if (filter.status) queryParams.status = filter.status;
	if (filter.itemType) queryParams.itemType = filter.itemType;
	queryParams.page = filter.page;
	queryParams.limit = filter.limit;

	// Use the my orders query hook
	const { data: ordersData, isLoading: loading } = useMyOrdersQuery({
		params: queryParams,
	});

	const orders = ordersData?.data ?? [];
	const pagination = ordersData?.pagination;

	const getStatusColor = (status) => {
		const colors = {
			pending: "bg-yellow-100 text-yellow-800",
			accepted: "bg-blue-100 text-blue-800",
			declined: "bg-red-100 text-red-800",
			completed: "bg-green-100 text-green-800",
			cancelled: "bg-gray-100 text-gray-800",
		};
		return colors[status] || "bg-gray-100 text-gray-800";
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4">
				<h1 className="text-3xl font-bold mb-8">My Orders</h1>

				{/* Filters */}
				<div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow">
					<select
						value={filter.itemType}
						onChange={(e) =>
							setFilter({ ...filter, itemType: e.target.value, page: 1 })
						}
						className="border rounded px-3 py-2"
					>
						<option value="">All Categories</option>
						<option value="course">Courses</option>
						<option value="book">Books</option>
						<option value="package">Packages</option>
						<option value="service">Services</option>
					</select>

					<select
						value={filter.status}
						onChange={(e) =>
							setFilter({ ...filter, status: e.target.value, page: 1 })
						}
						className="border rounded px-3 py-2"
					>
						<option value="">All Status</option>
						<option value="pending">Pending</option>
						<option value="accepted">Accepted</option>
						<option value="declined">Declined</option>
						<option value="completed">Completed</option>
						<option value="cancelled">Cancelled</option>
					</select>

					<button
						onClick={() =>
							setFilter({
								status: "",
								itemType: "",
								page: 1,
								limit: 10,
							})
						}
						className="border rounded px-3 py-2 hover:bg-gray-100"
					>
						Clear Filters
					</button>
				</div>

				{/* Orders List */}
				{loading ? (
					<p className="text-center py-8">Loading...</p>
				) : orders.length === 0 ? (
					<div className="bg-white rounded-lg shadow p-8 text-center">
						<p className="text-gray-500">No orders found</p>
					</div>
				) : (
					<div className="space-y-4">
						{orders.map((order) => (
							<div
								key={order._id}
								className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
							>
								<div className="flex justify-between items-start mb-4">
									<div>
										<h3 className="text-lg font-semibold">
											Order #{order.orderNumber}
										</h3>
										<p className="text-sm text-gray-500">
											{new Date(order.createdAt).toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</p>
									</div>
									<div className="text-right">
										<span
											className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
												order.status
											)}`}
										>
											{order.status}
										</span>
										<p className="text-lg font-bold mt-2">
											₹{order.totalAmount}
										</p>
									</div>
								</div>

								<div className="border-t pt-4">
									<h4 className="font-medium mb-2">Items:</h4>
									{order.items && order.items.length > 0 ? (
										<div className="space-y-2">
											{order.items.map((item, idx) => (
												<div
													key={idx}
													className="flex items-center gap-4 p-2 bg-gray-50 rounded"
												>
													{item.image && (
														<img
															src={item.image}
															alt={item.title}
															className="w-16 h-16 object-cover rounded"
														/>
													)}
													<div className="flex-1">
														<p className="font-medium">{item.title}</p>
														<p className="text-sm text-gray-500">
															{item.itemType} • Qty: {item.quantity}
														</p>
													</div>
													<p className="font-medium">₹{item.price}</p>
												</div>
											))}
										</div>
									) : (
										<div className="p-4 bg-gray-50 rounded text-center text-gray-500">
											<p>No items in this order</p>
											<p className="text-xs mt-1">
												This order may have been created incorrectly
											</p>
										</div>
									)}
								</div>

								{order.trackingNumber && (
									<div className="mt-4 pt-4 border-t">
										<p className="text-sm">
											<span className="font-medium">Tracking Number:</span>{" "}
											{order.trackingNumber}
										</p>
									</div>
								)}
							</div>
						))}
					</div>
				)}

				{/* Pagination */}
				{pagination && pagination.pages > 1 && (
					<div className="flex justify-center items-center gap-4 mt-8">
						<button
							onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
							disabled={filter.page === 1}
							className="px-6 py-2 border rounded disabled:opacity-50 bg-white hover:bg-gray-50"
						>
							Previous
						</button>
						<span className="text-sm">
							Page {pagination.page} of {pagination.pages}
						</span>
						<button
							onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
							disabled={filter.page === pagination.pages}
							className="px-6 py-2 border rounded disabled:opacity-50 bg-white hover:bg-gray-50"
						>
							Next
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default MyOrders;
