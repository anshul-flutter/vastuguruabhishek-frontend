import React from "react";
import { FaClipboardCheck, FaGraduationCap, FaRegClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import StatsChart from "./StatsChart";
import UpcomingSessions from "./UpcomingSessions";
import { BsThreeDotsVertical } from "react-icons/bs";
import Courses from "./Courses";
import { useStudentDashboardQuery } from "../../hooks/useStudentApi";
import { useEnrolledCoursesQuery } from "../../hooks/useEnrolledCoursesApi";
import { LoadingSpinner, ErrorMessage } from "../common";

const StudentDashboard = () => {
	const navigate = useNavigate();

	const {
		data: dashboardData,
		isLoading: isDashboardLoading,
		isError: isDashboardError,
		error: dashboardError,
		refetch: refetchDashboard,
	} = useStudentDashboardQuery({
		enableToast: false,
	});

	// Get enrolled courses for real stats
	const {
		data: enrolledCourses = [],
		isLoading: isCoursesLoading,
		isError: isCoursesError,
		error: coursesError,
		refetch: refetchCourses,
	} = useEnrolledCoursesQuery();

	const isLoading = isDashboardLoading || isCoursesLoading;
	const isError = isDashboardError || isCoursesError;
	const error = dashboardError || coursesError;

	if (isLoading) {
		return <LoadingSpinner message="Loading dashboard..." />;
	}

	if (isError) {
		const errorMessage =
			error?.response?.data?.message ??
			error?.message ??
			"Failed to load dashboard data.";
		return (
			<ErrorMessage
				message={errorMessage}
				onRetry={() => {
					refetchDashboard();
					refetchCourses();
				}}
			/>
		);
	}

	// Calculate real course stats from enrolled courses
	const totalCourses = enrolledCourses.length;
	const ongoingCourses = enrolledCourses.filter((course) => {
		const progress = course.progress || 0;
		return progress > 0 && progress < 100;
	}).length;
	const completedCourses = enrolledCourses.filter((course) => {
		const progress = course.progress || 0;
		return progress === 100;
	}).length;

	const courseStats = [
		{
			id: 1,
			title: "Total Courses",
			count: totalCourses,
			label: totalCourses === 1 ? "Course" : "Courses",
			icon: <FaGraduationCap className="text-[#bb1201]" size={"2.75rem"} />,
			actionText: "Browse more",
			actionLink: "/courses",
			myCoursesLink: "/my-courses",
			bgColor: "bg-red-100",
		},
		{
			id: 2,
			title: "Ongoing Courses",
			count: ongoingCourses,
			label: ongoingCourses === 1 ? "Course" : "Courses",
			icon: <FaRegClock className="text-[#bb1201]" size={"2.75rem"} />,
			actionText: "Continue learning",
			actionLink: "/my-courses",
			bgColor: "bg-red-100",
		},
		{
			id: 3,
			title: "Completed Courses",
			count: completedCourses,
			label: completedCourses === 1 ? "Course" : "Courses",
			icon: <FaClipboardCheck className="text-[#bb1201]" size={"2.75rem"} />,
			actionText: "View certificates",
			actionLink: "/my-courses",
			bgColor: "bg-red-100",
		},
	];
	return (
		<>
			<div className="mx-[1.5rem] my-[1rem]">
				<h2 className="font-semibold text-[1.25rem] mb-[1rem]">Overview</h2>

				<div className="flex gap-[2rem] max-[1000px]:flex-col">
					<div className="flex flex-col gap-[1rem]">
						<div className="flex items-center gap-x-[2rem] gap-y-[1rem] flex-wrap">
							{courseStats.map((item) => (
								<div
									key={item.id}
									className="flex items-center border border-gray-300 rounded-xl gap-[1rem] p-4 flex-1 bg-[#fbfbfb] whitespace-nowrap"
								>
									<span className="flex items-center justify-center h-[100px] w-[100px] rounded-lg bg-[#ffd7d4]">
										{item.icon}
									</span>
									<div className="">
										<p className="text-sm text-gray-600">{item.title}</p>
										<p className="font-semibold text-gray-800 text-[1.25rem]">
											{item.count} {item.label.toLowerCase()}
										</p>
										{item.count > 0 ? (
											<button
												className="text-[#bb1201] cursor-pointer font-semibold text-sm hover:underline"
												onClick={() => navigate(item.actionLink)}
											>
												{item.actionText}
											</button>
										) : (
											<div className="flex flex-col gap-1">
												<span className="text-gray-400 text-sm">
													{item.id === 1
														? "No courses yet"
														: "Nothing here yet"}
												</span>
												{item.id === 1 && (
													<button
														className="text-[#bb1201] cursor-pointer font-semibold text-sm hover:underline"
														onClick={() => navigate("/courses")}
													>
														Browse courses
													</button>
												)}
											</div>
										)}
									</div>
								</div>
							))}
						</div>
						<div className="">
							<div className="flex justify-between items-center mb-[1rem]">
								<h2 className="font-semibold text-gray-800 text-[1.15rem]">
									Activity Graph
								</h2>
								<BsThreeDotsVertical />
							</div>
							<StatsChart activityData={dashboardData?.activityData} />
						</div>
					</div>
					<UpcomingSessions recentBookings={dashboardData?.recentOrders} />
				</div>
			</div>
			<Courses
				enrolledCourses={enrolledCourses.slice(0, 4)}
				showMyCoursesLink={totalCourses > 4}
			/>
		</>
	);
};

export default StudentDashboard;
