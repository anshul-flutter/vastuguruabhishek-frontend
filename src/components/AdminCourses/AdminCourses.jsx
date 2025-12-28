import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import {
	useCoursesQuery,
	useDeleteCourseMutation,
} from "../../hooks/useCoursesApi";
import LoadingOverlay from "../common/LoadingOverlay";

function AdminCourses() {
	const navigate = useNavigate();
	const {
		data: coursesData,
		isLoading,
		isFetching,
		isError,
		error,
	} = useCoursesQuery();
	const [visibleCount, setVisibleCount] = useState(6);
	const deleteCourseMutation = useDeleteCourseMutation();
	const courses = useMemo(() => coursesData ?? [], [coursesData]);
	const isMutating = deleteCourseMutation.isPending;
	const showOverlay =
		isMutating || (isFetching && !isLoading && courses.length > 0);

	if (isLoading && courses.length === 0) {
		return <LoadingOverlay fullscreen message="Loading courses..." />;
	}

	if (isError) {
		const message =
			error?.response?.data?.message ??
			error?.message ??
			"Failed to load courses.";
		return <p className="text-red-600 text-center mt-10">{message}</p>;
	}

	if (!courses.length) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 mt-10">
				<p className="text-gray-600">No courses found yet.</p>
				<button
					onClick={() => navigate("/admin/create-course")}
					className="flex h-[40px] items-center gap-[.5rem] px-[1rem] py-[2px] rounded-[5px] cursor-pointer text-white bg-gradient-to-b from-[#bf1305] to-[#f64f42]"
				>
					<FiPlus size={23} />
					Add New Course
				</button>
			</div>
		);
	}

	const visibleCourses = courses.slice(0, visibleCount);
	const hasMore = visibleCount < courses.length;

	const handleDelete = async (courseId, title) => {
		const confirmed = window.confirm(
			`Are you sure you want to delete "${title || "this course"}"?`
		);
		if (!confirmed) return;
		deleteCourseMutation.mutate(courseId);
	};

	return (
		<div className="relative">
			{showOverlay && (
				<LoadingOverlay
					message={isMutating ? "Deleting course..." : "Refreshing courses..."}
					className="rounded-xl"
				/>
			)}
			<div className="flex justify-end items-center mb-4">
				<button
					onClick={() => navigate("/admin/create-course")}
					className="flex h-[40px] items-center gap-[.5rem] px-[1rem] py-[2px] rounded-[5px] cursor-pointer text-white bg-gradient-to-b from-[#bf1305] to-[#f64f42]"
				>
					<FiPlus size={23} />
					Add New Course
				</button>
			</div>
			<section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{visibleCourses.map((course) => (
					<article
						key={course._id}
						className="flex flex-col shadow-lg border border-gray-200 overflow-hidden rounded-2xl bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
					>
						{/* Clickable Image */}
						<div
							className="cursor-pointer overflow-hidden group"
							onClick={() => navigate(`/admin/courses/${course._id}`)}
						>
							<img
								src={course.image || "/images/AstroVastu.png"}
								alt={course.title}
								className="h-[200px] w-full object-cover transition-transform duration-300 group-hover:scale-110"
							/>
						</div>

						{/* Content */}
						<div className="flex flex-col flex-grow p-4">
							<h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
								{course.title}
							</h3>
							<p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
								{course.description}
							</p>

							{/* Price Section */}
							<div className="flex items-center mb-4">
								<span className="font-bold text-2xl text-gray-900">
									₹{course.price?.toLocaleString() || "0"}
								</span>
								{course.originalPrice &&
									course.originalPrice > course.price && (
										<>
											<span className="text-gray-400 line-through text-sm ml-3">
												₹{course.originalPrice?.toLocaleString()}
											</span>
											<span className="ml-auto bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
												{Math.round(
													((course.originalPrice - course.price) /
														course.originalPrice) *
														100
												)}
												% OFF
											</span>
										</>
									)}
							</div>

							{/* Action Buttons */}
							<div className="flex items-center gap-2">
								<button
									onClick={() => navigate(`/admin/courses/${course._id}`)}
									className="flex-1 text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm"
								>
									View
								</button>
								<button
									onClick={() => navigate(`/admin/courses/${course._id}/edit`)}
									className="flex-1 text-white bg-red-600 hover:bg-red-700 px-3 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm"
								>
									Edit
								</button>
								<button
									onClick={() => handleDelete(course._id, course.title)}
									disabled={deleteCourseMutation.isPending}
									className="flex-1 text-white bg-gray-600 hover:bg-gray-700 px-3 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
								>
									{deleteCourseMutation.isPending ? "..." : "Delete"}
								</button>
							</div>
						</div>
					</article>
				))}
			</section>
			{hasMore && (
				<button
					type="button"
					onClick={() => setVisibleCount((count) => count + 6)}
					className="text-[15px] font-normal underline text-center mt-5 cursor-pointer block mx-auto"
				>
					Load More
				</button>
			)}
			<br /> <br />
		</div>
	);
}

export default AdminCourses;
