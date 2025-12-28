import React from "react";
import { BsPlayFill } from "react-icons/bs";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEnrolledCoursesQuery } from "../../hooks/useEnrolledCoursesApi";

const MyCourses = () => {
	const navigate = useNavigate();
	const {
		data: enrolledCourses = [],
		isLoading,
		isError,
	} = useEnrolledCoursesQuery();

	const handleViewCourse = (courseId) => {
		navigate(`/course/${courseId}`);
	};

	if (isLoading) {
		return (
			<div className="mx-[1.5rem] my-[1.5rem]">
				<h2 className="font-semibold text-[1.5rem] mb-4">My Courses</h2>
				<div className="flex justify-center items-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c02c07]"></div>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="mx-[1.5rem] my-[1.5rem]">
				<h2 className="font-semibold text-[1.5rem] mb-4">My Courses</h2>
				<div className="text-center py-12">
					<p className="text-red-600 mb-4">Failed to load your courses</p>
					<button
						onClick={() => window.location.reload()}
						className="bg-[#c02c07] text-white px-6 py-2 rounded-lg hover:bg-[#a02506]"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	if (enrolledCourses.length === 0) {
		return (
			<div className="mx-[1.5rem] my-[1.5rem]">
				<h2 className="font-semibold text-[1.5rem] mb-4">My Courses</h2>
				<div className="text-center py-12">
					<p className="text-gray-600 text-lg mb-4">
						You haven't enrolled in any courses yet
					</p>
					<button
						onClick={() => navigate("/courses")}
						className="bg-[#c02c07] text-white px-6 py-3 rounded-lg hover:bg-[#a02506]"
					>
						Browse Courses
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-[1.5rem] my-[1.5rem]">
			<div className="flex items-center justify-between mb-6">
				<h2 className="font-semibold text-[1.5rem]">My Courses</h2>
				<div className="text-sm text-gray-600">
					<span className="font-medium">{enrolledCourses.length}</span> Course
					{enrolledCourses.length !== 1 ? "s" : ""} Enrolled
				</div>
			</div>

			<div className="py-[1rem] grid grid-cols-1 gap-4">
				{enrolledCourses.map((course) => {
					const progress = course.progress || 0;
					const isCompleted = progress === 100;
					const imageUrl =
						course.image || course.coverImage || "/images/default-course.png";

					return (
						<div
							key={course._id}
							className="flex gap-4 items-center justify-between bg-white min-shadow rounded-xl p-4 w-full hover:shadow-md transition-shadow cursor-pointer"
							onClick={() => handleViewCourse(course._id)}
						>
							{/* Left Section */}
							<div className="flex items-center gap-4 flex-1">
								{/* Thumbnail */}
								<div className="w-24 h-24 flex-shrink-0">
									<img
										src={imageUrl}
										alt={course.title}
										className="w-full h-full rounded-md object-cover"
									/>
								</div>

								{/* Text Content */}
								<div className="flex-1 min-w-0">
									<h3 className="font-semibold text-gray-800 text-base line-clamp-1">
										{course.title}
									</h3>
									{course.description && (
										<p className="text-gray-500 text-sm line-clamp-2 mt-1">
											{course.description}
										</p>
									)}
									{course.createdBy && (
										<p className="text-gray-400 text-xs mt-1">
											By {course.createdBy}
										</p>
									)}

									{/* Progress Bar - Desktop */}
									<div className="hidden md:flex items-center gap-2 mt-3">
										<div className="flex-1 max-w-[400px] h-2 bg-gray-200 rounded-full overflow-hidden">
											<div
												className={`h-full transition-all ${
													isCompleted
														? "bg-green-500"
														: "bg-gradient-to-r from-[#d10000] to-[#cf6c24]"
												}`}
												style={{ width: `${progress}%` }}
											></div>
										</div>
										<span className="text-xs text-gray-600 font-medium min-w-[45px]">
											{progress}%
										</span>
										{isCompleted && (
											<FaCheckCircle className="text-green-500 w-4 h-4" />
										)}
									</div>
								</div>
							</div>

							{/* Right Section - Action Button */}
							<div className="flex flex-col items-center gap-2">
								{isCompleted ? (
									<button className="bg-green-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition flex items-center gap-2">
										<FaCheckCircle className="w-4 h-4" />
										Completed
									</button>
								) : (
									<button className="flex items-center justify-center w-[50px] h-[50px] rounded-full bg-gradient-to-br from-red-600 to-orange-500 shadow-md text-white hover:shadow-lg transition">
										<BsPlayFill size={28} />
									</button>
								)}
								{!isCompleted && (
									<div className="flex items-center gap-1 text-xs text-gray-500">
										<FaClock className="w-3 h-3" />
										<span>In Progress</span>
									</div>
								)}
							</div>

							{/* Progress Bar - Mobile */}
							<div className="md:hidden absolute bottom-2 left-4 right-4 flex items-center gap-2">
								<div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
									<div
										className={`h-full ${
											isCompleted
												? "bg-green-500"
												: "bg-gradient-to-r from-[#d10000] to-[#cf6c24]"
										}`}
										style={{ width: `${progress}%` }}
									></div>
								</div>
								<span className="text-xs text-gray-500">{progress}%</span>
							</div>
						</div>
					);
				})}
			</div>

			{/* View All Button if there are more courses */}
			{enrolledCourses.length > 5 && (
				<div className="text-center mt-6">
					<button
						onClick={() => navigate("/my-courses")}
						className="text-[#c02c07] font-medium hover:underline"
					>
						View All Courses
					</button>
				</div>
			)}
		</div>
	);
};

export default MyCourses;
