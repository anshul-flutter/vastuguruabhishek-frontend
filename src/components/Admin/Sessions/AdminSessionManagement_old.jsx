import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	HiPlus as Plus,
	HiCalendar as Calendar,
	HiClock as Clock,
	HiUsers as Users,
	HiPlay as Play,
	HiPencil as Edit,
	HiTrash as Trash2,
	HiUpload as Upload,
	HiVideoCamera as Video,
} from "react-icons/hi";
import {
	useAdminSessionsQuery,
	useStartSessionMutation,
	useEndSessionMutation,
	useDeleteSessionMutation,
} from "../../../hooks/useSessionApi";
import { formatDate, getRelativeTime } from "../../../utils/dateHelpers";
import CreateSessionModal from "./CreateSessionModal";
import EditSessionModal from "./EditSessionModal";
import UploadRecordingModal from "./UploadRecordingModal";

const AdminSessionManagement = () => {
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState(1);
	const [filters, setFilters] = useState({
		status: "",
		courseId: "",
		startDate: "",
		endDate: "",
	});
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [editingSession, setEditingSession] = useState(null);
	const [uploadingRecording, setUploadingRecording] = useState(null);

	const { data: sessionData, isLoading } = useAdminSessionsQuery({
		page: currentPage,
		limit: 10,
		...filters,
	});

	const startSessionMutation = useStartSessionMutation();
	const endSessionMutation = useEndSessionMutation();
	const deleteSessionMutation = useDeleteSessionMutation();

	const handleStartSession = (sessionId) => {
		if (window.confirm("Are you sure you want to start this session?")) {
			startSessionMutation.mutate(sessionId);
		}
	};

	const handleEndSession = (session) => {
		const sessionSummary = prompt("Enter session summary (optional):");
		if (sessionSummary !== null) {
			endSessionMutation.mutate({
				sessionId: session._id,
				sessionData: {
					sessionSummary,
					keyTopicsCovered: [],
				},
			});
		}
	};

	const handleJoinSession = (session) => {
		// Navigate to dedicated session page instead of opening modal
		navigate(`/session/${session._id}`);
	};

	const handleDeleteSession = (sessionId) => {
		if (
			window.confirm(
				"Are you sure you want to delete this session? This action cannot be undone."
			)
		) {
			deleteSessionMutation.mutate(sessionId);
		}
	};

	const getStatusBadge = (status) => {
		const statusConfig = {
			live: {
				color: "bg-red-100 text-red-800 border-red-200",
				text: "🔴 Live",
			},
			scheduled: {
				color: "bg-blue-100 text-blue-800 border-blue-200",
				text: "📅 Scheduled",
			},
			completed: {
				color: "bg-green-100 text-green-800 border-green-200",
				text: "✅ Completed",
			},
			cancelled: {
				color: "bg-gray-100 text-gray-800 border-gray-200",
				text: "❌ Cancelled",
			},
		};

		const config = statusConfig[status] || statusConfig.scheduled;

		return (
			<span
				className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
			>
				{config.text}
			</span>
		);
	};

	const getActionButtons = (session) => {
		const buttons = [];

		if (session.status === "scheduled") {
			buttons.push(
				<button
					key="start"
					onClick={() => handleStartSession(session._id)}
					className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
					disabled={startSessionMutation.isLoading}
				>
					<Play className="w-3 h-3" />
					Start
				</button>
			);

			buttons.push(
				<button
					key="edit"
					onClick={() => setEditingSession(session)}
					className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
				>
					<Edit className="w-3 h-3" />
					Edit
				</button>
			);
		}

		if (session.status === "live") {
			buttons.push(
				<button
					key="join"
					onClick={() => handleJoinSession(session)}
					className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
				>
					<Video className="w-3 h-3" />
					Join
				</button>
			);

			buttons.push(
				<button
					key="end"
					onClick={() => handleEndSession(session)}
					className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
					disabled={endSessionMutation.isLoading}
				>
					Stop
				</button>
			);
		}

		if (session.status === "completed" && !session.recording?.recordingUrl) {
			buttons.push(
				<button
					key="upload"
					onClick={() => setUploadingRecording(session)}
					className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm transition-colors"
				>
					<Upload className="w-3 h-3" />
					Recording
				</button>
			);
		}

		if (session.status !== "live") {
			buttons.push(
				<button
					key="delete"
					onClick={() => handleDeleteSession(session._id)}
					className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
					disabled={deleteSessionMutation.isLoading}
				>
					<Trash2 className="w-3 h-3" />
					Delete
				</button>
			);
		}

		return buttons;
	};

	if (isLoading) {
		return (
			<div className="p-6">
				<div className="animate-pulse space-y-4">
					{[...Array(5)].map((_, i) => (
						<div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 max-w-7xl mx-auto">
			{/* Header */}
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						Session Management
					</h1>
					<p className="text-gray-600">Manage live course sessions</p>
				</div>
				<button
					onClick={() => setShowCreateModal(true)}
					className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
				>
					<Plus className="w-4 h-4" />
					Create Session
				</button>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Status
						</label>
						<select
							value={filters.status}
							onChange={(e) =>
								setFilters({ ...filters, status: e.target.value })
							}
							className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">All Statuses</option>
							<option value="scheduled">Scheduled</option>
							<option value="live">Live</option>
							<option value="completed">Completed</option>
							<option value="cancelled">Cancelled</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Start Date
						</label>
						<input
							type="date"
							value={filters.startDate}
							onChange={(e) =>
								setFilters({ ...filters, startDate: e.target.value })
							}
							className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							End Date
						</label>
						<input
							type="date"
							value={filters.endDate}
							onChange={(e) =>
								setFilters({ ...filters, endDate: e.target.value })
							}
							className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="flex items-end">
						<button
							onClick={() =>
								setFilters({
									status: "",
									courseId: "",
									startDate: "",
									endDate: "",
								})
							}
							className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
						>
							Clear Filters
						</button>
					</div>
				</div>
			</div>

			{/* Sessions Table */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Session
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Course
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Schedule
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Attendance
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{sessionData?.sessions?.map((session) => (
								<tr key={session._id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div>
												<div className="text-sm font-medium text-gray-900">
													Session {session.sessionNumber}
												</div>
												<div className="text-sm text-gray-500">
													{session.title}
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">
											{session.course?.title}
										</div>
										<div className="text-sm text-gray-500">
											{session.instructor?.name}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">
											{formatDate(session.scheduledDate)}
										</div>
										<div className="text-sm text-gray-500">
											{session.scheduledTime} ({session.duration}m)
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{getStatusBadge(session.status)}
										<div className="text-xs text-gray-500 mt-1">
											{getRelativeTime(session.scheduledDate)}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{session.attendancePercentage !== undefined ? (
											<div>
												<div>
													{session.attendedStudents?.length || 0} /{" "}
													{session.enrolledStudents?.length || 0}
												</div>
												<div className="text-xs">
													{Math.round(session.attendancePercentage || 0)}%
												</div>
											</div>
										) : (
											<span className="text-gray-400">-</span>
										)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<div className="flex space-x-2">
											{getActionButtons(session)}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{sessionData?.pagination && (
					<div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
						<div className="flex-1 flex justify-between sm:hidden">
							<button
								onClick={() => setCurrentPage(currentPage - 1)}
								disabled={!sessionData.pagination.hasPrev}
								className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
							>
								Previous
							</button>
							<button
								onClick={() => setCurrentPage(currentPage + 1)}
								disabled={!sessionData.pagination.hasNext}
								className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
							>
								Next
							</button>
						</div>
						<div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
							<div>
								<p className="text-sm text-gray-700">
									Showing page{" "}
									<span className="font-medium">
										{sessionData.pagination.currentPage}
									</span>{" "}
									of{" "}
									<span className="font-medium">
										{sessionData.pagination.totalPages}
									</span>{" "}
									({sessionData.pagination.totalCount} total sessions)
								</p>
							</div>
							<div>
								<nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
									<button
										onClick={() => setCurrentPage(currentPage - 1)}
										disabled={!sessionData.pagination.hasPrev}
										className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
									>
										Previous
									</button>
									<button
										onClick={() => setCurrentPage(currentPage + 1)}
										disabled={!sessionData.pagination.hasNext}
										className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
									>
										Next
									</button>
								</nav>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Modals */}
			{showCreateModal && (
				<CreateSessionModal
					isOpen={showCreateModal}
					onClose={() => setShowCreateModal(false)}
				/>
			)}

			{editingSession && (
				<EditSessionModal
					session={editingSession}
					isOpen={!!editingSession}
					onClose={() => setEditingSession(null)}
				/>
			)}

			{uploadingRecording && (
				<UploadRecordingModal
					session={uploadingRecording}
					isOpen={!!uploadingRecording}
					onClose={() => setUploadingRecording(null)}
				/>
			)}
		</div>
	);
};

export default AdminSessionManagement;
