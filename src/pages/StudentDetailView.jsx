import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
	useCustomerByIdQuery,
	useStudentReportsQuery,
	useStudentBookingsQuery,
	useStudentProgressQuery,
} from "../hooks/useAdminApi";
import LoadingOverlay from "../components/common/LoadingOverlay";
import Tabs from "../components/common/Tabs";
import CourseProgressPage from "../components/courseProgress/CourseProgressPage";
import BookingHistory from "./BookingHistory";

const TABS = [
	{ key: "basicDetails", label: "Basic Details" },
	{ key: "courseProgress", label: "Course Progress" },
	{ key: "bookingHistory", label: "Booking History" },
	{ key: "studentOrders", label: "Orders" },
	// { key: "reportsDownload", label: "Reports Download" },
];

const PER_PAGE = 10;

export default function StudentDetailView() {
	const { studentId } = useParams();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("basicDetails");
	const [searchTerm, setSearchTerm] = useState("");
	const [page, setPage] = useState(1);

	// Fetch student data (includes orders)
	const {
		data: userData,
		isLoading: isUserLoading,
		isError: isUserError,
	} = useCustomerByIdQuery(studentId);

	// Fetch reports, bookings, and progress for this student
	const {
		data: reportsData,
		isLoading: isReportsLoading,
		isFetching: isReportsFetching,
		isError: isReportsError,
	} = useStudentReportsQuery(studentId);

	const {
		data: bookingsData,
		isLoading: isBookingsLoading,
		isFetching: isBookingsFetching,
		isError: isBookingsError,
	} = useStudentBookingsQuery(studentId);

	const {
		data: progressData,
		isLoading: isProgressLoading,
		isFetching: isProgressFetching,
		isError: isProgressError,
	} = useStudentProgressQuery(studentId);

	const student = userData;

	const reports = React.useMemo(
		() => reportsData?.reports ?? [],
		[reportsData]
	);
	const bookings = React.useMemo(
		() => bookingsData?.bookings ?? [],
		[bookingsData]
	);
	const progress = React.useMemo(
		() => progressData?.progress ?? [],
		[progressData]
	);

	// Build merged course progress list: ensure all enrolled courses appear,
	// even if no StudentProgress exists yet (show 0% placeholders)
	const mergedProgressEntries = React.useMemo(() => {
		const studentId = userData?._id;
		const studentInfo = studentId
			? { _id: studentId, name: userData?.name, email: userData?.email }
			: undefined;

		// Map existing progress by courseId for quick lookup
		const progressByCourse = new Map();
		for (const p of progress) {
			const cId = p?.course?._id || p?.course;
			if (cId) progressByCourse.set(String(cId), p);
		}

		const enrolled = Array.isArray(userData?.enrolledCourses)
			? userData.enrolledCourses
			: [];

		const results = [];

		// Add one entry per enrolled course, using progress if available
		for (const c of enrolled) {
			const cId = typeof c === "string" ? c : c?._id;
			if (!cId) continue;
			const existing = progressByCourse.get(String(cId));
			if (existing) {
				results.push(existing);
			} else {
				results.push({
					student: studentInfo,
					course: {
						_id: cId,
						title: typeof c === "object" ? c?.title : cId,
						image: typeof c === "object" ? c?.image : undefined,
					},
					videosCompleted: 0,
					videosTotal: 0,
					quizzesCompleted: 0,
					quizzesTotal: 0,
					progressPercent: 0,
					status: "On Track",
					timeline: [],
				});
			}
		}

		// Also include any progress entries whose course is not currently in enrolledCourses (edge cases)
		for (const p of progress) {
			const cId = p?.course?._id || p?.course;
			if (!cId) continue;
			if (
				!enrolled.some(
					(c) => String(typeof c === "string" ? c : c?._id) === String(cId)
				)
			) {
				results.push(p);
			}
		}

		return results;
	}, [userData, progress]);
	// Get orders from customer data (no separate API call needed)
	const orders = React.useMemo(() => userData?.orders ?? [], [userData]);

	// Filter reports by search term
	const filteredReports = React.useMemo(() => {
		const term = searchTerm.trim().toLowerCase();
		if (!term) return reports;
		return reports.filter((report) => {
			const haystack = [
				report.report,
				report.level,
				report.uploadedBy,
				report.student?.name,
			]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();
			return haystack.includes(term);
		});
	}, [reports, searchTerm]);

	// Pagination for reports
	const totalPages = Math.ceil(filteredReports.length / PER_PAGE);
	const paginatedReports = filteredReports.slice(
		(page - 1) * PER_PAGE,
		page * PER_PAGE
	);

	const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

	// Utility functions
	const formatDate = (dateStr) => {
		if (!dateStr) return "N/A";
		try {
			return new Date(dateStr).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		} catch {
			return "Invalid Date";
		}
	};

	const formatReportLevel = (level) => {
		if (!level) return "N/A";
		return level
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	const getLevelColor = (level) => {
		const colors = {
			basic: "#3B82F6",
			intermediate: "#F59E0B",
			advanced: "#10B981",
		};
		return colors[level?.toLowerCase()] ?? "#6B7280";
	};

	const handleDownload = (report) => {
		console.log("Downloading report:", report);
		// TODO: Implement actual download logic
	};

	// Tab badges
	const tabBadges = {
		basicDetails: 0,
		courseProgress: mergedProgressEntries.length,
		bookingHistory: bookings.length,
		studentOrders: orders.length,
		reportsDownload: reports.length,
	};

	const tabsWithBadges = TABS.map((tab) => ({
		...tab,
		badge: tabBadges[tab.key] ?? 0,
	}));

	if (isUserLoading) {
		return <LoadingOverlay fullscreen message="Loading student details..." />;
	}

	if (isUserError || !student) {
		return (
			<div className="mt-10 text-center text-red-600">
				Error loading student details. Please try again later.
			</div>
		);
	}

	return (
		<section className="space-y-6">
			{/* Back Button & Header */}
			<div className="flex items-center gap-4">
				<button
					onClick={() => navigate("/admin/student-management")}
					className="flex items-center gap-2 text-gray-600 transition-colors hover:text-[#BB0E00]"
				>
					<ArrowLeftIcon className="h-5 w-5" />
					<span className="text-sm font-medium">Back to Students</span>
				</button>
			</div>{" "}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h3 className="text-xl font-semibold text-gray-800">
						{student.name}
					</h3>
					<p className="text-sm text-gray-500">{student.email}</p>
				</div>
				{activeTab === "reportsDownload" && (
					<input
						type="search"
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
						placeholder="Search reports..."
						className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:border-[#BB0E00] focus:outline-none focus:ring-2 focus:ring-[#BB0E00]/30 sm:w-64"
					/>
				)}
			</div>
			{/* Tabs */}
			<Tabs
				tabs={tabsWithBadges}
				activeTab={activeTab}
				onTabChange={setActiveTab}
			/>
			{/* Tab Content */}
			{activeTab === "basicDetails" && (
				<section className="rounded-xl border border-[#E1E1E1] bg-white p-6">
					<h4 className="mb-4 text-lg font-semibold text-gray-800">
						Profile Information
					</h4>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<p className="text-sm font-medium text-gray-500">Full Name</p>
							<p className="text-gray-900">{student.name}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-gray-500">Email</p>
							<p className="text-gray-900">{student.email}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-gray-500">Phone</p>
							<p className="text-gray-900">{student.phone ?? "N/A"}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-gray-500">Member Since</p>
							<p className="text-gray-900">{formatDate(student.createdAt)}</p>
						</div>
					</div>
				</section>
			)}
			{activeTab === "courseProgress" && (
				<CourseProgressPage
					entries={mergedProgressEntries}
					isLoading={isProgressLoading}
					isFetching={isProgressFetching}
					isError={isProgressError}
				/>
			)}
			{activeTab === "bookingHistory" && (
				<BookingHistory
					bookings={bookings}
					isLoading={isBookingsLoading}
					isFetching={isBookingsFetching}
					isError={isBookingsError}
				/>
			)}
			{activeTab === "studentOrders" && (
				<section className="relative space-y-4">
					{isUserLoading ? (
						<LoadingOverlay message="Loading orders..." />
					) : isUserError ? (
						<p className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-700">
							Failed to load orders. Please try again.
						</p>
					) : orders.length === 0 ? (
						<p className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
							No orders found for this student.
						</p>
					) : (
						<div className="overflow-hidden rounded-xl border border-[#E1E1E1] bg-white">
							<div className="overflow-x-auto">
								<table className="w-full min-w-[900px] text-sm">
									<thead className="bg-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
										<tr>
											<th className="p-3">Order #</th>
											<th className="p-3">Items</th>
											<th className="p-3">Total</th>
											<th className="p-3">Status</th>
											<th className="p-3">Payment</th>
											<th className="p-3">Date</th>
											{/* Actions column removed */}
										</tr>
									</thead>
									<tbody>
										{orders.map((order) => (
											<tr
												key={order._id}
												className="border-t border-[#E1E1E1] text-gray-700 hover:bg-gray-50"
											>
												<td className="p-3 font-medium text-gray-900">
													{order.orderNumber}
												</td>
												<td className="p-3">
													<div className="space-y-1">
														{order.items && order.items.length > 0 ? (
															order.items.map((item, idx) => (
																<div key={idx} className="text-xs">
																	<span className="font-medium">
																		{item.title || "N/A"}
																	</span>
																	<span className="text-gray-500 ml-1">
																		({item.itemType})
																	</span>
																</div>
															))
														) : (
															<span className="text-xs text-gray-400">
																No items
															</span>
														)}
													</div>
												</td>
												<td className="p-3 font-semibold text-gray-900">
													₹{order.totalAmount?.toLocaleString() || 0}
												</td>
												<td className="p-3">
													<span
														className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
															order.status === "completed"
																? "bg-green-100 text-green-800"
																: order.status === "accepted"
																? "bg-blue-100 text-blue-800"
																: order.status === "declined"
																? "bg-red-100 text-red-800"
																: order.status === "cancelled"
																? "bg-gray-100 text-gray-800"
																: "bg-yellow-100 text-yellow-800"
														}`}
													>
														{order.status || "pending"}
													</span>
												</td>
												<td className="p-3">
													<span
														className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
															order.paymentStatus === "paid"
																? "bg-green-100 text-green-800"
																: order.paymentStatus === "failed"
																? "bg-red-100 text-red-800"
																: order.paymentStatus === "refunded"
																? "bg-purple-100 text-purple-800"
																: "bg-yellow-100 text-yellow-800"
														}`}
													>
														{order.paymentStatus || "pending"}
													</span>
												</td>
												<td className="p-3 text-xs text-gray-600">
													{formatDate(order.createdAt)}
												</td>
												{/* Actions cell removed */}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</section>
			)}
			{activeTab === "reportsDownload" && (
				<section className="relative space-y-4">
					{isReportsFetching && !isReportsLoading && (
						<LoadingOverlay message="Refreshing reports..." />
					)}

					{isReportsLoading ? (
						<LoadingOverlay message="Loading reports..." />
					) : isReportsError ? (
						<p className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-700">
							Failed to load reports. Please try again.
						</p>
					) : paginatedReports.length === 0 ? (
						<p className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
							{searchTerm
								? "No reports match your search."
								: "No reports available."}
						</p>
					) : (
						<div className="overflow-hidden rounded-xl border border-[#E1E1E1] bg-white">
							<table className="w-full min-w-[720px] text-sm">
								<thead className="bg-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
									<tr>
										<th className="p-3">Report</th>
										<th className="p-3">Level</th>
										<th className="p-3">Downloaded</th>
										<th className="p-3">Uploaded by</th>
										<th className="p-3 text-right">Action</th>
									</tr>
								</thead>
								<tbody>
									{paginatedReports.map((row) => (
										<tr
											key={row._id}
											className="border-t border-[#E1E1E1] text-gray-700"
										>
											<td className="p-3">{row.report}</td>
											<td
												className="p-3 font-semibold"
												style={{ color: getLevelColor(row.level) }}
											>
												{formatReportLevel(row.level)}
											</td>
											<td className="p-3">{formatDate(row.downloadedAt)}</td>
											<td className="p-3">{row.uploadedBy}</td>
											<td className="p-3 text-right">
												<button
													type="button"
													onClick={() => handleDownload(row)}
													className="inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90"
													style={{
														background:
															"linear-gradient(to right, #BB0E00, #B94400)",
													}}
												>
													Download
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					{paginatedReports.length > 0 && (
						<div className="flex flex-wrap items-center justify-between gap-3">
							<p className="text-sm text-gray-500">
								Showing {(page - 1) * PER_PAGE + 1}–
								{Math.min(page * PER_PAGE, filteredReports.length)} of{" "}
								{filteredReports.length} report
								{filteredReports.length === 1 ? "" : "s"}
							</p>
							<div className="flex items-center gap-2">
								<button
									type="button"
									onClick={() => setPage((prev) => Math.max(1, prev - 1))}
									disabled={page === 1}
									className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
								>
									Previous
								</button>
								{pageNumbers.map((number) => (
									<button
										key={number}
										type="button"
										onClick={() => setPage(number)}
										className={`rounded-md px-3 py-1 text-sm font-medium ${
											number === page
												? "bg-[#BB0E00] text-white"
												: "border border-gray-200 text-gray-600 hover:bg-gray-100"
										}`}
									>
										{number}
									</button>
								))}
								<button
									type="button"
									onClick={() =>
										setPage((prev) => Math.min(totalPages, prev + 1))
									}
									disabled={page === totalPages}
									className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
								>
									Next
								</button>
							</div>
						</div>
					)}
				</section>
			)}
		</section>
	);
}
