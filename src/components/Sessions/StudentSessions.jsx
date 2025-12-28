import React, { useState } from "react";
import {
	HiCalendar as Calendar,
	HiClock as Clock,
	HiUsers as Users,
	HiPlay as Play,
	HiDownload as Download,
	HiVideoCamera as Video,
} from "react-icons/hi";
import {
	useStudentSessionsQuery,
	useJoinSessionMutation,
} from "../../hooks/useSessionApi";
import { formatDate } from "../../utils/dateHelpers";

const StudentSessions = () => {
	const [activeTab, setActiveTab] = useState("upcoming");

	const { data: upcomingSessions, isLoading: loadingUpcoming } =
		useStudentSessionsQuery({
			upcoming: activeTab === "upcoming",
			completed: activeTab === "completed",
			missed: activeTab === "missed",
		});

	const joinSessionMutation = useJoinSessionMutation();

	const handleJoinSession = (sessionId) => {
		joinSessionMutation.mutate(sessionId);
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "live":
				return "bg-red-500 text-white";
			case "completed":
				return "bg-green-500 text-white";
			case "scheduled":
				return "bg-blue-500 text-white";
			case "cancelled":
				return "bg-gray-500 text-white";
			default:
				return "bg-gray-400 text-white";
		}
	};

	const getSessionActions = (session) => {
		if (session.status === "live" || session.canJoin) {
			return (
				<button
					onClick={() => handleJoinSession(session._id)}
					disabled={joinSessionMutation.isLoading}
					className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
				>
					<Video className="w-4 h-4" />
					{session.status === "live" ? "Join Live" : "Join Session"}
				</button>
			);
		}

		if (session.status === "completed" && session.recording?.recordingUrl) {
			return (
				<div className="flex gap-2">
					<button
						onClick={() =>
							window.open(session.recording.recordingUrl, "_blank")
						}
						className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
					>
						<Play className="w-4 h-4" />
						Watch Recording
					</button>
					{session.recording.downloadable && (
						<button
							onClick={() =>
								window.open(session.recording.recordingUrl, "_blank")
							}
							className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
						>
							<Download className="w-4 h-4" />
							Download
						</button>
					)}
				</div>
			);
		}

		return null;
	};

	if (loadingUpcoming) {
		return (
			<div className="p-6">
				<div className="animate-pulse space-y-4">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 max-w-6xl mx-auto">
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					My Live Sessions
				</h1>
				<p className="text-gray-600">
					Manage your course sessions and recordings
				</p>
			</div>

			{/* Tab Navigation */}
			<div className="mb-6">
				<nav className="flex space-x-8 border-b border-gray-200">
					{[
						{ key: "upcoming", label: "Upcoming Sessions" },
						{ key: "completed", label: "Completed Sessions" },
						{ key: "missed", label: "Missed Sessions" },
					].map((tab) => (
						<button
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
								activeTab === tab.key
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700"
							}`}
						>
							{tab.label}
						</button>
					))}
				</nav>
			</div>

			{/* Sessions List */}
			<div className="space-y-4">
				{upcomingSessions?.length === 0 ? (
					<div className="text-center py-12">
						<Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							No {activeTab} sessions
						</h3>
						<p className="text-gray-600">
							{activeTab === "upcoming"
								? "You don't have any upcoming sessions scheduled."
								: activeTab === "completed"
								? "You haven't completed any sessions yet."
								: "You don't have any missed sessions."}
						</p>
					</div>
				) : (
					upcomingSessions?.map((session) => (
						<div
							key={session._id}
							className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
						>
							<div className="flex justify-between items-start mb-4">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-2">
										<h3 className="text-xl font-semibold text-gray-900">
											{session.title}
										</h3>
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
												session.statusDisplay
											)}`}
										>
											{session.statusDisplay}
										</span>
									</div>
									<p className="text-gray-600 mb-2">{session.course?.title}</p>
									<p className="text-gray-500 text-sm">{session.description}</p>
								</div>
								<div className="text-right">{getSessionActions(session)}</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
								<div className="flex items-center gap-2">
									<Calendar className="w-4 h-4 text-blue-500" />
									<span>{formatDate(session.scheduledDate)}</span>
								</div>
								<div className="flex items-center gap-2">
									<Clock className="w-4 h-4 text-green-500" />
									<span>
										{session.scheduledTime} ({session.duration} min)
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Users className="w-4 h-4 text-purple-500" />
									<span>{session.instructor?.name || "Instructor"}</span>
								</div>
							</div>

							{/* Student Attendance Info */}
							{session.studentAttendance && (
								<div className="mt-4 p-3 bg-green-50 rounded-lg">
									<p className="text-sm text-green-800">
										✅ Attended - Duration:{" "}
										{session.studentAttendance.durationAttended || 0} minutes
										{session.studentAttendance.participationScore > 0 && (
											<span className="ml-2">
												| Participation Score:{" "}
												{session.studentAttendance.participationScore}%
											</span>
										)}
									</p>
								</div>
							)}

							{/* Recording Info */}
							{session.recording?.recordingUrl && (
								<div className="mt-4 p-3 bg-blue-50 rounded-lg">
									<div className="flex items-center justify-between">
										<p className="text-sm text-blue-800">
											📹 Recording available (
											{session.recording.recordingDuration || 0} min)
										</p>
										<div className="flex gap-2">
											<button
												onClick={() =>
													window.open(session.recording.recordingUrl, "_blank")
												}
												className="text-blue-600 hover:text-blue-800 text-sm font-medium"
											>
												Watch
											</button>
											{session.recording.downloadable && (
												<button
													onClick={() =>
														window.open(
															session.recording.recordingUrl,
															"_blank"
														)
													}
													className="text-green-600 hover:text-green-800 text-sm font-medium"
												>
													Download
												</button>
											)}
										</div>
									</div>
								</div>
							)}

							{/* Session Materials */}
							{session.materials?.length > 0 && (
								<div className="mt-4">
									<h4 className="text-sm font-medium text-gray-900 mb-2">
										Session Materials:
									</h4>
									<div className="flex flex-wrap gap-2">
										{session.materials.map((material, index) => (
											<a
												key={index}
												href={material.url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
											>
												📎 {material.title}
											</a>
										))}
									</div>
								</div>
							)}
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default StudentSessions;
