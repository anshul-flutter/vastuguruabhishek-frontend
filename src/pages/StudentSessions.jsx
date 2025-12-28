import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	HiCalendar as Calendar,
	HiClock as Clock,
	HiUsers as Users,
	HiVideoCamera as Video,
	HiPlay as Play,
	HiDocumentText as Document,
} from "react-icons/hi";
import { FaDownload, FaEye } from "react-icons/fa";
import { useEnrolledSessionsQuery } from "../hooks/useSessionApi";

const StudentSessions = () => {
	const navigate = useNavigate();
	const [filter, setFilter] = useState("all"); // all, live, upcoming, completed

	// Fetch real enrolled sessions from API
	const { data: allSessions = [], isLoading } = useEnrolledSessionsQuery();

	const handleJoinSession = (sessionId) => {
		// Navigate to the enhanced session page
		navigate(`/session/${sessionId}`);
	};

	const handleViewCourse = (courseId) => {
		navigate(`/course/${courseId}`);
	};

	const getStatusBadge = (status) => {
		const statusConfig = {
			live: { color: "bg-red-500", text: "🔴 Live Now", pulse: true },
			scheduled: { color: "bg-blue-500", text: "📅 Upcoming", pulse: false },
			completed: { color: "bg-green-500", text: "✅ Completed", pulse: false },
		};

		const config = statusConfig[status] || statusConfig.scheduled;
		return (
			<span
				className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${
					config.color
				} ${config.pulse ? "animate-pulse" : ""}`}
			>
				{config.text}
			</span>
		);
	};

	const getActionButtons = (session) => {
		const buttons = [];

		if (session.status === "live") {
			buttons.push(
				<button
					key="join"
					onClick={() => handleJoinSession(session._id)}
					className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors animate-pulse"
				>
					<Video className="w-3 h-3" />
					Join Live
				</button>
			);
		}

		if (session.status === "scheduled") {
			buttons.push(
				<button
					key="reminder"
					className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm cursor-not-allowed"
					disabled
				>
					<Clock className="w-3 h-3" />
					Scheduled
				</button>
			);
		}

		if (session.status === "completed" && session.recording?.recordingUrl) {
			buttons.push(
				<button
					key="watch"
					onClick={() => window.open(session.recording.recordingUrl)}
					className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
				>
					<Play className="w-3 h-3" />
					Watch
				</button>
			);
		}

		if (session.status === "completed" && session.recording?.slides) {
			buttons.push(
				<button
					key="slides"
					onClick={() => window.open(session.recording.slides)}
					className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm transition-colors"
				>
					<FaDownload className="w-3 h-3" />
					Slides
				</button>
			);
		}

		buttons.push(
			<button
				key="course"
				onClick={() => handleViewCourse(session.course?._id)}
				className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
			>
				<FaEye className="w-3 h-3" />
				Course
			</button>
		);

		return buttons;
	};

	const filteredSessions = allSessions.filter((session) => {
		if (filter === "all") return true;
		return session.status === filter;
	});

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			weekday: "short",
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const formatTime = (dateString) => {
		return new Date(dateString).toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">My Sessions</h1>
					<p className="text-gray-600">
						Manage your live sessions, watch recordings, and track your learning
						progress
					</p>
				</div>

				{/* Loading State */}
				{isLoading ? (
					<div className="bg-white shadow-lg rounded-lg p-12">
						<div className="flex flex-col items-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
							<p className="text-gray-600">Loading your sessions...</p>
						</div>
					</div>
				) : (
					<>
						{/* Filters */}
						<div className="mb-6 flex flex-wrap gap-3">
							{[
								{
									key: "all",
									label: "All Sessions",
									count: allSessions.length,
								},
								{
									key: "live",
									label: "Live Now",
									count: allSessions.filter((s) => s.status === "live").length,
								},
								{
									key: "scheduled",
									label: "Upcoming",
									count: allSessions.filter((s) => s.status === "scheduled")
										.length,
								},
								{
									key: "completed",
									label: "Completed",
									count: allSessions.filter((s) => s.status === "completed")
										.length,
								},
							].map((filterOption) => (
								<button
									key={filterOption.key}
									onClick={() => setFilter(filterOption.key)}
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
										filter === filterOption.key
											? "bg-red-500 text-white"
											: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
									}`}
								>
									{filterOption.label} ({filterOption.count})
								</button>
							))}
						</div>

						{/* Sessions Table */}
						<div className="bg-white shadow-lg rounded-lg overflow-hidden">
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Session
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Course & Instructor
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Schedule
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Status
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Enrollment
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{filteredSessions.map((session) => (
											<tr key={session._id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														<div>
															<div className="text-sm font-medium text-gray-900">
																{session.title}
															</div>
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900">
														{session.course?.title || "N/A"}
													</div>
													<div className="text-sm text-gray-500">
														{session.instructor?.name || "N/A"}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900 flex items-center gap-1">
														<Calendar className="w-4 h-4" />
														{formatDate(session.scheduledDate)}
													</div>
													<div className="text-sm text-gray-500 flex items-center gap-1">
														<Clock className="w-4 h-4" />
														{formatTime(session.scheduledDate)} (
														{session.duration}
														m)
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													{getStatusBadge(session.status)}
													{session.status === "live" && session.attendees && (
														<div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
															<Users className="w-3 h-3" />
															{session.attendees.length || 0} attending
														</div>
													)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
														✅ Enrolled
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
													<div className="flex flex-wrap gap-2">
														{getActionButtons(session)}
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{filteredSessions.length === 0 && (
								<div className="text-center py-12">
									<Document className="mx-auto h-12 w-12 text-gray-400" />
									<h3 className="mt-2 text-sm font-medium text-gray-900">
										No sessions found
									</h3>
									<p className="mt-1 text-sm text-gray-500">
										{filter === "all"
											? "You haven't enrolled in any courses with sessions yet."
											: `No ${filter} sessions available.`}
									</p>
									<div className="mt-6">
										<button
											onClick={() => navigate("/courses")}
											className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
										>
											<Video className="-ml-1 mr-2 h-5 w-5" />
											Explore Courses
										</button>
									</div>
								</div>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default StudentSessions;
