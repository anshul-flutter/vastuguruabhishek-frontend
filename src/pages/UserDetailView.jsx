// src/pages/UserDetailView.jsx
import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	useCustomerByIdQuery,
	useAdminUsersQuery,
	useCustomerOrdersQuery,
	useStudentReportsQuery,
	useStudentBookingsQuery,
	useStudentProgressQuery,
} from "../hooks/useAdminApi";
import LoadingOverlay from "../components/common/LoadingOverlay";
import {
	UserIcon,
	EnvelopeIcon,
	PhoneIcon,
	MapPinIcon,
	CalendarIcon,
	ShoppingBagIcon,
	AcademicCapIcon,
	DocumentTextIcon,
	ChartBarIcon,
	ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const formatDate = (value) => {
	if (!value) return "N/A";
	try {
		return new Date(value).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	} catch {
		return "N/A";
	}
};

const formatCurrency = (amount) => {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		minimumFractionDigits: 0,
	}).format(amount);
};

const InfoRow = ({ icon: Icon, label, value }) => (
	<div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
		<Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
		<div className="flex-1 min-w-0">
			<p className="text-sm text-gray-500">{label}</p>
			<p className="text-sm font-medium text-gray-900 break-words">{value}</p>
		</div>
	</div>
);

const StatCard = ({ icon: Icon, label, value, color = "bg-blue-500" }) => (
	<div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
		<div className="flex items-center gap-4">
			<div className={`${color} rounded-full p-3`}>
				<Icon className="w-6 h-6 text-white" />
			</div>
			<div>
				<p className="text-sm text-gray-500">{label}</p>
				<p className="text-2xl font-bold text-gray-900">{value}</p>
			</div>
		</div>
	</div>
);

