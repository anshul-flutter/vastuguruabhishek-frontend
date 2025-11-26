import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../components/ui/tabs";
import CourseSessions from "../components/Sessions/CourseSessions";
import CourseMaterialsList from "../components/Sessions/CourseMaterialsList";
import { useCourseQuery } from "../hooks/useCoursesApi";
import { useCourseSessionsQuery } from "../hooks/useSessionApi";
import { useStudentProgressQuery } from "../hooks/useStudentApi";
import { LoadingSpinner, ErrorMessage } from "../components/common";
import { HiArrowLeft } from "react-icons/hi";

const CourseSessionsPage = () => {
	const { courseId } = useParams();
	const navigate = useNavigate();

	// Fetch course details
	const {
		data: courseData,
		isLoading: isCourseLoading,
		isError: isCourseError,
		error: courseError,
	} = useCourseQuery(courseId);

	// Fetch student progress for this course
	const {
		data: progressData,
		isLoading: isProgressLoading,
		isError: isProgressError,
		error: progressError,
	} = useStudentProgressQuery(courseId);

	// Fetch sessions for this course (used in CourseSessions component)
	const { isLoading: isSessionsLoading } = useCourseSessionsQuery(courseId);

	const isLoading = isCourseLoading || isProgressLoading || isSessionsLoading;
	const isError = isCourseError || isProgressError;
	const error = courseError || progressError;

	// Calculate session progress from actual data
	const sessionProgress = useMemo(() => {
		if (!progressData?.sessionProgress) {
			return {
				totalSessions: 0,
				attendedSessions: 0,
				attendancePercentage: 0,
			};
		}
		return progressData.sessionProgress;
	}, [progressData]);

	// Calculate overall progress percentage
	const overallProgress = useMemo(() => {
		return progressData?.progressPercent || 0;
	}, [progressData]);

	if (isLoading) {
		return <LoadingSpinner message="Loading course details..." />;
	}

	if (isError) {
		const errorMessage =
			error?.response?.data?.message ??
			error?.message ??
			"Failed to load course data.";
		return (
			<ErrorMessage
				message={errorMessage}
				onRetry={() => navigate("/my-courses")}
			/>
		);
	}

	if (!courseData) {
		return (
			<ErrorMessage
				message="Course not found"
				onRetry={() => navigate("/my-courses")}
			/>
		);
	}

	const course = courseData;

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Course Header */}
			<div className="bg-white shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="mb-4">
						<button
							onClick={() => navigate("/my-courses")}
							className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
						>
							<HiArrowLeft className="w-5 h-5" />
							<span>Back to My Courses</span>
						</button>
					</div>
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<h1 className="text-3xl font-bold text-gray-900 mb-2">
								{course.title}
							</h1>
							<p className="text-gray-600 mb-4">{course.description}</p>
							<div className="flex items-center gap-6 text-sm text-gray-600 flex-wrap">
								<span>
									Instructor:{" "}
									{course.instructor?.name ||
										course.createdBy?.name ||
										"Unknown Instructor"}
								</span>
								<span>
									Sessions: {sessionProgress.attendedSessions}/
									{sessionProgress.totalSessions}
								</span>
								<span>
									Attendance: {Math.round(sessionProgress.attendancePercentage)}
									%
								</span>
							</div>
						</div>

						<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 shadow-sm border border-blue-200 min-w-[140px]">
							<div className="text-center">
								<div className="text-3xl font-bold text-blue-600 mb-1">
									{overallProgress}%
								</div>
								<div className="text-sm text-blue-700 font-medium">
									Course Progress
								</div>
								<div className="w-full bg-blue-200 rounded-full h-2 mt-3">
									<div
										className={`h-2 rounded-full transition-all duration-300 ${
											overallProgress === 100 ? "bg-green-500" : "bg-blue-600"
										}`}
										style={{ width: `${overallProgress}%` }}
									></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Course Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Tabs defaultValue="sessions" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="sessions">Live Sessions</TabsTrigger>
						<TabsTrigger value="materials">Course Materials</TabsTrigger>
						<TabsTrigger value="progress">My Progress</TabsTrigger>
					</TabsList>

					<TabsContent value="sessions" className="space-y-6">
						<CourseSessions courseId={courseId} courseName={course.title} />
					</TabsContent>

					<TabsContent value="materials" className="space-y-6">
						<CourseMaterialsList materials={course.materials || []} />
					</TabsContent>

					<TabsContent value="progress" className="space-y-6">
						<div className="bg-white rounded-lg shadow p-6">
							<h3 className="text-lg font-semibold mb-4">Learning Progress</h3>
							<div className="space-y-6">
								{/* Overall Course Progress */}
								<div>
									<div className="flex justify-between mb-2">
										<span className="text-sm font-medium text-gray-700">
											Overall Course Progress
										</span>
										<span className="text-sm font-bold text-blue-600">
											{overallProgress}%
										</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-3">
										<div
											className={`h-3 rounded-full transition-all duration-300 ${
												overallProgress === 100
													? "bg-green-500"
													: "bg-gradient-to-r from-blue-500 to-blue-600"
											}`}
											style={{ width: `${overallProgress}%` }}
										></div>
									</div>
									<p className="text-xs text-gray-500 mt-2">
										Based on session attendance and course completion
									</p>
								</div>

								{/* Session Attendance Progress */}
								<div className="border-t pt-4">
									<div className="flex justify-between mb-2">
										<span className="text-sm font-medium text-gray-700">
											Session Attendance
										</span>
										<span className="text-sm font-medium">
											{sessionProgress.attendedSessions}/
											{sessionProgress.totalSessions} Sessions
										</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-3">
										<div
											className="bg-purple-500 h-3 rounded-full transition-all duration-300"
											style={{
												width: `${sessionProgress.attendancePercentage}%`,
											}}
										></div>
									</div>
								</div>

								{/* Progress Stats Grid */}
								<div className="grid grid-cols-3 gap-4 mt-6">
									<div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
										<div className="text-2xl font-bold text-green-600">
											{sessionProgress.attendedSessions}
										</div>
										<div className="text-xs text-green-600 font-medium mt-1">
											Sessions Attended
										</div>
									</div>
									<div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
										<div className="text-2xl font-bold text-blue-600">
											{sessionProgress.totalSessions -
												sessionProgress.attendedSessions}
										</div>
										<div className="text-xs text-blue-600 font-medium mt-1">
											Sessions Remaining
										</div>
									</div>
									<div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
										<div className="text-2xl font-bold text-purple-600">
											{Math.round(sessionProgress.attendancePercentage)}%
										</div>
										<div className="text-xs text-purple-600 font-medium mt-1">
											Attendance Rate
										</div>
									</div>
								</div>

								{/* Status Badge */}
								<div className="mt-4 p-4 bg-gray-50 rounded-lg">
									<div className="flex items-center justify-between">
										<div>
											<span className="text-sm text-gray-600">Status: </span>
											<span
												className={`font-semibold ${
													progressData?.status === "Completed"
														? "text-green-600"
														: progressData?.status === "On Track"
														? "text-blue-600"
														: "text-orange-600"
												}`}
											>
												{progressData?.status || "In Progress"}
											</span>
										</div>
										{overallProgress === 100 && (
											<span className="text-green-600 font-medium text-sm flex items-center gap-1">
												🎉 Course Completed!
											</span>
										)}
									</div>
								</div>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default CourseSessionsPage;
