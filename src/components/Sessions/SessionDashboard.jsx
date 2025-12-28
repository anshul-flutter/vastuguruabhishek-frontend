import React, { useState } from "react";
import {
	HiCalendar as Calendar,
	HiClock as Clock,
	HiUsers as Users,
	HiVideoCamera as Video,
	HiDownload as Download,
	HiExclamationCircle as AlertCircle,
} from "react-icons/hi";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatDate, getRelativeTime } from "../../utils/dateHelpers";

const SessionDashboard = () => {
	const [filter, setFilter] = useState("all");

	// Mock data - replace with actual API calls
	const sessionStats = {
		total: 45,
		live: 2,
		scheduled: 15,
		completed: 28,
		attendanceRate: 87,
		avgDuration: 85,
	};

	const recentSessions = [
		{
			_id: "1",
			title: "Advanced Chart Reading",
			course: "Professional Astrology",
			instructor: "Dr. Rajesh Sharma",
			scheduledDate: new Date().toISOString(),
			status: "live",
			attendees: 23,
			maxAttendees: 30,
			duration: 90,
		},
		{
			_id: "2",
			title: "Vastu Fundamentals",
			course: "Vastu Shastra Course",
			instructor: "Pt. Amit Gupta",
			scheduledDate: new Date(Date.now() + 3600000).toISOString(),
			status: "scheduled",
			attendees: 0,
			maxAttendees: 25,
			duration: 120,
		},
		{
			_id: "3",
			title: "Numerology Basics",
			course: "Complete Numerology",
			instructor: "Dr. Priya Singh",
			scheduledDate: new Date(Date.now() - 7200000).toISOString(),
			status: "completed",
			attendees: 18,
			maxAttendees: 20,
			duration: 75,
			recording: true,
		},
	];

	const getStatusBadge = (status) => {
		const statusConfig = {
			live: { variant: "destructive", text: "🔴 Live" },
			scheduled: { variant: "secondary", text: "📅 Scheduled" },
			completed: { variant: "success", text: "✅ Completed" },
		};

		const config = statusConfig[status] || statusConfig.scheduled;
		return <Badge variant={config.variant}>{config.text}</Badge>;
	};

	const filteredSessions = recentSessions.filter((session) => {
		if (filter === "all") return true;
		return session.status === filter;
	});

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						Session Dashboard
					</h1>
					<p className="text-gray-600">Monitor and manage all live sessions</p>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Sessions
						</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{sessionStats.total}</div>
						<p className="text-xs text-muted-foreground">This month</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Live Now</CardTitle>
						<Video className="h-4 w-4 text-red-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">
							{sessionStats.live}
						</div>
						<p className="text-xs text-muted-foreground">Active sessions</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Attendance Rate
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{sessionStats.attendanceRate}%
						</div>
						<p className="text-xs text-muted-foreground">Average attendance</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{sessionStats.avgDuration}min
						</div>
						<p className="text-xs text-muted-foreground">Session length</p>
					</CardContent>
				</Card>
			</div>

			{/* Live Sessions Alert */}
			{sessionStats.live > 0 && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<div className="flex items-center gap-2">
						<AlertCircle className="h-5 w-5 text-red-500" />
						<h3 className="font-medium text-red-800">
							{sessionStats.live} session(s) currently live
						</h3>
					</div>
					<p className="text-sm text-red-600 mt-1">
						Monitor active sessions for any technical issues or support needs.
					</p>
				</div>
			)}

			{/* Session Filters */}
			<div className="flex gap-2">
				{["all", "live", "scheduled", "completed"].map((status) => (
					<button
						key={status}
						onClick={() => setFilter(status)}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filter === status
								? "bg-blue-100 text-blue-700 border border-blue-200"
								: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
						}`}
					>
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</button>
				))}
			</div>

			{/* Sessions List */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Sessions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{filteredSessions.map((session) => (
							<div
								key={session._id}
								className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
							>
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-2">
										<h3 className="font-semibold text-gray-900">
											{session.title}
										</h3>
										{getStatusBadge(session.status)}
									</div>
									<div className="text-sm text-gray-600 space-y-1">
										<div>Course: {session.course}</div>
										<div>Instructor: {session.instructor}</div>
										<div className="flex items-center gap-4">
											<span className="flex items-center gap-1">
												<Calendar className="h-3 w-3" />
												{formatDate(session.scheduledDate)}
											</span>
											<span className="flex items-center gap-1">
												<Clock className="h-3 w-3" />
												{session.duration} min
											</span>
											<span className="flex items-center gap-1">
												<Users className="h-3 w-3" />
												{session.attendees}/{session.maxAttendees}
											</span>
										</div>
									</div>
								</div>

								<div className="flex items-center gap-2">
									{session.status === "live" && (
										<button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
											Monitor Live
										</button>
									)}

									{session.status === "scheduled" && (
										<div className="text-sm text-blue-600 font-medium">
											Starts {getRelativeTime(session.scheduledDate)}
										</div>
									)}

									{session.status === "completed" && session.recording && (
										<button className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
											<Download className="h-3 w-3" />
											Recording
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default SessionDashboard;
