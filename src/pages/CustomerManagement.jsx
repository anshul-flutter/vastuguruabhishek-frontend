// src/pages/CustomerManagement.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "../components/common/Tabs";
import CustomerCard from "../components/customer/CustomerCard";
import OrdersHistory from "../components/customer/OrdersHistory";
import LoadingOverlay from "../components/common/LoadingOverlay";
import {
	useCustomersQuery,
	useCustomerOrdersQuery,
} from "../hooks/useAdminApi";

const TABS = [
	{ key: "customersList", label: "Customers List" },
	{ key: "ordersHistory", label: "Orders History" },
];

export default function CustomerManagement() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState(TABS[0].key);
	const [searchTerm, setSearchTerm] = useState("");

	const {
		data: customersData,
		isLoading: isCustomersLoading,
		isFetching: isCustomersFetching,
		isError: isCustomersError,
	} = useCustomersQuery({ keepPreviousData: true });

	const {
		data: ordersData,
		isLoading: isOrdersLoading,
		isFetching: isOrdersFetching,
		isError: isOrdersError,
	} = useCustomerOrdersQuery(null, { keepPreviousData: true });

	const customers = useMemo(
		() => customersData?.customers ?? [],
		[customersData]
	);
	const customerCount = customersData?.count ?? customers.length;
	const orders = useMemo(() => ordersData?.orders ?? [], [ordersData]);

	useEffect(() => {
		setSearchTerm("");
	}, [activeTab]);

	// Filter customers by search term
	const filteredCustomers = useMemo(() => {
		const term = searchTerm.trim().toLowerCase();
		if (!term || activeTab !== "customersList") return customers;
		return customers.filter((customer) => {
			const haystack = [
				customer.name,
				customer.email,
				customer.phone,
				customer._id,
			]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();
			return haystack.includes(term);
		});
	}, [customers, searchTerm, activeTab]);

	const filteredOrders = useMemo(() => {
		const term = searchTerm.trim().toLowerCase();
		if (!term) return orders;
		return orders.filter((order) => {
			const customerName =
				order.customer?.userId?.name || order.customer?.customerName || "";
			const customerEmail =
				order.customer?.userId?.email || order.customer?.email || "";
			const haystack = [
				customerName,
				customerEmail,
				order.orderId,
				order._id,
				order.orderStatus,
				order.payment?.paymentMethod,
			]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();
			return haystack.includes(term);
		});
	}, [orders, searchTerm]);

	if (isCustomersLoading) {
		return <LoadingOverlay fullscreen message="Loading customers..." />;
	}

	if (isCustomersError) {
		return (
			<div className="mt-10 text-center text-red-600">
				Error loading customers. Please try again later.
			</div>
		);
	}

	return (
		<div className="flex min-h-full flex-col gap-6 p-3 sm:p-6">
			{/* Header */}
			<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
				<div>
					<h3 className="text-2xl font-semibold text-gray-800">
						Customer Management
					</h3>
					<p className="mt-1 text-sm text-gray-500">
						{customerCount} total customer{customerCount === 1 ? "" : "s"}
					</p>
				</div>
				<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
					{(activeTab === "customersList" || activeTab === "ordersHistory") && (
						<input
							type="search"
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
							placeholder={
								activeTab === "customersList"
									? "Search customers..."
									: "Search orders..."
							}
							className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:border-[#BB0E00] focus:outline-none focus:ring-2 focus:ring-[#BB0E00]/30 sm:w-64"
						/>
					)}
					<button
						type="button"
						className="rounded-md px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
						style={{
							background: "linear-gradient(to right, #BB0E00, #B94400)",
						}}
					>
						+ Add Customer
					</button>
				</div>
			</div>

			{/* Tabs */}
			<Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

			{/* Content */}
			{activeTab === "customersList" && (
				<section className="relative">
					{isCustomersFetching && !isCustomersLoading && (
						<LoadingOverlay message="Refreshing customers..." />
					)}
					{filteredCustomers.length === 0 ? (
						<p className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
							{searchTerm
								? "No customers found matching your search."
								: "No customers found."}
						</p>
					) : (
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
							{filteredCustomers.map((customer) => (
								<CustomerCard
									key={customer._id}
									avatar="/images/profile.png"
									name={customer.name}
									phone={customer.phone || "N/A"}
									location="India"
									customerId={customer._id}
									onView={() => navigate(`/admin/user-detail/${customer._id}`)}
									onEdit={() => console.log("Edit customer:", customer._id)}
								/>
							))}
						</div>
					)}
				</section>
			)}

			{activeTab === "ordersHistory" && (
				<section className="relative">
					{isOrdersFetching && !isOrdersLoading && (
						<LoadingOverlay message="Refreshing orders..." />
					)}
					{filteredOrders.length === 0 ? (
						<p className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
							{searchTerm
								? "No orders found matching your search."
								: isOrdersError
								? "Error loading orders."
								: "No orders found."}
						</p>
					) : (
						<OrdersHistory orders={filteredOrders} />
					)}
				</section>
			)}
		</div>
	);
}
