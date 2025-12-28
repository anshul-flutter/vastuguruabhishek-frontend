// src/components/customer/OrdersHistory.jsx
import React from "react";

const formatDate = (date) => {
	if (!date) return "—";
	try {
		return new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	} catch {
		return "—";
	}
};

const formatCurrency = (value) => {
	const amount = Number.isFinite(value) ? value : 0;
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0,
	}).format(amount);
};

const getStatusColor = (status) => {
	const normalized = status?.toLowerCase();
	if (normalized === "delivered") return "text-green-600";
	if (normalized === "shipped") return "text-blue-600";
	if (normalized === "pending") return "text-yellow-600";
	if (normalized === "cancelled") return "text-red-600";
	return "text-gray-600";
};

export default function OrdersHistory({ orders = [] }) {
	if (!orders || orders.length === 0) {
		return (
			<p className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
				No orders found.
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			{orders.map((order) => {
				// Handle both populated and non-populated data
				const customerName =
					order.customer?.userId?.name ||
					order.customer?.customerName ||
					"Unknown Customer";
				const customerEmail =
					order.customer?.userId?.email || order.customer?.email;
				const orderId = order.orderId || order._id;
				const orderDate = formatDate(order.orderDate || order.createdAt);
				const totalAmount = formatCurrency(order.payment?.amount || 0);
				const status = order.orderStatus || "Pending";

				return (
					<div
						key={order._id}
						className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100"
					>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							{/* Left column: labels */}
							<div className="space-y-2 text-sm text-gray-600">
								<div className="flex items-center gap-2">
									<img
										src="/images/time-icon.png"
										alt="icon"
										className="w-4 h-4"
									/>
									<span>Customer Name:</span>
								</div>
								{customerEmail && (
									<div className="flex items-center gap-2">
										<img
											src="/images/time-icon.png"
											alt="icon"
											className="w-4 h-4"
										/>
										<span>Email:</span>
									</div>
								)}
								<div className="flex items-center gap-2">
									<img
										src="/images/time-icon.png"
										alt="icon"
										className="w-4 h-4"
									/>
									<span>Order ID:</span>
								</div>
								<div className="flex items-center gap-2">
									<img
										src="/images/time-icon.png"
										alt="icon"
										className="w-4 h-4"
									/>
									<span>Order Date:</span>
								</div>
								<div className="flex items-center gap-2">
									<img
										src="/images/time-icon.png"
										alt="icon"
										className="w-4 h-4"
									/>
									<span>Total Amount:</span>
								</div>
								<div className="flex items-center gap-2">
									<img
										src="/images/time-icon.png"
										alt="icon"
										className="w-4 h-4"
									/>
									<span>Status:</span>
								</div>
								<div className="flex items-center gap-2">
									<img
										src="/images/time-icon.png"
										alt="icon"
										className="w-4 h-4"
									/>
									<span>Payment Method:</span>
								</div>
							</div>

							{/* Middle spacer */}
							<div className="hidden sm:block" />

							{/* Right column: values */}
							<div className="text-sm text-gray-800 space-y-2 text-right">
								<div>{customerName}</div>
								{customerEmail && <div>{customerEmail}</div>}
								<div className="font-medium">{orderId}</div>
								<div>{orderDate}</div>
								<div className="font-semibold">{totalAmount}</div>
								<div className={`font-medium ${getStatusColor(status)}`}>
									{status}
								</div>
								<div>{order.payment?.paymentMethod || "—"}</div>
							</div>
						</div>

						{/* Product Details */}
						{order.product && (
							<div className="mt-4 border-t pt-4">
								<h4 className="text-sm font-semibold mb-2">Product Details:</h4>
								<div className="flex items-center gap-3 text-sm text-gray-700">
									{order.product.image && (
										<img
											src={order.product.image}
											alt={order.product.title}
											className="w-16 h-16 rounded object-cover"
										/>
									)}
									<div className="flex-1">
										<div className="font-medium">
											{order.product.title || "Unknown Product"}
										</div>
										<div className="text-xs text-gray-500">
											Category: {order.product.category || "—"}
										</div>
										<div className="text-xs text-gray-500">
											Qty: {order.product.quantity} ×{" "}
											{formatCurrency(order.product.price)}
										</div>
									</div>
									<div className="font-semibold">
										{formatCurrency(
											(order.product.quantity || 0) * (order.product.price || 0)
										)}
									</div>
								</div>
							</div>
						)}

						{/* Shipping Address */}
						{order.shipping && (
							<div className="mt-4 border-t pt-4">
								<h4 className="text-sm font-semibold mb-2">
									Shipping Address:
								</h4>
								<div className="text-sm text-gray-700">
									{order.shipping.addressLines?.map((line, idx) => (
										<div key={idx}>{line}</div>
									))}
									<div>
										{order.shipping.city && `${order.shipping.city}, `}
										{order.shipping.state && `${order.shipping.state} `}
										{order.shipping.pincode}
									</div>
									<div>{order.shipping.country || "India"}</div>
								</div>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
