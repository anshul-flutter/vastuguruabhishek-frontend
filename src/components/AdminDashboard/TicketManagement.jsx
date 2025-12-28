import React from "react";
import { FaBars, FaCircle } from "react-icons/fa";
import { useTicketsQuery } from "../../hooks/useTicketsApi";

const TicketManagement = () => {
	const {
		data: tickets = [],
		isLoading: loading,
		isError,
		error,
	} = useTicketsQuery();

	const getStatusColor = (status) => {
		return status === "Paid" ? "text-green-500" : "text-blue-500";
	};

	const formatDate = (dateString) => {
		if (!dateString) return "N/A";
		const date = new Date(dateString);
		return date.toLocaleDateString("en-IN", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			minimumFractionDigits: 2,
		}).format(amount);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="text-gray-500">Loading tickets...</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="text-red-500">
					{error?.response?.data?.message || "Failed to fetch tickets"}
				</div>
			</div>
		);
	}

	if (tickets.length === 0) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="text-gray-500">No tickets found</div>
			</div>
		);
	}

	return (
		<div className="flex justify-center">
			<div className="w-full max-w-4xl bg-white rounded-lg border border-gray-200">
				<div className="divide-y divide-gray-200">
					{tickets.map((ticket) => (
						<div
							key={ticket._id}
							className="flex items-center justify-between p-4 hover:bg-gray-50"
						>
							<div className="flex items-start space-x-2">
								<FaBars className="text-gray-400 mt-5" />
								<div>
									<h3 className="font-semibold text-gray-800">
										{ticket.eventTitle}
									</h3>
									<p className="text-sm text-gray-600 mt-1">
										{ticket.venue} • {ticket.ticketType} • Qty:{" "}
										{ticket.quantity}
									</p>
									<div className="flex items-center text-sm text-gray-500 space-x-2 mt-1">
										<FaCircle
											className={`w-2 h-2 ${getStatusColor(
												ticket.paymentStatus
											)}`}
										/>
										<span>
											{ticket.paymentStatus} | {formatDate(ticket.eventDate)} |{" "}
											{ticket.time}
										</span>
									</div>
								</div>
							</div>
							<div className="text-lg font-semibold text-gray-900">
								{formatCurrency(ticket.amount)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default TicketManagement;
