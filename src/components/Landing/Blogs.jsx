import React, { useMemo } from "react";
import BlogCard from "../Blogs/BlogCard";
import { IoIosArrowRoundForward } from "react-icons/io";
import { LoadingSpinner, ErrorMessage, Button } from "../common";
import { useBlogsQuery } from "../../hooks/useContentApi";
import { useNavigate } from "react-router-dom";

const Blogs = () => {
	const navigate = useNavigate();
	const {
		data: blogsData = [],
		isLoading,
		error,
	} = useBlogsQuery({
		select: (data) => data.slice(0, 6), // Select only first 6 blogs to reduce processing
		staleTime: 1000 * 60 * 10, // 10 minutes cache
	});

	// Memoize the limited blogs to prevent unnecessary re-renders
	const blogs = useMemo(() => blogsData.slice(0, 3), [blogsData]);

	const handleViewAll = () => {
		navigate("/blogs");
	};

	if (isLoading) {
		return (
			<div className="px-4 sm:px-8 md:px-12 lg:px-14 py-6 sm:py-8">
				<h1 className="my-6 sm:my-8 text-xl sm:text-2xl text-center font-semibold">
					Latest Blogs
				</h1>
				<div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="animate-pulse bg-gray-200 rounded-lg h-64"
						></div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="px-4 sm:px-8 md:px-12 lg:px-14 py-6 sm:py-8">
				<h1 className="my-6 sm:my-8 text-xl sm:text-2xl text-center font-semibold">
					Latest Blogs
				</h1>
				<div className="text-center text-gray-600">
					Unable to load blogs. Please try again later.
				</div>
			</div>
		);
	}

	if (blogs.length === 0) {
		return (
			<div className="px-4 sm:px-8 md:px-12 lg:px-14 py-6 sm:py-8">
				<h1 className="my-6 sm:my-8 text-xl sm:text-2xl text-center font-semibold">
					Latest Blogs
				</h1>
				<div className="text-center text-gray-600">
					No blogs available at the moment.
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="px-4 sm:px-8 md:px-12 lg:px-14 py-6 sm:py-8">
				<h1 className="my-6 sm:my-8 text-xl sm:text-2xl text-center font-semibold">
					Latest Blogs
				</h1>

				<div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{blogs.map((blog) => (
						<BlogCard key={blog._id} blog={blog} />
					))}
				</div>

				{/* View All Button - only show if there are more than 3 blogs */}
				{blogsData.length > 3 && (
					<div className="flex items-center justify-center my-6 sm:my-8">
						<Button
							onClick={handleViewAll}
							icon={<IoIosArrowRoundForward size={24} />}
						>
							View All Blogs
						</Button>
					</div>
				)}
			</div>
		</>
	);
};

export default Blogs;
