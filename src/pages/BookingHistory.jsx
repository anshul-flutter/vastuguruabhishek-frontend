import React from "react";
import {
	CalendarDaysIcon,
	ClockIcon,
	UserCircleIcon,
	BanknotesIcon,
	EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import LoadingOverlay from "../components/common/LoadingOverlay";

const fallbackAvatar = "/images/astrologer-avatar.png";

const formatDate = (value) => {
	if (!value) return "—";
	try {
		return new Date(value).toLocaleDateString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	} catch {
		return "—";
	}
};

const formatTime = (value) => {
	if (!value) return "—";
	const [hours, minutes] = value.split(":");
	if (hours == null || minutes == null) return value;
	const date = new Date();
	date.setHours(Number(hours), Number(minutes));
	return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const formatCurrency = (value) => {
	const amount = Number.isFinite(value) ? value : 0;
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0,
	}).format(amount);
};

const getStatusClasses = (status) => {
	const normalized = status?.toLowerCase();
	if (normalized === "paid") return "bg-green-100 text-green-700";
	if (normalized === "pending") return "bg-yellow-100 text-yellow-700";
	if (normalized === "failed") return "bg-red-100 text-red-700";
	return "bg-gray-100 text-gray-600";
};

const DetailRow = ({ icon, label, value }) => (
	<div className="flex items-center justify-between text-sm text-gray-700">
		<div className="flex items-center gap-2 text-gray-500">
			{icon}
			<span>{label}</span>
		</div>
		<span className="font-medium text-gray-900">{value}</span>
	</div>
);

const BookingHistory = ({ bookings = [], isLoading, isFetching, isError }) => {
	if (isLoading) {
		return <LoadingOverlay fullscreen message="Loading booking history..." />;
	}

	if (isError) {
		return (
			<p className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-700">
				Failed to load booking history. Please try again.
			</p>
		);
	}

	if (!bookings.length) {
		return (
			<p className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
				No bookings recorded yet.
			</p>
		);
	}

	return (
		<section className="relative">
			{isFetching && <LoadingOverlay message="Refreshing booking history..." />}

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
				{bookings.map((booking) => {
					const key =
						booking._id ??
						`${booking.student?._id ?? "student"}-${
							booking.course?._id ?? "course"
						}-${booking.sessionDate}`;
					const studentName = booking.student?.name ?? "Unknown Student";
					const studentId = booking.student?._id ?? "—";
					const courseTitle = booking.course?.title ?? "—";
					const sessionDate = formatDate(booking.sessionDate);
					const sessionTime = formatTime(booking.sessionTime);
					const astrologerName = booking.astrologerName ?? "—";
					const paymentAmount = formatCurrency(booking.paymentAmount);
					const payoutAmount = formatCurrency(booking.payoutAmount);
					const paymentStatus = booking.paymentStatus ?? "Pending";
					const statusClasses = getStatusClasses(paymentStatus);
					const avatar =
						booking.avatar || booking.student?.avatar || fallbackAvatar;

					return (
						<article
							key={key}
							className="space-y-3 rounded-2xl border border-gray-200 bg-[#F7F7F7] p-4 shadow-sm"
						>
							<div className="flex items-start justify-between rounded-2xl bg-white p-4 shadow-sm">
								<div className="flex items-center gap-3">
									<img
										src={avatar}
										alt={studentName}
										className="h-14 w-14 rounded-full object-cover"
										onError={(event) => {
											event.currentTarget.src = fallbackAvatar;
										}}
									/>
									<div>
										<h2 className="text-base font-semibold text-gray-900">
											{studentName}
										</h2>
										<p className="text-xs text-gray-500">ID: {studentId}</p>
										<p className="text-sm text-gray-600">{courseTitle}</p>
									</div>
								</div>
								<button
									type="button"
									className="rounded-md p-2 text-gray-400 hover:bg-gray-100"
									aria-label="Booking actions"
								>
									<EllipsisVerticalIcon className="h-5 w-5" />
								</button>
							</div>

							<div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
								<DetailRow
									icon={<CalendarDaysIcon className="h-4 w-4" />}
									label="Date"
									value={sessionDate}
								/>
								<DetailRow
									icon={<ClockIcon className="h-4 w-4" />}
									label="Time"
									value={sessionTime}
								/>
								<DetailRow
									icon={<UserCircleIcon className="h-4 w-4" />}
									label="Astrologer"
									value={astrologerName}
								/>
								<DetailRow
									icon={<BanknotesIcon className="h-4 w-4" />}
									label="Payment"
									value={paymentAmount}
								/>
								<DetailRow
									icon={
										<div className="h-4 w-4 rounded-full border-2 border-current" />
									}
									label="Status"
									value={
										<span
											className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
												booking.bookingStatus === "Completed"
													? "bg-green-100 text-green-700"
													: booking.bookingStatus === "Cancelled"
													? "bg-red-100 text-red-700"
													: "bg-blue-100 text-blue-700"
											}`}
										>
											{booking.bookingStatus || "Scheduled"}
										</span>
									}
								/>
								<DetailRow
									icon={<div className="h-4 w-4" />}
									label="Type"
									value={booking.type || "Booking"}
								/>

								<div className="flex items-center justify-between border-t border-[#BB0E00]/30 pt-3 text-sm">
									<div className="flex items-center gap-2 text-gray-500">
										<BanknotesIcon className="h-4 w-4" />
										<span>Total payout</span>
									</div>
									<div className="text-right">
										<p className="text-base font-semibold text-gray-900">
											{payoutAmount}
										</p>
										<span
											className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusClasses}`}
										>
											{paymentStatus}
										</span>
									</div>
								</div>
							</div>
						</article>
					);
				})}
			</div>
		</section>
	);
};

export default BookingHistory;
