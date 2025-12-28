import { Link } from "react-router-dom";
import React from "react";

const BlogCard = ({ blog }) => {
	return (
		<article className="bg-white flex flex-col rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-300 h-[450px] sm:h-[500px]">
			{/* Image Block */}
			<div className="w-full flex-shrink-0">
				<img
					src={blog.mainImage || "/images/course.png"}
					alt={blog.title}
					className="h-[180px] sm:h-[200px] object-cover w-full"
				/>
			</div>

			{/* Content */}
			<div className="flex flex-col justify-between flex-1 p-4 sm:p-6">
				<div>
					<h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 line-clamp-2">
						{blog.title}
					</h3>
					<p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4 line-clamp-3">
						{blog.description.length > 100
							? blog.description.slice(0, 100) + "..."
							: blog.description}
					</p>
				</div>
				<div className="mt-auto">
					<p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
						By {blog.author} • {new Date(blog.date).toDateString()}
					</p>
					<Link
						to={`/blogs/${blog._id}`}
						className="font-semibold transition-opacity duration-300 hover:opacity-80 text-white bg-[#c02c07] px-3 py-2 sm:px-4 rounded-lg text-xs sm:text-sm text-center block"
					>
						Read More →
					</Link>
				</div>
			</div>
		</article>
	);
};

export default BlogCard;
