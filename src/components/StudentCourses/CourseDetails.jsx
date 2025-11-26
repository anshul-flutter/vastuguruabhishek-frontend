import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdLanguage } from "react-icons/md";
import { IoCalendarSharp } from "react-icons/io5";
import { PiSubtitlesFill } from "react-icons/pi";
import {
	HiCalendar as Calendar,
	HiClock as Clock,
	HiUsers as Users,
	HiVideoCamera as Video,
} from "react-icons/hi";
import ReviewCard from "./ReviewCard";
import WhatLearn from "./WhatLearn";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import CourseContent from "./CourseContent";
import Requirements from "./Requirements";
import Instructor from "./Instructor";
import Feedback from "./Feedback";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/slices/authSlice";
import { ROLES } from "../../utils/constants";
import { useEnrolledCoursesQuery } from "../../hooks/useEnrolledCoursesApi";
import { useCourseSessionsQuery } from "../../hooks/useSessionApi";
import { useCourseQuery } from "../../hooks/useCoursesApi";

const CourseDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const currentUser = useAppSelector(selectCurrentUser);
	const isAdmin =
		currentUser?.role === ROLES.ADMIN || currentUser?.role === ROLES.ASTROLOGER;

	// Fetch course details using React Query
	const { data: crsDetails, isLoading: loading } = useCourseQuery(id);

	// Check if user is enrolled
	const { data: enrolledCourses = [] } = useEnrolledCoursesQuery();
	const isEnrolled = enrolledCourses.some((course) => course._id === id);

	// Fetch sessions for this course (only if enrolled)
	const { data: courseSessions = [] } = useCourseSessionsQuery(id, {
		enabled: isEnrolled,
	});

	const handleJoinSession = (sessionId) => {
		// Navigate to the enhanced session page
		navigate(`/session/${sessionId}`);
	};

	if (loading) return <p className="text-center mt-10">Loading course...</p>;
	if (!crsDetails) return <p className="text-center mt-10">Course not found</p>;

	return (
		<>
			{/* Header */}
			<div className="bg-gradient-to-br from-[#BB0E00] to-[#B94400] mt-6">
				<div className="container mx-auto px-6 py-6 text-white">
					<h3 className="text-2xl font-semibold">{crsDetails.title}</h3>
					<p className="max-w-[50%]">{crsDetails.description}</p>
					<p className="text-sm text-white/80">
						Created By: {crsDetails.createdBy?.name || "Admin"}
					</p>
					<p className="mt-[1rem] flex gap-[10px] items-end">
						<span className="text-2xl font-semibold">
							₹ {crsDetails.price}.00/-
						</span>
						<span className="line-through text-white/90">
							₹ {crsDetails.originalPrice}/-
						</span>
					</p>
					<p className="text-sm">
						{crsDetails.includedInPlans &&
							"This Premium course is included in plans"}
					</p>

					<div className="text-sm flex flex-wrap items-center gap-x-[1rem]">
						{crsDetails.courseStart && (
							<span className="flex items-center gap-[5px]">
								<IoCalendarSharp /> Starts{" "}
								{new Date(crsDetails.courseStart).toLocaleDateString()}
							</span>
						)}
						<span className="flex items-center gap-[5px]">
							<MdLanguage size={18} /> {crsDetails.languages?.join(", ")}
						</span>
						<span className="flex items-center gap-[5px]">
							<PiSubtitlesFill size={18} /> {crsDetails.subtitles?.join(", ")}
						</span>
					</div>
				</div>
			</div>

			{/* Overview + Sidebar in a responsive grid */}
			<div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start my-6">
				<div className="lg:col-span-2">
					{isAdmin && (
						<div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
							Admin accounts are restricted to management actions only. Course
							enrollment and student purchases are disabled.
						</div>
					)}
					<div className="space-y-6">
						<WhatLearn crsDetails={crsDetails} />
						{/* Bring course content and requirements into the left column to avoid large whitespace */}
						<CourseContent crsDetails={crsDetails} isEnrolled={isEnrolled} />
						<Requirements crsDetails={crsDetails} />
					</div>
				</div>
				{/* Sticky sidebar on large screens; inline on small */}
				<div className="lg:col-span-1 lg:sticky lg:top-24">
					<ReviewCard crsDetails={crsDetails} disableActions={isAdmin} />
				</div>
			</div>

			<div className="container mx-auto px-6 my-6">
				<h2 className="text-[1.25rem] font-semibold">Explore Related Topics</h2>
				<div className="flex gap-[1rem] my-[1rem]">
					{crsDetails.relatedTopics?.map((item, i) => (
						<span
							key={i}
							className="bg-gray-200 px-[10px] py-[5px] rounded-md text-gray-800 text-sm"
						>
							{item}
						</span>
					))}
				</div>
			</div>

			<div className="container mx-auto px-6 my-6">
				<h2 className="font-semibold text-[1.25rem] mb-[.75rem]">
					This Course Includes
				</h2>
				<ul className="grid grid-cols-2 gap-x-[2rem]">
					{crsDetails.courseIncludes?.map((item, i) => (
						<li key={i} className="flex items-center gap-[10px]">
							<IoMdCheckmarkCircleOutline
								className="text-[#BB0E00]"
								size={20}
							/>
							<span className="text-gray-800">{item}</span>
						</li>
					))}
				</ul>
			</div>

			{/* Live Sessions Section - Only for enrolled students */}
			{isEnrolled && (
				<div className="container mx-auto px-6 my-6">
					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-[1.25rem] font-semibold text-gray-900">
								Live Sessions
							</h2>
							<div className="flex gap-2">
								<button
									onClick={() => navigate(`/course/${id}/sessions`)}
									className="text-blue-600 hover:text-blue-800 text-sm font-medium"
								>
									View Course Sessions →
								</button>
								<span className="text-gray-300">|</span>
								<button
									onClick={() => navigate("/my-sessions")}
									className="text-blue-600 hover:text-blue-800 text-sm font-medium"
								>
									All My Sessions
								</button>
							</div>
						</div>

						{/* Sort: live first, then upcoming soonest, then latest completed */}
						{(() => {
							const now = new Date();
							const live = courseSessions.filter((s) => s.status === "live");
							const upcoming = courseSessions
								.filter(
									(s) =>
										s.status === "scheduled" && new Date(s.scheduledDate) >= now
								)
								.sort(
									(a, b) =>
										new Date(a.scheduledDate) - new Date(b.scheduledDate)
								);
							const completed = courseSessions
								.filter((s) => s.status === "completed")
								.sort(
									(a, b) =>
										new Date(b.scheduledDate) - new Date(a.scheduledDate)
								);
							const topThree = [...live, ...upcoming, ...completed].slice(0, 3);
							return (
								<div className="space-y-3">
									{topThree.map((session) => (
										<div
											key={session._id}
											className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
										>
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-2">
													<h3 className="font-medium text-gray-900">
														Session {session.sessionNumber}: {session.title}
													</h3>
													<span
														className={`px-2 py-1 rounded-full text-xs font-medium ${
															session.status === "live"
																? "bg-red-100 text-red-800 animate-pulse"
																: session.status === "scheduled"
																? "bg-blue-100 text-blue-800"
																: "bg-green-100 text-green-800"
														}`}
													>
														{session.status === "live"
															? "🔴 Live Now"
															: session.status === "scheduled"
															? "📅 Upcoming"
															: "✅ Completed"}
													</span>
												</div>
												<div className="flex items-center gap-4 text-sm text-gray-600">
													<span className="flex items-center gap-1">
														<Calendar className="w-4 h-4" />
														{new Date(
															session.scheduledDate
														).toLocaleDateString()}
													</span>
													<span className="flex items-center gap-1">
														<Clock className="w-4 h-4" />
														{session.scheduledTime} ({session.duration}m)
													</span>
													{session.status === "live" && (
														<span className="flex items-center gap-1">
															<Users className="w-4 h-4" />
															{session.attendees} attending
														</span>
													)}
												</div>
											</div>

											<div className="flex gap-2">
												{session.status === "live" && (
													<button
														onClick={() => handleJoinSession(session._id)}
														className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 animate-pulse"
													>
														<Video className="w-4 h-4" />
														Join Live
													</button>
												)}
												{session.status === "scheduled" && (
													<button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed">
														Not Started
													</button>
												)}
												{session.status === "completed" &&
													session.recording?.recordingUrl && (
														<button
															onClick={() =>
																window.open(session.recording.recordingUrl)
															}
															className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
														>
															Watch Recording
														</button>
													)}
											</div>
										</div>
									))}
								</div>
							);
						})()}

						{courseSessions.length === 0 && (
							<div className="text-center py-8">
								<Video className="mx-auto h-12 w-12 text-gray-400 mb-3" />
								<p className="text-gray-500">No sessions scheduled yet</p>
								<p className="text-sm text-gray-400">
									Check back later for live sessions
								</p>
							</div>
						)}
					</div>
				</div>
			)}

			<div className="max-w-[600px] m-[1.5rem]">
				<h2 className="text-[1.25rem] font-semibold">Description</h2>
				<p>{crsDetails.detailedDescription}</p>
			</div>

			<Instructor instructor={crsDetails.createdBy} />
		</>
	);
};

export default CourseDetails;
