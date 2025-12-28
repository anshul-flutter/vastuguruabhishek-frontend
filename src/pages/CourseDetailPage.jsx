import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import LoadingOverlay from "../components/common/LoadingOverlay";
import { useCourseQuery } from "../hooks/useCoursesApi";
import { useCourseEnrolledStudentsQuery } from "../hooks/useAdminApi";
import CourseMaterialsManager from "../components/AdminCourses/CourseMaterialsManager";

export default function CourseDetailPage() {
	const { courseId } = useParams();
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");

	// Fetch course details
	const {
		data: courseData,
		isLoading: isCourseLoading,
		isError: isCourseError,
	} = useCourseQuery(courseId);

	// Fetch student progress filtered by this course
	const {
		data: progressData,
		isLoading: isProgressLoading,
		isFetching: isProgressFetching,
		isError: isProgressError,
	} = useCourseEnrolledStudentsQuery(courseId);

	const course = courseData;
	const allProgress = useMemo(
		() => progressData?.progress ?? [],
		[progressData]
	);

	// Map progress entries into enriched student rows
	const enrolledStudents = useMemo(() => {
		return allProgress.map((p) => ({
			...p.student,
			progressPercent: p.progressPercent,
			videosCompleted: p.videosCompleted,
			videosTotal: p.videosTotal,
			quizzesCompleted: p.quizzesCompleted,
			quizzesTotal: p.quizzesTotal,
			status: p.status,
			lastAccessed: p.updatedAt,
		}));
	}, [allProgress]);

	// Filter students by search term
	const filteredStudents = useMemo(() => {
		const term = searchTerm.trim().toLowerCase();
		if (!term) return enrolledStudents;
		return enrolledStudents.filter((student) => {
			const haystack = [student.name, student.email, student.phone]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();
			return haystack.includes(term);
		});
	}, [enrolledStudents, searchTerm]);

	const formatDate = (dateStr) => {
		if (!dateStr) return "N/A";
		try {
			return new Date(dateStr).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		} catch {
			return "Invalid Date";
		}
	};

	const getStatusColor = (status) => {
		const normalized = status?.toLowerCase();
		if (normalized === "on track") return "text-green-600";
		if (normalized === "behind") return "text-orange-500";
		if (normalized === "ahead") return "text-blue-600";
		return "text-gray-600";
	};

	if (isCourseLoading || isProgressLoading) {
		return <LoadingOverlay fullscreen message="Loading course details..." />;
	}

	if (isCourseError || !course) {
		return (
			<div className="mt-10 text-center text-red-600">
				Error loading course details. Please try again later.
			</div>
		);
	}

	return (
		<section className="space-y-6">
			{/* Back Button & Header */}
			<div className="flex items-center gap-4">
				<button
					onClick={() => navigate("/admin/courses")}
					className="flex items-center gap-2 text-gray-600 transition-colors hover:text-[#BB0E00]"
				>
					<ArrowLeftIcon className="h-5 w-5" />
					<span className="text-sm font-medium">Back to Courses</span>
				</button>
			</div>

			{/* Course Details Card */}
			<div className="rounded-xl border border-[#E1E1E1] bg-white p-6">
				<div className="flex flex-col gap-6 md:flex-row">
					{/* Course Image */}
					<div className="md:w-1/3">
						<img
							src={course.image || "/images/AstroVastu.png"}
							alt={course.title}
							className="h-48 w-full rounded-lg object-cover"
						/>
					</div>

					{/* Course Info */}
					<div className="flex-1 space-y-4">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">
								{course.title}
							</h2>
							<p className="mt-2 text-gray-600">{course.description}</p>
						</div>

						<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
							<div>
								<p className="text-sm font-medium text-gray-500">Price</p>
								<p className="text-lg font-semibold text-gray-900">
									₹{course.price?.toLocaleString() || "0"}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-gray-500">Duration</p>
								<p className="text-lg font-semibold text-gray-900">
									{course.duration || "N/A"}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-gray-500">Level</p>
								<p className="text-lg font-semibold text-gray-900">
									{course.level || "N/A"}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-gray-500">
									Enrolled Students
								</p>
								<p className="text-lg font-semibold text-gray-900">
									{enrolledStudents.length}
								</p>
							</div>
						</div>

						<div className="flex gap-2">
							<button
								onClick={() => navigate(`/admin/courses/${courseId}/edit`)}
								className="rounded-md px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
								style={{
									background: "linear-gradient(to right, #BB0E00, #B94400)",
								}}
							>
								Edit Course
							</button>
							<button
								onClick={() =>
									navigate(`/admin/session-management?courseId=${courseId}`)
								}
								className="rounded-md px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 bg-blue-600 hover:bg-blue-700"
							>
								Manage Sessions
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Course Materials Section */}
			<CourseMaterialsManager
				courseId={courseId}
				materials={course.materials || []}
			/>

			{/* Enrolled Students Section */}
			<div className="rounded-xl border border-[#E1E1E1] bg-white p-6">
				<div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<h3 className="text-xl font-semibold text-gray-800">
						Enrolled Students ({enrolledStudents.length})
					</h3>
					<input
						type="search"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search students..."
						className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:border-[#BB0E00] focus:outline-none focus:ring-2 focus:ring-[#BB0E00]/30 md:w-64"
					/>
				</div>

				{isProgressFetching && !isProgressLoading && (
					<LoadingOverlay message="Refreshing students..." />
				)}

				{isProgressError ? (
					<p className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-700">
						Failed to load enrolled students. Please try again.
					</p>
				) : filteredStudents.length === 0 ? (
					<p className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
						{searchTerm
							? "No students found matching your search."
							: "No students enrolled in this course yet."}
					</p>
				) : (
					<div className="overflow-hidden rounded-xl border border-[#E1E1E1]">
						<table className="w-full min-w-[720px] text-sm">
							<thead className="bg-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
								<tr>
									<th className="p-3">Student</th>
									<th className="p-3">Progress</th>
									<th className="p-3">Videos</th>
									<th className="p-3">Quizzes</th>
									<th className="p-3">Status</th>
									<th className="p-3">Last Accessed</th>
									<th className="p-3 text-right">Action</th>
								</tr>
							</thead>
							<tbody>
								{filteredStudents.map((student) => (
									<tr
										key={student._id}
										className="border-t border-[#E1E1E1] text-gray-700"
									>
										<td className="p-3">
											<div className="flex flex-col">
												<span className="font-medium text-gray-900">
													{student.name}
												</span>
												<span className="text-xs text-gray-500">
													{student.email}
												</span>
											</div>
										</td>
										<td className="p-3">
											<div className="flex items-center gap-2">
												<div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
													<div
														className="h-full bg-[#BB0E00]"
														style={{
															width: `${student.progressPercent || 0}%`,
														}}
													/>
												</div>
												<span className="text-xs font-medium">
													{student.progressPercent || 0}%
												</span>
											</div>
										</td>
										<td className="p-3">
											{student.videosCompleted || 0} /{" "}
											{student.videosTotal || 0}
										</td>
										<td className="p-3">
											{student.quizzesCompleted || 0} /{" "}
											{student.quizzesTotal || 0}
										</td>
										<td
											className={`p-3 font-semibold ${getStatusColor(
												student.status
											)}`}
										>
											{student.status || "N/A"}
										</td>
										<td className="p-3">{formatDate(student.lastAccessed)}</td>
										<td className="p-3 text-right">
											<button
												type="button"
												onClick={() =>
													navigate(`/admin/student-detail/${student._id}`)
												}
												className="inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90"
												style={{
													background:
														"linear-gradient(to right, #BB0E00, #B94400)",
												}}
											>
												View
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</section>
	);
}
