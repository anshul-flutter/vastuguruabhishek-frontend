import React from "react";
import PropTypes from "prop-types";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import BaseCard from "../BaseCard";

/**
 * BlogCard - Reusable card component for displaying blogs
 * Supports admin mode (edit/delete) and user mode (read more)
 */
const BlogCard = ({
	blog,
	onEdit,
	onDelete,
	isDeleting = false,
	isAdmin = false,
}) => {
	const truncateText = (text, length = 100) => {
		if (!text) return "";
		return text.length > length ? text.substring(0, length) + "..." : text;
	};

	const handleEdit = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (onEdit) {
			onEdit(blog);
		}
	};

	const handleDelete = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (onDelete) {
			onDelete(blog._id || blog.id);
		}
	};

	return (
		<BaseCard className="flex flex-col h-[450px] sm:h-[500px]">
			{/* Blog Image */}
			<div className="w-full flex-shrink-0">
				<img
					src={blog.mainImage || "/images/course.png"}
					alt={blog.title}
					className="h-[180px] sm:h-[200px] object-cover w-full"
				/>
			</div>

			{/* Blog Content */}
			<div className="flex flex-col justify-between flex-1 p-4 sm:p-6">
				<div>
					<h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 line-clamp-2">
						{blog.title}
					</h3>
					<p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4 line-clamp-3">
						{truncateText(blog.description)}
					</p>
				</div>

				<div className="mt-auto">
					<p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
						By {blog.author} • {new Date(blog.date).toDateString()}
					</p>

					{isAdmin ? (
						<div className="flex gap-2">
							<button
								onClick={handleEdit}
								className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
							>
								<FaEdit />
								Edit
							</button>
							<button
								onClick={handleDelete}
								disabled={isDeleting}
								className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
							>
								<FaTrash />
								{isDeleting ? "Deleting..." : "Delete"}
							</button>
						</div>
					) : (
						<Link
							to={`/blogs/${blog._id}`}
							className="font-semibold transition-opacity duration-300 hover:opacity-80 text-white bg-red-600 px-3 py-2 sm:px-4 rounded-lg text-xs sm:text-sm text-center block"
						>
							Read More →
						</Link>
					)}
				</div>
			</div>
		</BaseCard>
	);
};

BlogCard.propTypes = {
	blog: PropTypes.shape({
		_id: PropTypes.string,
		id: PropTypes.string,
		title: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
		mainImage: PropTypes.string,
		author: PropTypes.string.isRequired,
		date: PropTypes.string.isRequired,
	}).isRequired,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
	isDeleting: PropTypes.bool,
	isAdmin: PropTypes.bool,
};

export default BlogCard;
