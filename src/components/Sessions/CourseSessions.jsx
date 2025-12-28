import React, { useState } from "react";
import {
	HiCalendar as Calendar,
	HiClock as Clock,
	HiUsers as Users,
	HiPlay as Play,
	HiVideoCamera as Video,
	HiBookOpen as BookOpen,
} from "react-icons/hi";
import {
	useCourseSessionsQuery,
	useJoinSessionMutation,
} from "../../hooks/useSessionApi";
import { formatDate, getRelativeTime } from "../../utils/dateHelpers";

const CourseSessions = ({ courseId, courseName }) => {
	const [filter, setFilter] = useState("all");

	const { data: sessions, isLoading } = useCourseSessionsQuery(courseId, {
		upcoming: filter === "upcoming",
		completed: filter === "completed",
	});

	const joinSessionMutation = useJoinSessionMutation();

	const handleJoinSession = (sessionId) => {
		joinSessionMutation.mutate(sessionId);
	};

	const filteredSessions =
		sessions?.filter((session) => {
			if (filter === "all") return true;
			if (filter === "upcoming")
				return ["scheduled", "live"].includes(session.status);
			if (filter === "completed") return session.status === "completed";
			return true;
		}) || [];

	const getStatusBadge = (session) => {
		const statusConfig = {
			live: { color: "bg-red-100 text-red-800", icon: "🔴", text: "Live Now" },
			scheduled: {
				color: "bg-blue-100 text-blue-800",
				icon: "📅",
				text: "Scheduled",
			},
			completed: {
				color: "bg-green-100 text-green-800",
				icon: "✅",
				text: "Completed",
			},
			cancelled: {
				color: "bg-gray-100 text-gray-800",
				icon: "❌",
				text: "Cancelled",
			},
		};

		const config = statusConfig[session.status] || statusConfig.scheduled;

		return (
			<span
				className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
			>
				<span>{config.icon}</span>
				{config.text}
			</span>
		);
	};

	if (isLoading) {
		return (
			<div className="p-6">
				<div className="animate-pulse space-y-4">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="p-6">
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					Live Sessions - {courseName}
				</h2>
				<p className="text-gray-600">
					Interactive live sessions for this course
				</p>
			</div>

			{/* Filter Tabs */}
			<div className="mb-6">
				<nav className="flex space-x-6 border-b border-gray-200">
					{[
						{ key: "all", label: "All Sessions" },
						{ key: "upcoming", label: "Upcoming" },
						{ key: "completed", label: "Completed" },
					].map((tab) => (
						<button
							key={tab.key}
							onClick={() => setFilter(tab.key)}
							className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
								filter === tab.key
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700"
							}`}
						>
							{tab.label}
						</button>
					))}
				</nav>
			</div>

			{/* Sessions Grid */}
			{filteredSessions.length === 0 ? (
				<div className="text-center py-12">
					<BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						No sessions available
					</h3>
					<p className="text-gray-600">
						{filter === "upcoming"
							? "No upcoming sessions are scheduled for this course."
							: filter === "completed"
							? "No sessions have been completed yet."
							: "No sessions have been created for this course yet."}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{filteredSessions.map((session) => (
						<div
							key={session._id}
							className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
						>
							{/* Session Header */}
							<div className="flex justify-between items-start mb-4">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-2">
										<h3 className="text-lg font-semibold text-gray-900">
											Session {session.sessionNumber}: {session.title}
										</h3>
									</div>
									{getStatusBadge(session)}
								</div>

								{/* Action Button */}
								<div>
									{session.status === "live" || session.canJoin ? (
										<button
											onClick={() => handleJoinSession(session._id)}
											disabled={joinSessionMutation.isLoading}
											className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm"
										>
											<Video className="w-4 h-4" />
											{session.status === "live" ? "Join Live" : "Join"}
										</button>
									) : session.status === "completed" &&
									  session.recording?.recordingUrl ? (
										<button
											onClick={() =>
												window.open(session.recording.recordingUrl, "_blank")
											}
											className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
										>
											<Play className="w-4 h-4" />
											Recording
										</button>
									) : null}
								</div>
							</div>

							{/* Session Description */}
							{session.description && (
								<p className="text-gray-600 text-sm mb-4">
									{session.description}
								</p>
							)}

							{/* Session Details */}
							<div className="space-y-2 text-sm">
								<div className="flex items-center gap-2 text-gray-600">
									<Calendar className="w-4 h-4 text-blue-500" />
									<span>{formatDate(session.scheduledDate)}</span>
									<span className="text-gray-400">•</span>
									<span>{getRelativeTime(session.scheduledDate)}</span>
								</div>

								<div className="flex items-center gap-2 text-gray-600">
									<Clock className="w-4 h-4 text-green-500" />
									<span>{session.scheduledTime}</span>
									<span className="text-gray-400">•</span>
									<span>{session.duration} minutes</span>
								</div>

								<div className="flex items-center gap-2 text-gray-600">
									<Users className="w-4 h-4 text-purple-500" />
									<span>{session.instructor?.name || "Instructor"}</span>
								</div>
							</div>

							{/* Progress Indicator */}
							{session.hasAttended && (
								<div className="mt-4 p-2 bg-green-50 rounded-lg">
									<p className="text-sm text-green-800 flex items-center gap-1">
										<span>✅</span>
										Attended ({session.studentAttendance?.durationAttended ||
											0}{" "}
										min)
									</p>
								</div>
							)}

							{/* Session Materials Preview */}
							{session.materials?.length > 0 && (
								<div className="mt-4">
									<p className="text-xs text-gray-500 mb-1">
										{session.materials.length} material(s) available
									</p>
									<div className="flex flex-wrap gap-1">
										{session.materials.slice(0, 3).map((material, index) => (
											<span
												key={index}
												className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
											>
												📎 {material.title}
											</span>
										))}
										{session.materials.length > 3 && (
											<span className="text-xs text-gray-500">
												+{session.materials.length - 3} more
											</span>
										)}
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default CourseSessions;
