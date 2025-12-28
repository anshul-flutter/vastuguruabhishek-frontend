import React, { useState, useMemo } from "react";
import { IoIosStar } from "react-icons/io";
import { LuClock, LuVideo } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useCoursesQuery } from "../../hooks/useCoursesApi";
import { LoadingSpinner, ErrorMessage } from "../common";

const Courses = ({ enrolledCourses = null, showMyCoursesLink = false }) => {
	const [visibleCount, setVisibleCount] = useState(4);
	const navigate = useNavigate();

	// Use enrolled courses if provided, otherwise fetch all courses
	const shouldFetchAllCourses = !enrolledCourses;

	const {
		data: coursesData,
		isLoading,
		isError,
		error,
		refetch,
	} = useCoursesQuery({
		enableToast: false,
		enabled: shouldFetchAllCourses,
	});

	// Use enrolled courses or fetched courses
	const courses = useMemo(() => {
		if (enrolledCourses) return enrolledCourses;
		return coursesData ?? [];
	}, [enrolledCourses, coursesData]);

	// Ensure we show at least some courses initially when they're available
	const effectiveVisibleCount =
		courses.length > 0
			? Math.max(visibleCount, Math.min(4, courses.length))
			: 0;

	if (shouldFetchAllCourses && isLoading) {
		return <LoadingSpinner message="Loading courses..." />;
	}

	if (shouldFetchAllCourses && isError) {
		const errorMessage =
			error?.response?.data?.message ??
			error?.message ??
			"Failed to fetch courses. Please try again.";
		return <ErrorMessage message={errorMessage} onRetry={refetch} />;
	}

	// Show message when no courses are available
	if (courses.length === 0) {
		return (
			<div className="mx-[1.5rem] mt-[2rem]">
				<h2 className="font-semibold text-[1.15rem] mb-4">
					{enrolledCourses ? "Your Recent Courses" : "Your Courses"}
				</h2>
				<div className="text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
					<p className="text-gray-500 text-lg">
						{enrolledCourses
							? "You haven't enrolled in any courses yet."
							: "No courses available at the moment."}
					</p>
					<p className="text-gray-400 text-sm mt-2">
						{enrolledCourses
							? "Explore our course catalog to get started!"
							: "Check back later for new content!"}
					</p>
					<button
						onClick={() => navigate("/courses")}
						className="mt-4 px-4 py-2 bg-gradient-to-b from-[#bf1305] to-[#f64f42] text-white rounded-md hover:opacity-90 transition-opacity"
					>
						{enrolledCourses ? "Browse Courses" : "Explore Courses"}
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			<h2 className="mx-[1.5rem] mt-[2rem] font-semibold text-[1.15rem]">
				{enrolledCourses ? "Your Recent Courses" : "Your Courses"}
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-3 sm:p-6 cursor-pointer">
				{courses.slice(0, effectiveVisibleCount).map((course) => (
					<div
						key={course.id || course._id}
						className="flex flex-col shadow-md border border-gray-300 overflow-hidden rounded-xl bg-white hover:scale-[1.03] transition-all .3s ease-in-out"
						onClick={() => navigate(`/course/${course._id}`)}
					>
						<img
							src={
								course.image ||
								course.coverImage ||
								"/images/default-course.png"
							}
							alt={course.title}
							className="h-[200px] w-full object-cover p-[5px]"
						/>
						<h3 className="p-[.5rem] font-semibold line-clamp-2">
							{course.title}
						</h3>
						<div className="px-2 flex items-center gap-[10px]">
							<span className="flex items-center font-semibold gap-[3px]">
								<IoIosStar className="text-yellow-500 mb-[3px]" />
								{course.rating || 5.0}
							</span>
							<span className="text-sm text-gray-600">
								{course.instructors?.[0]?.reviews?.length || 0} Reviews
							</span>
						</div>
						<div className="p-2 flex items-center gap-[1rem]">
							<span className="flex items-center gap-[5px]">
								<LuClock className="text-[#bb1101]" />
								<span className="text-gray-700 text-sm">
									{course.duration} Week{course.duration !== 1 ? "s" : ""}
								</span>
							</span>
							<span className="flex items-center gap-[5px]">
								<LuVideo className="text-[#bb1101]" />
								<span className="text-gray-700 text-sm">
									{course.lessions || course.lessons || 0} Lessons
								</span>
							</span>
						</div>
						{/* Show progress for enrolled courses */}
						{enrolledCourses && course.progress !== undefined && (
							<div className="px-2 pb-2">
								<div className="flex justify-between text-xs text-gray-600 mb-1">
									<span>Progress</span>
									<span>{course.progress}%</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div
										className={`h-2 rounded-full transition-all duration-300 ${
											course.progress === 100
												? "bg-green-500"
												: "bg-gradient-to-r from-[#bf1305] to-[#f64f42]"
										}`}
										style={{ width: `${course.progress}%` }}
									></div>
								</div>
							</div>
						)}
					</div>
				))}
			</div>

			{/* Show more/less buttons only if not using enrolled courses or if there are more courses */}
			{!enrolledCourses && (
				<>
					{visibleCount < courses.length ? (
						<div className="text-center">
							<button
								onClick={() => setVisibleCount(courses.length)}
								className="mx-auto border px-4 py-2 cursor-pointer rounded-md text-white bg-gradient-to-b from-[#bf1305] to-[#f64f42] text-sm hover:opacity-90 transition-opacity"
							>
								See More
							</button>
						</div>
					) : courses.length > 4 ? (
						<div className="text-center">
							<button
								onClick={() => setVisibleCount(4)}
								className="mx-auto border px-4 py-2 cursor-pointer rounded-md text-white bg-gradient-to-b from-[#bf1305] to-[#f64f42] text-sm hover:opacity-90 transition-opacity"
							>
								See Less
							</button>
						</div>
					) : null}
				</>
			)}

			{/* View All Courses link for enrolled courses */}
			{enrolledCourses && showMyCoursesLink && (
				<div className="text-center pb-4">
					<button
						onClick={() => navigate("/my-courses")}
						className="text-[#bb1201] hover:underline font-semibold"
					>
						View All My Courses →
					</button>
				</div>
			)}
		</>
	);
};

export default Courses;
