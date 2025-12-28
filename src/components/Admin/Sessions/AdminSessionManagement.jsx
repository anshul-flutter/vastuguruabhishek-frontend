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
	// HiUpload as Upload, // Commented out - Upload recording feature disabled
	HiVideoCamera as Video,
} from "react-icons/hi";
import {
	useAdminSessionsQuery,
	useStartSessionMutation,
	useEndSessionMutation,
	useDeleteSessionMutation,
} from "../../../hooks/useSessionApi";
import { formatDate } from "../../../utils/dateHelpers";
import CreateSessionModal from "./CreateSessionModal";
import EditSessionModal from "./EditSessionModal";
// import UploadRecordingModal from "./UploadRecordingModal"; // Commented out - Upload recording feature disabled

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
	// const [uploadingRecording, setUploadingRecording] = useState(null); // Commented out - Upload recording feature disabled

	const { data: sessionData, isLoading } = useAdminSessionsQuery({
		page: currentPage,
		limit: 10,
		...filters,
	});

	// Debug logging
	console.log("Session data:", sessionData);
	console.log("Filters:", filters);

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
		// Navigate to full-screen admin live session page
		navigate(`/admin/live-session/${session._id}`);
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
		};

		const config = statusConfig[status] || statusConfig.scheduled;

		return (
			<span
				className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}
			>
				{config.text}
			</span>
		);
	};

	const formatInstructorName = (session) => {
		if (session.instructor?.name) {
			return session.instructor.name;
		}
		return "Unknown Instructor";
	};

	const getActionButtons = (session) => {
		const { status } = session;

		if (status === "scheduled") {
			return (
				<div className="flex space-x-2">
					<button
						onClick={() => handleStartSession(session._id)}
						disabled={startSessionMutation.isLoading}
						className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors disabled:opacity-50"
					>
						<Play className="w-3 h-3" />
						Start
					</button>
					<button
						onClick={() => setEditingSession(session)}
						className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
					>
						<Edit className="w-3 h-3" />
						Edit
					</button>
					<button
						onClick={() => handleDeleteSession(session._id)}
						disabled={deleteSessionMutation.isLoading}
						className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors disabled:opacity-50"
					>
						<Trash2 className="w-3 h-3" />
						Delete
					</button>
				</div>
			);
		}

		if (status === "live") {
			return (
				<div className="flex space-x-2">
					<button
						onClick={() => handleJoinSession(session)}
						className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
					>
						<Video className="w-3 h-3" />
						Join
					</button>
					<button
						onClick={() => handleEndSession(session)}
						disabled={endSessionMutation.isLoading}
						className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors disabled:opacity-50"
					>
						End Session
					</button>
				</div>
			);
		}

		if (status === "completed") {
			return (
				<div className="flex space-x-2">
					{/* Upload Recording button - Commented out - Feature disabled
					<button
						onClick={() => setUploadingRecording(session)}
						className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded transition-colors"
					>
						<Upload className="w-3 h-3" />
						Upload Recording
					</button>
					*/}
					<button
						onClick={() => handleDeleteSession(session._id)}
						disabled={deleteSessionMutation.isLoading}
						className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors disabled:opacity-50"
					>
						<Trash2 className="w-3 h-3" />
						Delete
					</button>
				</div>
			);
		}

		return null;
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

	// Debug: Show if no sessions found
	if (
		!sessionData ||
		!sessionData.sessions ||
		sessionData.sessions.length === 0
	) {
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

				{/* No Sessions Found */}
				<div className="bg-white rounded-lg shadow p-8 text-center">
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No Sessions Found
					</h3>
					<p className="text-gray-600 mb-4">
						{sessionData
							? "No sessions match your current filters. Try adjusting your filters or create a new session."
							: "Unable to load sessions. Please check your connection and try again."}
					</p>

					{/* Debug Info */}
					<div className="bg-gray-50 p-4 rounded text-sm text-left mb-4">
						<strong>Debug Info:</strong>
						<br />
						Session Data: {JSON.stringify(sessionData, null, 2)}
						<br />
						Current Filters: {JSON.stringify(filters, null, 2)}
					</div>

					<div className="flex gap-4 justify-center">
						<button
							onClick={() => setShowCreateModal(true)}
							className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
						>
							Create First Session
						</button>
						<button
							onClick={() =>
								setFilters({
									status: "",
									courseId: "",
									startDate: "",
									endDate: "",
								})
							}
							className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
						>
							Clear All Filters
						</button>
					</div>
				</div>

				{/* Modals */}
				{showCreateModal && (
					<CreateSessionModal
						isOpen={showCreateModal}
						onClose={() => setShowCreateModal(false)}
					/>
				)}
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
			<div className="bg-white rounded-lg shadow p-6 mb-6">
				<h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
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
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">All Statuses</option>
							<option value="scheduled">Scheduled</option>
							<option value="live">Live</option>
							<option value="completed">Completed</option>
							<option value="cancelled">Cancelled</option>
							<option value="rescheduled">Rescheduled</option>
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
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
							className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
						>
							Clear Filters
						</button>
					</div>
				</div>
			</div>

			{/* Sessions Table */}
			<div className="bg-white rounded-lg shadow overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Session Details
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
									Attendees
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
										<div>
											<div className="text-sm font-medium text-gray-900">
												{session.title}
											</div>
											<div className="text-sm text-gray-500">
												Session #{session.sessionNumber || "N/A"}
											</div>
										</div>
									</td>

									<td className="px-6 py-4 whitespace-nowrap">
										<div>
											<div className="text-sm font-medium text-gray-900">
												{session.course?.title || "Unknown Course"}
											</div>
											<div className="text-sm text-gray-500">
												{formatInstructorName(session)}
											</div>
										</div>
									</td>

									<td className="px-6 py-4 whitespace-nowrap">
										<div>
											<div className="text-sm text-gray-900 flex items-center gap-1">
												<Calendar className="w-4 h-4 text-blue-500" />
												{formatDate(session.scheduledDate)}
											</div>
											<div className="text-sm text-gray-500 flex items-center gap-1">
												<Clock className="w-4 h-4 text-green-500" />
												{session.scheduledTime} ({session.duration}min)
											</div>
										</div>
									</td>

									<td className="px-6 py-4 whitespace-nowrap">
										{getStatusBadge(session.status)}
									</td>

									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900 flex items-center gap-1">
											<Users className="w-4 h-4 text-purple-500" />
											{session.attendees || 0} / {session.maxAttendees || "∞"}
										</div>
									</td>

									<td className="px-6 py-4 whitespace-nowrap">
										{getActionButtons(session)}
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
								disabled={!sessionData.pagination.hasPrevious}
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
								<nav
									className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
									aria-label="Pagination"
								>
									<button
										onClick={() => setCurrentPage(currentPage - 1)}
										disabled={!sessionData.pagination.hasPrevious}
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
					onClose={() => setEditingSession(null)}
				/>
			)}

			{/* Upload Recording Modal - Commented out - Feature disabled
			{uploadingRecording && (
				<UploadRecordingModal
					session={uploadingRecording}
					onClose={() => setUploadingRecording(null)}
				/>
			)}
			*/}
		</div>
	);
};

export default AdminSessionManagement;
