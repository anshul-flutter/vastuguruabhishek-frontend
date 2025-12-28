import { useState, useEffect } from "react";
import {
	useCreateBlogMutation,
	useUpdateBlogMutation,
	useDeleteBlogMutation,
} from "../../hooks/useContentApi";
import { getYouTubeEmbedUrl } from "../../utils/youtubeHelpers";

function BlogFormModal({ blog, isOpen, onClose }) {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		author: "",
		tags: "",
		videoUrl: "",
		mainImage: null,
		sections: [],
	});

	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState("");

	const createMutation = useCreateBlogMutation({
		onSuccess: () => {
			onClose();
			resetForm();
		},
	});

	const updateMutation = useUpdateBlogMutation({
		onSuccess: () => {
			onClose();
			resetForm();
		},
	});

	const deleteMutation = useDeleteBlogMutation({
		onSuccess: () => {
			onClose();
			resetForm();
		},
	});

	useEffect(() => {
		if (blog) {
			setFormData({
				title: blog.title || "",
				description: blog.description || "",
				author: blog.author || "",
				tags: blog.tags ? blog.tags.join(", ") : "",
				videoUrl: blog.videoUrl || "",
				sections: blog.sections || [],
			});

			if (blog.mainImage) {
				setImagePreview(blog.mainImage);
			}
		} else {
			resetForm();
		}
	}, [blog]);

	const resetForm = () => {
		setFormData({
			title: "",
			description: "",
			author: "",
			tags: "",
			videoUrl: "",
			sections: [],
		});
		setImageFile(null);
		setImagePreview("");
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImageFile(file);
			const preview = URL.createObjectURL(file);
			setImagePreview(preview);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formDataToSend = new FormData();
		formDataToSend.append("title", formData.title);
		formDataToSend.append("description", formData.description);

		// Add author if provided
		if (formData.author && formData.author.trim()) {
			formDataToSend.append("author", formData.author.trim());
		}

		// Add video URL if provided
		if (formData.videoUrl && formData.videoUrl.trim()) {
			formDataToSend.append("videoUrl", formData.videoUrl.trim());
		}

		// Convert tags string to array
		const tagsArray = formData.tags
			.split(",")
			.map((tag) => tag.trim())
			.filter((tag) => tag);
		tagsArray.forEach((tag) => formDataToSend.append("tags", tag));

		// Add image if uploaded
		if (imageFile) {
			formDataToSend.append("mainImage", imageFile);
		}

		if (blog) {
			// Update existing blog
			updateMutation.mutate({
				blogId: blog._id,
				payload: formDataToSend,
			});
		} else {
			// Create new blog
			createMutation.mutate(formDataToSend);
		}
	};

	const handleDelete = () => {
		if (blog && window.confirm("Are you sure you want to delete this blog?")) {
			deleteMutation.mutate(blog._id);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
					<h2 className="text-2xl font-bold text-gray-800">
						{blog ? "Edit Blog" : "Add New Blog"}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 transition-colors text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
					>
						×
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{/* Title */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Blog Title *
						</label>
						<input
							type="text"
							name="title"
							value={formData.title}
							onChange={handleChange}
							required
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB0E00] focus:border-transparent"
							placeholder="Enter blog title"
						/>
					</div>

					{/* Author */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Author Name
						</label>
						<input
							type="text"
							name="author"
							value={formData.author}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB0E00] focus:border-transparent"
							placeholder="Enter author name"
						/>
					</div>

					{/* Description */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Description *
						</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleChange}
							required
							rows={4}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB0E00] focus:border-transparent resize-none"
							placeholder="Enter blog description"
						/>
					</div>

					{/* YouTube Video URL */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							YouTube Video URL (Optional)
						</label>
						<input
							type="url"
							name="videoUrl"
							value={formData.videoUrl}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB0E00] focus:border-transparent"
							placeholder="https://www.youtube.com/watch?v=..."
						/>
						<p className="mt-1 text-xs text-gray-500">
							Add a YouTube video to display in the middle of your blog content
						</p>
						{formData.videoUrl &&
							(() => {
								const embedUrl = getYouTubeEmbedUrl(formData.videoUrl);
								return embedUrl && embedUrl.includes("youtube.com") ? (
									<div className="mt-2 w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
										<iframe
											src={embedUrl}
											title="Video Preview"
											className="w-full h-full"
											frameBorder="0"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowFullScreen
										></iframe>
									</div>
								) : null;
							})()}
					</div>

					{/* Main Image */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Main Image
						</label>
						<input
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB0E00] focus:border-transparent"
						/>
						{imagePreview && (
							<div className="mt-2">
								<img
									src={imagePreview}
									alt="Preview"
									className="w-full h-48 object-cover rounded-lg"
								/>
							</div>
						)}
					</div>

					{/* Tags */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Tags (comma separated)
						</label>
						<input
							type="text"
							name="tags"
							value={formData.tags}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB0E00] focus:border-transparent"
							placeholder="e.g. Astrology, Vastu, Numerology"
						/>
					</div>

					{/* Buttons */}
					<div className="flex gap-4 pt-4">
						{blog && (
							<button
								type="button"
								onClick={handleDelete}
								disabled={deleteMutation.isPending}
								className="px-6 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{deleteMutation.isPending ? "Deleting..." : "Delete"}
							</button>
						)}
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={createMutation.isPending || updateMutation.isPending}
							className="flex-1 px-6 py-3 bg-[#BB0E00] text-white rounded-lg hover:bg-[#A00D00] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{createMutation.isPending || updateMutation.isPending
								? "Saving..."
								: blog
								? "Update Blog"
								: "Add Blog"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default BlogFormModal;
