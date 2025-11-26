import { useState, useEffect } from "react";
import {
	useCreatePodcastMutation,
	useUpdatePodcastMutation,
	useDeletePodcastMutation,
} from "../../hooks/useContentApi";

function PodcastFormModal({ podcast, isOpen, onClose, type = "podcast" }) {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		url: "",
		tags: "",
		category: "Astrology",
	});

	const createMutation = useCreatePodcastMutation({
		onSuccess: () => {
			onClose();
			resetForm();
		},
	});

	const updateMutation = useUpdatePodcastMutation({
		onSuccess: () => {
			onClose();
			resetForm();
		},
	});

	const deleteMutation = useDeletePodcastMutation({
		onSuccess: () => {
			onClose();
			resetForm();
		},
	});

	useEffect(() => {
		if (podcast) {
			setFormData({
				title: podcast.title || "",
				description: podcast.description || "",
				url: podcast.url || "",
				tags: podcast.tags ? podcast.tags.join(", ") : "",
				category: podcast.category || "Astrology",
			});
		} else {
			resetForm();
		}
	}, [podcast]);

	const resetForm = () => {
		setFormData({
			title: "",
			description: "",
			url: "",
			tags: "",
			category: "Astrology",
		});
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const payload = {
			title: formData.title,
			description: formData.description,
			url: formData.url,
			category: formData.category,
			tags: formData.tags
				.split(",")
				.map((tag) => tag.trim())
				.filter((tag) => tag),
			type: type,
		};

		if (podcast) {
			// Update existing podcast
			updateMutation.mutate({
				podcastId: podcast._id,
				payload,
			});
		} else {
			// Create new podcast
			createMutation.mutate(payload);
		}
	};

	const handleDelete = () => {
		if (
			podcast &&
			window.confirm("Are you sure you want to delete this item?")
		) {
			deleteMutation.mutate(podcast._id);
		}
	};

	if (!isOpen) return null;

	const title = type === "free_course" ? "Free Course" : "Podcast";

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
					<h2 className="text-2xl font-bold text-gray-800">
						{podcast ? `Edit ${title}` : `Add New ${title}`}
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
							{title} Title *
						</label>
						<input
							type="text"
							name="title"
							value={formData.title}
							onChange={handleChange}
							required
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB0E00] focus:border-transparent"
							placeholder={`Enter ${title.toLowerCase()} title`}
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
							placeholder={`Enter ${title.toLowerCase()} description`}
						/>
					</div>

					{/* URL */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Video/{title} URL *
						</label>
						<input
							type="text"
							name="url"
							value={formData.url}
							onChange={handleChange}
							required
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB0E00] focus:border-transparent"
							placeholder="https://youtube.com/watch?v=..."
						/>
					</div>

					{/* Category */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Category *
						</label>
						<div className="flex flex-wrap gap-4">
							{["Astrology", "Vastu", "Numerology"].map((category) => (
								<label key={category} className="flex items-center">
									<input
										type="radio"
										name="category"
										value={category}
										checked={formData.category === category}
										onChange={handleChange}
										className="w-4 h-4 text-[#BB0E00] focus:ring-[#BB0E00]"
									/>
									<span className="ml-2 text-sm font-medium text-gray-700">
										{category}
									</span>
								</label>
							))}
						</div>
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
						{podcast && (
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
								: podcast
								? `Update ${title}`
								: `Add ${title}`}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default PodcastFormModal;