export default function UserDetailView() {
	const { userId } = useParams();
	const navigate = useNavigate();

	// Try to fetch as customer first
	const {
		data: customerData,
		isLoading: isCustomerLoading,
		isError: isCustomerError,
	} = useCustomerByIdQuery(userId);

	// Fetch all students to check if this is a student
	const { data: studentsData, isLoading: isStudentsLoading } =
		useAdminUsersQuery();

	// Fetch customer orders
	const { data: ordersData } = useCustomerOrdersQuery(userId);

	// Fetch student-specific data
	const { data: reportsData } = useStudentReportsQuery();
	const { data: bookingsData } = useStudentBookingsQuery();
	const { data: progressData } = useStudentProgressQuery();

	const students = useMemo(() => studentsData?.students ?? [], [studentsData]);
	const student = useMemo(
		() => students.find((s) => s._id === userId),
		[students, userId]
	);

	const orders = useMemo(() => ordersData?.orders ?? [], [ordersData]);
	const reports = useMemo(
		() => (reportsData?.reports ?? []).filter((r) => r.student?._id === userId),
		[reportsData, userId]
	);
	const bookings = useMemo(
		() =>
			(bookingsData?.bookings ?? []).filter((b) => b.student?._id === userId),
		[bookingsData, userId]
	);
	const progress = useMemo(
		() =>
			(progressData?.progress ?? []).filter((p) => p.student?._id === userId),
		[progressData, userId]
	);

	// Determine if this is a customer or student
	const isCustomer = !isCustomerError && customerData;
	const isStudent = !!student;
	const user = isCustomer ? customerData : student;

	if (isCustomerLoading || isStudentsLoading) {
		return <LoadingOverlay fullscreen message="Loading user details..." />;
	}

	if (!user) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
				<p className="text-lg text-gray-600">User not found</p>
				<button
					onClick={() => navigate(-1)}
					className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
				>
					Go Back
				</button>
			</div>
		);
	}

	const totalSpent = orders.reduce(
		(sum, order) => sum + (order.payment?.amount || 0),
		0
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button
						onClick={() => navigate(-1)}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<ArrowLeftIcon className="w-5 h-5 text-gray-600" />
					</button>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							{isCustomer ? "Customer" : "Student"} Details
						</h1>
						<p className="text-sm text-gray-500">
							View complete profile information
						</p>
					</div>
				</div>
				<div className="flex gap-2">
					<button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
						Edit
					</button>
					<button
						className="px-4 py-2 text-white rounded-lg hover:opacity-90"
						style={{
							background: "linear-gradient(to right, #BB0E00, #B94400)",
						}}
					>
						Send Message
					</button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{isCustomer && (
					<>
						<StatCard
							icon={ShoppingBagIcon}
							label="Total Orders"
							value={orders.length}
							color="bg-blue-500"
						/>
						<StatCard
							icon={ChartBarIcon}
							label="Total Spent"
							value={formatCurrency(totalSpent)}
							color="bg-green-500"
						/>
					</>
				)}
				{isStudent && (
					<>
						<StatCard
							icon={AcademicCapIcon}
							label="Course Progress"
							value={progress.length}
							color="bg-purple-500"
						/>
						<StatCard
							icon={DocumentTextIcon}
							label="Reports"
							value={reports.length}
							color="bg-orange-500"
						/>
						<StatCard
							icon={CalendarIcon}
							label="Bookings"
							value={bookings.length}
							color="bg-blue-500"
						/>
					</>
				)}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Profile Information */}
				<div className="lg:col-span-1">
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
						{/* Profile Header */}
						<div
							className="h-32 relative"
							style={{
								background: "linear-gradient(to right, #BB0E00, #B94400)",
							}}
						>
							<div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
								<img
									src="/images/aditi.png"
									alt={user.name}
									className="w-24 h-24 rounded-full border-4 border-white object-cover"
								/>
							</div>
						</div>

						{/* Profile Info */}
						<div className="pt-16 px-6 pb-6">
							<h2 className="text-xl font-bold text-gray-900 text-center">
								{user.name}
							</h2>
							<p className="text-sm text-gray-500 text-center mt-1">
								{isCustomer ? "Customer" : "Student"}
							</p>

							<div className="mt-6 space-y-1">
								<InfoRow icon={UserIcon} label="User ID" value={user._id} />
								<InfoRow icon={EnvelopeIcon} label="Email" value={user.email} />
								<InfoRow
									icon={PhoneIcon}
									label="Phone"
									value={user.phone || "N/A"}
								/>
								{user.address && (
									<InfoRow
										icon={MapPinIcon}
										label="Address"
										value={user.address}
									/>
								)}
								<InfoRow
									icon={CalendarIcon}
									label="Member Since"
									value={formatDate(user.createdAt)}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Activity Information */}
				<div className="lg:col-span-2 space-y-6">
					{/* Recent Orders (for customers) */}
					{isCustomer && orders.length > 0 && (
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Recent Orders
							</h3>
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead className="bg-gray-50 text-left">
										<tr>
											<th className="p-3 font-medium text-gray-700">
												Order ID
											</th>
											<th className="p-3 font-medium text-gray-700">Date</th>
											<th className="p-3 font-medium text-gray-700">Amount</th>
											<th className="p-3 font-medium text-gray-700">Status</th>
										</tr>
									</thead>
									<tbody>
										{orders.slice(0, 5).map((order) => (
											<tr key={order._id} className="border-t border-gray-100">
												<td className="p-3 text-gray-900">
													{order.orderId || order._id.slice(-8)}
												</td>
												<td className="p-3 text-gray-600">
													{formatDate(order.orderDate)}
												</td>
												<td className="p-3 text-gray-900 font-medium">
													{formatCurrency(order.payment?.amount || 0)}
												</td>
												<td className="p-3">
													<span
														className={`px-2 py-1 rounded-full text-xs font-medium ${
															order.orderStatus === "delivered"
																? "bg-green-100 text-green-800"
																: order.orderStatus === "shipped"
																? "bg-blue-100 text-blue-800"
																: order.orderStatus === "processing"
																? "bg-yellow-100 text-yellow-800"
																: "bg-gray-100 text-gray-800"
														}`}
													>
														{order.orderStatus}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							{orders.length > 5 && (
								<p className="mt-4 text-sm text-gray-500 text-center">
									Showing 5 of {orders.length} orders
								</p>
							)}
						</div>
					)}

					{/* Student Reports */}
					{isStudent && reports.length > 0 && (
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Reports
							</h3>
							<div className="space-y-3">
								{reports.slice(0, 5).map((report) => (
									<div
										key={report._id}
										className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
									>
										<div>
											<p className="font-medium text-gray-900">
												{report.report}
											</p>
											<p className="text-xs text-gray-500">
												Level: {report.level} • {formatDate(report.createdAt)}
											</p>
										</div>
										{report.fileUrl && (
											<button
												onClick={() => window.open(report.fileUrl, "_blank")}
												className="text-sm text-[#BB0E00] hover:underline"
											>
												Download
											</button>
										)}
									</div>
								))}
							</div>
							{reports.length > 5 && (
								<p className="mt-4 text-sm text-gray-500 text-center">
									Showing 5 of {reports.length} reports
								</p>
							)}
						</div>
					)}

					{/* Student Bookings */}
					{isStudent && bookings.length > 0 && (
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Booking History
							</h3>
							<div className="space-y-3">
								{bookings.slice(0, 5).map((booking) => (
									<div
										key={booking._id}
										className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
									>
										<div>
											<p className="font-medium text-gray-900">
												{booking.course?.title || "Course Booking"}
											</p>
											<p className="text-xs text-gray-500">
												{formatDate(booking.bookingDate)}
											</p>
										</div>
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${
												booking.status === "confirmed"
													? "bg-green-100 text-green-800"
													: booking.status === "pending"
													? "bg-yellow-100 text-yellow-800"
													: "bg-gray-100 text-gray-800"
											}`}
										>
											{booking.status}
										</span>
									</div>
								))}
							</div>
							{bookings.length > 5 && (
								<p className="mt-4 text-sm text-gray-500 text-center">
									Showing 5 of {bookings.length} bookings
								</p>
							)}
						</div>
					)}

					{/* Empty State */}
					{isCustomer && orders.length === 0 && (
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
							<ShoppingBagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
							<p className="text-gray-600">No orders yet</p>
						</div>
					)}

					{isStudent &&
						reports.length === 0 &&
						bookings.length === 0 &&
						progress.length === 0 && (
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
								<AcademicCapIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-600">No activity data available yet</p>
							</div>
						)}
				</div>
			</div>
		</div>
	);
}
