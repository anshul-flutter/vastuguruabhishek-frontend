import React from "react";
import { useNavigate } from "react-router-dom";
import { useCoursesQuery } from "../../hooks/useCoursesApi";

const Courses = () => {
	const navigate = useNavigate();
	const { data: courses = [], isLoading } = useCoursesQuery();

	if (isLoading) {
		return (
			<section className="bg-white py-16">
				<div className="max-w-7xl mx-auto px-6 text-center">
					<p>Loading courses...</p>
				</div>
			</section>
		);
	}

	return (
		<>
			{" "}
			<section className="bg-white py-16">
				<div className="max-w-7xl mx-auto px-6">
					{/* Header */}
					<div className="flex justify-between items-center mb-8">
						<h2 className="text-3xl font-bold">Courses</h2>
						<a href="#" className="text-sm text-blue-600 hover:underline">
							Learn More Courses
						</a>
					</div>

					{/* Course Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
						{courses.slice(0, 6).map((i) => (
							<div
								key={i}
								className="bg-[#fbfbfb] border border-gray-200 rounded-xl p-5 text-center transform transition duration-300 hover:scale-[1.03] hover:rotate-x-[5deg] hover:rotate-y-[5deg] shadow-md hover:shadow-xl cursor-pointer"
							>
								<img
									src="/images/course.png"
									alt="Astro Vastu Course"
									className="w-full h-auto rounded-lg mb-4"
								/>
								<h3 className="text-lg font-semibold text-gray-800 mb-1">
									{i.title}
								</h3>
								<p className="text-sm text-gray-600 mb-2">{i.description}</p>
								<p className="font-bold text-[#b40f00]">₹ {i.price}/-</p>
								<button
									className="mt-4 px-4 py-2 bg-[#b40f00] text-white rounded-md hover:bg-red-700 transition"
									onClick={() => navigate(`/course/${i._id}`)}
								>
									View Details
								</button>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
};

export default Courses;
