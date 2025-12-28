import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import { useDeleteBlogMutation } from "../../hooks/useContentApi";
import { getYouTubeEmbedUrl } from "../../utils/youtubeHelpers";
import BlogFormModal from "./BlogFormModal";

function BlogDetails() {
	const { blogId } = useParams();
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Fetch blog details
	const {
		data: blog,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["blog", blogId],
		queryFn: async () => {
			const response = await apiClient.get(`/blogs/${blogId}`);
			return response.data?.data;
		},
		enabled: !!blogId,
	});

	const deleteMutation = useDeleteBlogMutation({
		onSuccess: () => {
			navigate("/admin/blog-management");
		},
	});

	const handleEdit = () => {
		setIsModalOpen(true);
	};

	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this blog?")) {
			deleteMutation.mutate(blogId);
		}
	};

	const handleBack = () => {
		navigate("/admin/blog-management");
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BB0E00]"></div>
			</div>
		);
	}

	if (error || !blog) {
		return (
			<div className="flex flex-col justify-center items-center min-h-[400px]">
				<p className="text-red-600 mb-4">Blog not found</p>
				<button
					onClick={handleBack}
					className="px-6 py-2 bg-[#BB0E00] text-white rounded-lg hover:bg-[#A00D00] transition-colors"
				>
					Back to Blogs
				</button>
			</div>
		);
	}

	return (
		<div className="p-4 sm:p-6 max-w-5xl mx-auto">
			{/* Header */}
			<div className="flex justify-between items-start mb-6">
				<button
					onClick={handleBack}
					className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
				>
					← Back to Blogs
				</button>
				<div className="flex gap-2">
					<button
						onClick={handleEdit}
						className="px-6 py-2 bg-[#BB0E00] text-white rounded-lg hover:bg-[#A00D00] transition-colors font-semibold"
					>
						Edit
					</button>
					<button
						onClick={handleDelete}
						disabled={deleteMutation.isPending}
						className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold disabled:opacity-50"
					>
						{deleteMutation.isPending ? "Deleting..." : "Delete"}
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg shadow-lg overflow-hidden">
				{/* Main Image */}
				{blog.mainImage && (
					<div className="w-full h-96 bg-gray-200">
						<img
							src={blog.mainImage}
							alt={blog.title}
							className="w-full h-full object-cover"
						/>
					</div>
				)}

				{/* Blog Info */}
				<div className="p-8">
					{/* Title */}
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						{blog.title}
					</h1>

					{/* Meta Information */}
					<div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
						{blog.author && (
							<div className="flex items-center gap-2">
								<span className="font-semibold">Author:</span>
								<span>{blog.author}</span>
							</div>
						)}
						{blog.date && (
							<div className="flex items-center gap-2">
								<span className="font-semibold">Published:</span>
								<span>
									{new Date(blog.date).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</span>
							</div>
						)}
					</div>

					{/* Tags */}
					{blog.tags && blog.tags.length > 0 && (
						<div className="flex flex-wrap gap-2 mb-6">
							{blog.tags.map((tag, index) => (
								<span
									key={index}
									className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
								>
									#{tag}
								</span>
							))}
						</div>
					)}

					{/* Description */}
					<div className="prose max-w-none">
						<p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
							{blog.description}
						</p>
					</div>

					{/* YouTube Video (if available) */}
					{blog.videoUrl && (
						<div className="mt-8 mb-8">
							<div className="w-full aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg">
								{(() => {
									const embedUrl = getYouTubeEmbedUrl(blog.videoUrl);
									return embedUrl && embedUrl.includes("youtube.com") ? (
										<iframe
											src={embedUrl}
											title="Blog Video"
											className="w-full h-full"
											frameBorder="0"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowFullScreen
										></iframe>
									) : (
										<div className="w-full h-full flex items-center justify-center text-white">
											<p>Video unavailable</p>
										</div>
									);
								})()}
							</div>
						</div>
					)}

					{/* Sections */}
					{blog.sections && blog.sections.length > 0 && (
						<div className="mt-8 space-y-8">
							<hr className="border-gray-200" />
							<h2 className="text-2xl font-bold text-gray-900">
								Content Sections
							</h2>
							{blog.sections.map((section, index) => (
								<div key={index} className="space-y-4">
									<h3 className="text-xl font-semibold text-gray-800">
										{section.subheading}
									</h3>
									<p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
										{section.text}
									</p>
									{section.image && section.image.length > 0 && (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{section.image.map((img, imgIndex) => (
												<img
													key={imgIndex}
													src={img}
													alt={`Section ${index + 1} - Image ${imgIndex + 1}`}
													className="w-full h-64 object-cover rounded-lg"
												/>
											))}
										</div>
									)}
								</div>
							))}
						</div>
					)}

					{/* Timestamps */}
					<div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
						<div className="flex flex-wrap gap-4">
							{blog.createdAt && (
								<span>
									Created: {new Date(blog.createdAt).toLocaleString()}
								</span>
							)}
							{blog.updatedAt && (
								<span>
									Last Updated: {new Date(blog.updatedAt).toLocaleString()}
								</span>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Edit Modal */}
			<BlogFormModal
				blog={blog}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	);
}

export default BlogDetails;
