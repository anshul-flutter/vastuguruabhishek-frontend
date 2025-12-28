import React, { useState } from "react";
import {
	useOrdersQuery,
	useUpdateOrderStatusMutation,
	useUpdatePaymentStatusMutation,
} from "../hooks/useOrdersApi";

const OrderManagement = () => {
	const [filter, setFilter] = useState({
		status: "",
		itemType: "",
		paymentStatus: "",
		page: 1,
		limit: 10,
	});

	// Build query params from filter
	const queryParams = {};
	if (filter.status) queryParams.status = filter.status;
	if (filter.itemType) queryParams.itemType = filter.itemType;
	if (filter.paymentStatus) queryParams.paymentStatus = filter.paymentStatus;
	queryParams.page = filter.page;
	queryParams.limit = filter.limit;

	// Use the orders query hook
	const { data: ordersData, isLoading: loading } = useOrdersQuery({
		params: queryParams,
	});

	const orders = ordersData?.data ?? [];
	const pagination = ordersData?.pagination;

	// Mutation hooks for status updates
	const updateOrderStatusMutation = useUpdateOrderStatusMutation();
	const updatePaymentStatusMutation = useUpdatePaymentStatusMutation();

	const handleStatusUpdate = (orderId, newStatus) => {
		updateOrderStatusMutation.mutate({ orderId, status: newStatus });
	};

	const handlePaymentStatusUpdate = (orderId, newPaymentStatus) => {
		updatePaymentStatusMutation.mutate({
			orderId,
			paymentStatus: newPaymentStatus,
		});
	};

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
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Order Management</h1>
			</div>

			{/* Filters */}
			<div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
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

				<select
					value={filter.paymentStatus}
					onChange={(e) =>
						setFilter({ ...filter, paymentStatus: e.target.value, page: 1 })
					}
					className="border rounded px-3 py-2"
				>
					<option value="">All Payment Status</option>
					<option value="pending">Pending</option>
					<option value="paid">Paid</option>
					<option value="failed">Failed</option>
					<option value="refunded">Refunded</option>
				</select>

				<button
					onClick={() =>
						setFilter({
							status: "",
							itemType: "",
							paymentStatus: "",
							page: 1,
							limit: 10,
						})
					}
					className="border rounded px-3 py-2 hover:bg-gray-100"
				>
					Clear Filters
				</button>
			</div>

			{/* Orders Table */}
			{loading ? (
				<p>Loading...</p>
			) : orders.length === 0 ? (
				<p className="text-center text-gray-500 py-8">No orders found</p>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full bg-white border">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-4 py-3 text-left">Order #</th>
								<th className="px-4 py-3 text-left">Customer</th>
								<th className="px-4 py-3 text-left">Items</th>
								<th className="px-4 py-3 text-left">Amount</th>
								<th className="px-4 py-3 text-left">Status</th>
								<th className="px-4 py-3 text-left">Payment</th>
								<th className="px-4 py-3 text-left">Date</th>
								<th className="px-4 py-3 text-left">Actions</th>
							</tr>
						</thead>
						<tbody>
							{orders.map((order) => (
								<tr key={order._id} className="border-b hover:bg-gray-50">
									<td className="px-4 py-3 font-medium">{order.orderNumber}</td>
									<td className="px-4 py-3">
										<div>
											<p className="font-medium">{order.user?.name}</p>
											<p className="text-sm text-gray-500">
												{order.user?.email}
											</p>
										</div>
									</td>
									<td className="px-4 py-3">
										<div className="space-y-1">
											{order.items.map((item, idx) => (
												<div key={idx} className="text-sm">
													<span className="font-medium">{item.title}</span>
													<span className="text-gray-500 ml-1">
														({item.itemType})
													</span>
												</div>
											))}
										</div>
									</td>
									<td className="px-4 py-3">₹{order.totalAmount}</td>
									<td className="px-4 py-3">
										<span
											className={`px-2 py-1 rounded text-sm ${getStatusColor(
												order.status
											)}`}
										>
											{order.status}
										</span>
									</td>
									<td className="px-4 py-3">
										<span
											className={`px-2 py-1 rounded text-sm ${
												order.paymentStatus === "paid"
													? "bg-green-100 text-green-800"
													: "bg-yellow-100 text-yellow-800"
											}`}
										>
											{order.paymentStatus}
										</span>
									</td>
									<td className="px-4 py-3 text-sm">
										{new Date(order.createdAt).toLocaleDateString()}
									</td>
									<td className="px-4 py-3">
										<div className="space-y-2">
											{/* Order Status */}
											<div>
												<label className="text-xs text-gray-600 block mb-1">
													Order Status
												</label>
												<select
													value={order.status}
													onChange={(e) =>
														handleStatusUpdate(order._id, e.target.value)
													}
													className="border rounded px-2 py-1 text-sm w-full"
												>
													<option value="pending">Pending</option>
													<option value="accepted">Accept</option>
													<option value="declined">Decline</option>
													<option value="completed">Complete</option>
													<option value="cancelled">Cancel</option>
												</select>
											</div>

											{/* Payment Status */}
											<div>
												<label className="text-xs text-gray-600 block mb-1">
													Payment Status
												</label>
												<select
													value={order.paymentStatus}
													onChange={(e) =>
														handlePaymentStatusUpdate(order._id, e.target.value)
													}
													className="border rounded px-2 py-1 text-sm w-full"
												>
													<option value="pending">Pending</option>
													<option value="paid">Paid</option>
													<option value="failed">Failed</option>
													<option value="refunded">Refunded</option>
												</select>
											</div>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* Pagination */}
			{pagination && pagination.pages > 1 && (
				<div className="flex justify-center items-center gap-4 mt-6">
					<button
						onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
						disabled={filter.page === 1}
						className="px-4 py-2 border rounded disabled:opacity-50"
					>
						Previous
					</button>
					<span className="text-sm">
						Page {pagination.page} of {pagination.pages}
					</span>
					<button
						onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
						disabled={filter.page === pagination.pages}
						className="px-4 py-2 border rounded disabled:opacity-50"
					>
						Next
					</button>
				</div>
			)}
		</div>
	);
};

export default OrderManagement;
