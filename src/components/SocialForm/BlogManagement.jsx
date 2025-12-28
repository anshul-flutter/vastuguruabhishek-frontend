// Blog Management Page - Displays blog list with CRUD operations
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useBlogsQuery } from "../../hooks/useContentApi";
import BlogFormModal from "./BlogFormModal";

function BlogManagement() {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingBlog, setEditingBlog] = useState(null);

	const { data: blogs = [], isLoading, error } = useBlogsQuery();

	console.log("Blogs data:", blogs);

	const filteredBlogs = blogs.filter((blog) =>
		blog.title?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleAddBlog = () => {
		setEditingBlog(null);
		setIsModalOpen(true);
	};

	const handleEditBlog = (blog, e) => {
		e.stopPropagation();
		setEditingBlog(blog);
		setIsModalOpen(true);
	};

	const handleViewBlog = (blogId) => {
		navigate(`/admin/blog-details/${blogId}`);
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BB0E00]"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<p className="text-red-600">Error loading blogs. Please try again.</p>
			</div>
		);
	}

	return (
		<div className="p-4 sm:p-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
				<button
					onClick={handleAddBlog}
					className="px-6 py-2 bg-[#BB0E00] text-white rounded-lg hover:bg-[#A00D00] transition-colors font-semibold"
				>
					Add New Blog
				</button>
			</div>

			{/* Search Bar */}
			<div className="mb-6">
				<input
					type="text"
					placeholder="Search blogs by title..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB0E00] focus:border-transparent"
				/>
			</div>

			{/* Blog List */}
			{filteredBlogs.length === 0 ? (
				<div className="text-center py-12 bg-gray-50 rounded-lg">
					<p className="text-gray-500 mb-4">No blogs found</p>
					<button
						onClick={handleAddBlog}
						className="px-6 py-2 bg-[#BB0E00] text-white rounded-lg hover:bg-[#A00D00] transition-colors"
					>
						Add your first blog
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredBlogs.map((blog) => (
						<div
							key={blog._id}
							className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
							onClick={() => handleViewBlog(blog._id)}
						>
							{/* Blog Image */}
							{blog.mainImage && (
								<div className="h-48 bg-gray-200 overflow-hidden">
									<img
										src={blog.mainImage}
										alt={blog.title}
										className="w-full h-full object-cover"
									/>
								</div>
							)}

							{/* Blog Content */}
							<div className="p-4">
								<h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
									{blog.title}
								</h3>
								{blog.author && (
									<p className="text-sm text-gray-600 mb-2 line-clamp-1">
										By {blog.author}
									</p>
								)}
								<p className="text-sm text-gray-600 mb-4 line-clamp-3">
									{blog.description}
								</p>
								{/* Date */}
								{blog.date && (
									<p className="text-xs text-gray-500 mb-2">
										{new Date(blog.date).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</p>
								)}
								{/* Tags */}
								{blog.tags && blog.tags.length > 0 && (
									<div className="flex flex-wrap gap-2 mb-4">
										{blog.tags.slice(0, 3).map((tag, index) => (
											<span
												key={index}
												className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
											>
												{tag}
											</span>
										))}
										{blog.tags.length > 3 && (
											<span className="text-xs px-2 py-1 text-gray-500">
												+{blog.tags.length - 3} more
											</span>
										)}
									</div>
								)}{" "}
								{/* Action Buttons */}
								<div className="flex gap-2 pt-2 border-t">
									<button
										onClick={() => handleViewBlog(blog._id)}
										className="flex-1 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
									>
										View
									</button>
									<button
										onClick={(e) => handleEditBlog(blog, e)}
										className="flex-1 px-4 py-2 text-sm bg-[#BB0E00] text-white rounded hover:bg-[#A00D00] transition-colors"
									>
										Edit
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Blog Form Modal */}
			<BlogFormModal
				blog={editingBlog}
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setEditingBlog(null);
				}}
			/>
		</div>
	);
}

export default BlogManagement;
