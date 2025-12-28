import React, { useState } from "react";
import {
	HiPlus as Plus,
	HiPlay as Play,
	HiVideoCamera as Video,
	HiUsers as Users,
	HiCalendar as Calendar,
	HiClock as Clock,
	HiAcademicCap as GraduationCap,
	HiUserGroup as UserGroup,
	HiCog as Settings,
} from "react-icons/hi2";

const SessionManagementDemo = () => {
	const [viewMode, setViewMode] = useState("admin"); // admin or student
	const [selectedSession, setSelectedSession] = useState(null);

	// Mock data for demonstration
	const mockCourses = [
		{
			id: "course1",
			title: "Complete Vedic Astrology Course",
			description: "Master the ancient art of Vedic astrology",
			instructor: "Dr. Rajesh Sharma",
			students: 45,
			sessions: 12,
			completedSessions: 3,
		},
		{
			id: "course2",
			title: "Numerology Fundamentals",
			description: "Understanding the power of numbers",
			instructor: "Prof. Meera Patel",
			students: 32,
			sessions: 8,
			completedSessions: 2,
		},
	];

	const mockSessions = [
		{
			id: "session1",
			courseId: "course1",
			courseName: "Complete Vedic Astrology Course",
			title: "Introduction to Birth Charts",
			description: "Learn the basics of reading and interpreting birth charts",
			instructor: "Dr. Rajesh Sharma",
			status: "live",
			scheduledDate: "2024-10-09",
			scheduledTime: "15:00",
			duration: 90,
			attendees: 28,
			maxAttendees: 45,
			sessionNumber: 4,
		},
		{
			id: "session2",
			courseId: "course1",
			courseName: "Complete Vedic Astrology Course",
			title: "Understanding Planetary Positions",
			description: "Deep dive into planetary positions and their meanings",
			instructor: "Dr. Rajesh Sharma",
			status: "scheduled",
			scheduledDate: "2024-10-12",
			scheduledTime: "15:00",
			duration: 90,
			attendees: 0,
			maxAttendees: 45,
			sessionNumber: 5,
		},
		{
			id: "session3",
			courseId: "course2",
			courseName: "Numerology Fundamentals",
			title: "Life Path Numbers",
			description: "Calculate and interpret life path numbers",
			instructor: "Prof. Meera Patel",
			status: "scheduled",
			scheduledDate: "2024-10-10",
			scheduledTime: "18:00",
			duration: 60,
			attendees: 0,
			maxAttendees: 32,
			sessionNumber: 3,
		},
		{
			id: "session4",
			courseId: "course1",
			courseName: "Complete Vedic Astrology Course",
			title: "Houses and Their Significance",
			description: "Previous session - watch recording",
			instructor: "Dr. Rajesh Sharma",
			status: "completed",
			scheduledDate: "2024-10-05",
			scheduledTime: "15:00",
			duration: 90,
			attendees: 42,
			maxAttendees: 45,
			sessionNumber: 3,
			hasRecording: true,
		},
	];

	const getStatusBadge = (status) => {
		const statusConfig = {
			live: {
				color: "bg-red-100 text-red-800 border-red-200",
				text: "🔴 Live Now",
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
				className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
			>
				{config.text}
			</span>
		);
	};

	const AdminView = () => (
		<div className="space-y-6">
			{/* Admin Header */}
			<div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-2xl font-bold mb-2">
							Admin Session Management
						</h1>
						<p className="opacity-90">
							Create, manage, and monitor live sessions across all courses
						</p>
					</div>
					<button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2">
						<Plus className="w-4 h-4" />
						Create New Session
					</button>
				</div>
			</div>

			{/* Course Overview */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{mockCourses.map((course) => (
					<div key={course.id} className="bg-white rounded-lg shadow-md p-6">
						<div className="flex items-start justify-between mb-4">
							<div className="flex-1">
								<h3 className="text-lg font-semibold text-gray-900 mb-1">
									{course.title}
								</h3>
								<p className="text-gray-600 text-sm mb-2">
									{course.description}
								</p>
								<p className="text-gray-500 text-sm">by {course.instructor}</p>
							</div>
							<GraduationCap className="w-8 h-8 text-blue-500" />
						</div>

						<div className="grid grid-cols-3 gap-4 text-center text-sm">
							<div>
								<div className="text-lg font-bold text-blue-600">
									{course.students}
								</div>
								<div className="text-gray-600">Students</div>
							</div>
							<div>
								<div className="text-lg font-bold text-green-600">
									{course.completedSessions}
								</div>
								<div className="text-gray-600">Completed</div>
							</div>
							<div>
								<div className="text-lg font-bold text-purple-600">
									{course.sessions}
								</div>
								<div className="text-gray-600">Total Sessions</div>
							</div>
						</div>

						<div className="mt-4 pt-4 border-t border-gray-200">
							<button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium">
								Manage Sessions
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Sessions Management Table */}
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-200">
					<h2 className="text-lg font-semibold text-gray-900">
						All Sessions Overview
					</h2>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
									Session
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
									Course
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
									Schedule
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
									Status
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
									Attendance
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{mockSessions.map((session) => (
								<tr key={session.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div>
											<div className="text-sm font-medium text-gray-900">
												Session {session.sessionNumber}
											</div>
											<div className="text-sm text-gray-500">
												{session.title}
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">
											{session.courseName}
										</div>
										<div className="text-sm text-gray-500">
											{session.instructor}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">
											{session.scheduledDate}
										</div>
										<div className="text-sm text-gray-500">
											{session.scheduledTime} ({session.duration}m)
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{getStatusBadge(session.status)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										{session.status === "scheduled" ? (
											<span className="text-gray-400">-</span>
										) : (
											<div>
												<div className="text-gray-900">
													{session.attendees}/{session.maxAttendees}
												</div>
												<div className="text-gray-500">
													{Math.round(
														(session.attendees / session.maxAttendees) * 100
													)}
													%
												</div>
											</div>
										)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex space-x-2">
											{session.status === "live" && (
												<button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
													End Session
												</button>
											)}
											{session.status === "scheduled" && (
												<>
													<button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
														<Play className="w-3 h-3" />
														Start
													</button>
													<button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
														Edit
													</button>
												</>
											)}
											{session.status === "completed" && (
												<button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm">
													Upload Recording
												</button>
											)}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);

	const StudentView = () => (
		<div className="space-y-6">
			{/* Student Header */}
			<div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-2xl font-bold mb-2">My Live Sessions</h1>
						<p className="opacity-90">
							Join live classes, access recordings, and track your progress
						</p>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold">3</div>
						<div className="text-sm opacity-90">Upcoming</div>
					</div>
				</div>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white rounded-lg shadow p-4 text-center">
					<div className="text-2xl font-bold text-red-600">1</div>
					<div className="text-sm text-gray-600">Live Now</div>
				</div>
				<div className="bg-white rounded-lg shadow p-4 text-center">
					<div className="text-2xl font-bold text-blue-600">2</div>
					<div className="text-sm text-gray-600">Upcoming</div>
				</div>
				<div className="bg-white rounded-lg shadow p-4 text-center">
					<div className="text-2xl font-bold text-green-600">5</div>
					<div className="text-sm text-gray-600">Completed</div>
				</div>
				<div className="bg-white rounded-lg shadow p-4 text-center">
					<div className="text-2xl font-bold text-purple-600">87%</div>
					<div className="text-sm text-gray-600">Attendance</div>
				</div>
			</div>

			{/* Session Cards for Students */}
			<div className="space-y-4">
				{mockSessions.map((session) => (
					<div
						key={session.id}
						className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
					>
						<div className="flex justify-between items-start mb-4">
							<div className="flex-1">
								<div className="flex items-center gap-3 mb-2">
									<h3 className="text-xl font-semibold text-gray-900">
										{session.title}
									</h3>
									{getStatusBadge(session.status)}
								</div>
								<p className="text-gray-600 mb-2">{session.courseName}</p>
								<p className="text-gray-500 text-sm">{session.description}</p>
							</div>
							<div className="text-right">
								{session.status === "live" && (
									<button
										onClick={() => setSelectedSession(session)}
										className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
									>
										<Video className="w-4 h-4" />
										Join Live Session
									</button>
								)}
								{session.status === "scheduled" && (
									<button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
										<Calendar className="w-4 h-4" />
										Set Reminder
									</button>
								)}
								{session.status === "completed" && session.hasRecording && (
									<button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
										<Play className="w-4 h-4" />
										Watch Recording
									</button>
								)}
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
							<div className="flex items-center gap-2">
								<Calendar className="w-4 h-4 text-blue-500" />
								<span>{session.scheduledDate}</span>
							</div>
							<div className="flex items-center gap-2">
								<Clock className="w-4 h-4 text-green-500" />
								<span>
									{session.scheduledTime} ({session.duration} min)
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Users className="w-4 h-4 text-purple-500" />
								<span>{session.instructor}</span>
							</div>
						</div>

						{session.status === "live" && (
							<div className="mt-4 p-3 bg-red-50 rounded-lg">
								<p className="text-sm text-red-800">
									🔴 <strong>Live session in progress!</strong> Join now to
									participate. {session.attendees} students currently attending.
								</p>
							</div>
						)}

						{session.status === "completed" && (
							<div className="mt-4 p-3 bg-green-50 rounded-lg">
								<p className="text-sm text-green-800">
									✅ <strong>Session completed.</strong> Recording available for
									review. Attended by {session.attendees} students.
								</p>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Mode Switcher */}
				<div className="mb-6">
					<div className="bg-white rounded-lg shadow p-4">
						<div className="flex items-center justify-center gap-4">
							<span className="text-sm font-medium text-gray-700">
								View as:
							</span>
							<div className="flex bg-gray-100 rounded-lg p-1">
								<button
									onClick={() => setViewMode("admin")}
									className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
										viewMode === "admin"
											? "bg-white text-blue-600 shadow"
											: "text-gray-600 hover:text-gray-900"
									}`}
								>
									<Settings className="w-4 h-4 inline mr-2" />
									Admin
								</button>
								<button
									onClick={() => setViewMode("student")}
									className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
										viewMode === "student"
											? "bg-white text-green-600 shadow"
											: "text-gray-600 hover:text-gray-900"
									}`}
								>
									<UserGroup className="w-4 h-4 inline mr-2" />
									Student
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Main Content */}
				{viewMode === "admin" ? <AdminView /> : <StudentView />}

				{/* Live Session Modal */}
				{selectedSession && (
					<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
						<div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
							<div className="p-4 border-b border-gray-200 flex justify-between items-center">
								<h3 className="text-lg font-semibold">
									🔴 Live Session: {selectedSession.title}
								</h3>
								<button
									onClick={() => setSelectedSession(null)}
									className="text-gray-400 hover:text-gray-600"
								>
									✕
								</button>
							</div>
							<div className="p-6 text-center">
								<div className="bg-gray-900 rounded-lg p-8 mb-4">
									<Video className="w-16 h-16 text-white mx-auto mb-4 opacity-75" />
									<p className="text-white text-lg">
										Live video stream would appear here
									</p>
									<p className="text-gray-300 text-sm">
										Powered by Agora RTC SDK
									</p>
								</div>
								<div className="flex justify-center gap-4">
									<button className="bg-blue-500 text-white px-4 py-2 rounded">
										🎥 Video On
									</button>
									<button className="bg-green-500 text-white px-4 py-2 rounded">
										🎤 Audio On
									</button>
									<button className="bg-purple-500 text-white px-4 py-2 rounded">
										💬 Chat
									</button>
									<button className="bg-red-500 text-white px-4 py-2 rounded">
										🚪 Leave
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default SessionManagementDemo;
