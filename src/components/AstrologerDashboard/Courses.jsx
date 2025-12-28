import React, { useState, useMemo } from "react";
import { IoIosStar } from "react-icons/io";
import { LuClock, LuVideo } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useCoursesQuery } from "../../hooks/useCoursesApi";
import { LoadingSpinner } from "../common";

const Courses = () => {
	const [visibleCount, setVisibleCount] = useState(4);
	const navigate = useNavigate();

	const { data: coursesData, isLoading } = useCoursesQuery({
		enableToast: false,
	});
	const courses = useMemo(() => coursesData ?? [], [coursesData]);

	if (isLoading) {
		return <LoadingSpinner message="Loading courses..." />;
	}

	return (
		<>
			<h2 className="mx-[1.5rem] mt-[2rem] font-semibold text-[1.15rem]">
				Your Courses
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-3 sm:p-6 cursor-pointer">
				{courses.slice(0, visibleCount).map((course) => (
					<div
						key={course.id}
						className="flex flex-col shadow-md border border-gray-300 overflow-hidden rounded-xl bg-white hover:scale-[1.03] transition-all .3s ease-in-out"
						onClick={() => navigate(`/course/${course._id}`)}
					>
						<img
							src={course.image}
							alt={course.title}
							className="h-[200px] w-full object-cover p-[5px]"
						/>
						<h3 className="p-[.5rem] font-semibold">{course.title}</h3>
						<div className="px-2 flex items-center gap-[10px]">
							<span className="flex items-center font-semibold gap-[3px]">
								<IoIosStar className="text-yellow-500 mb-[3px]" />
								{course.rating || 5.0}
							</span>
							<span>
								{" "}
								{course.instructors?.[0]?.reviews?.length || 0} Reviews
							</span>
						</div>
						<div className="p-2 flex items-center gap-[1rem]">
							<span className="flex items-center gap-[5px]">
								<LuClock className="text-[#bb1101]" />
								<span className="text-gray-700 text-sm">
									{course.duration} Week
								</span>
							</span>
							<span className="flex items-center gap-[5px]">
								<LuVideo className="text-[#bb1101]" />
								<span className="text-gray-700 text-sm">
									{course.lessions} Lessions
								</span>
							</span>
						</div>
					</div>
				))}
			</div>
			{visibleCount < courses.length ? (
				<div className="text-center">
					<button
						onClick={() => setVisibleCount(courses.length)}
						className="mx-auto border px-4 py-2 cursor-pointer rounded-md text-white bg-gradient-to-b from-[#bf1305] to-[#f64f42] text-sm"
					>
						See More
					</button>
				</div>
			) : (
				<div className="text-center">
					<button
						onClick={() => setVisibleCount(4)}
						className="mx-auto border px-4 py-2 cursor-pointer rounded-md text-white bg-gradient-to-b from-[#bf1305] to-[#f64f42] text-sm"
					>
						See Less
					</button>
				</div>
			)}
		</>
	);
};

export default Courses;
