// Podcast Management Page - Displays podcast list with CRUD operations
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { usePodcastsQuery } from "../../hooks/useContentApi";
import PodcastFormModal from "./PodcastFormModal";

function PodcastManagement({ type = "podcast" }) {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingPodcast, setEditingPodcast] = useState(null);

	const {
		data: podcasts = [],
		isLoading,
		error,
	} = usePodcastsQuery({
		params: { type },
	});

	console.log("Podcasts data:", podcasts);

	const filteredPodcasts = podcasts.filter((podcast) =>
		podcast.title?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleAddPodcast = () => {
		setEditingPodcast(null);
		setIsModalOpen(true);
	};

	const handleEditPodcast = (podcast, e) => {
		e.stopPropagation();
		setEditingPodcast(podcast);
		setIsModalOpen(true);
	};

	const handleViewPodcast = (podcastId) => {
		navigate(`/admin/podcast-details/${podcastId}`);
	};

	const title = type === "free_course" ? "Free Courses" : "Podcast";

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
				<p className="text-red-600">Error loading content. Please try again.</p>
			</div>
		);
	}

	return (
		<div className="p-4 sm:p-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
				<h1 className="text-2xl font-bold text-gray-900">{title} Management</h1>
				<button
					onClick={handleAddPodcast}
					className="px-6 py-2 bg-[#BB0E00] text-white rounded-lg hover:bg-[#A00D00] transition-colors font-semibold"
				>
					Add New {title}
				</button>
			</div>

			{/* Search Bar */}
			<div className="mb-6">
				<input
					type="text"
					placeholder={`Search ${title.toLowerCase()}s by title...`}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB0E00] focus:border-transparent"
				/>
			</div>

			{/* Podcast List */}
			{filteredPodcasts.length === 0 ? (
				<div className="text-center py-12 bg-gray-50 rounded-lg">
					<p className="text-gray-500 mb-4">No {title.toLowerCase()}s found</p>
					<button
						onClick={handleAddPodcast}
						className="px-6 py-2 bg-[#BB0E00] text-white rounded-lg hover:bg-[#A00D00] transition-colors"
					>
						Add your first {title.toLowerCase()}
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredPodcasts.map((podcast) => (
						<div
							key={podcast._id}
							className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
							onClick={() => handleViewPodcast(podcast._id)}
						>
							{/* Video/Podcast Thumbnail */}
							{podcast.url && (
								<div className="h-48 bg-gray-900 flex items-center justify-center relative">
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
											<div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-[#BB0E00] border-b-8 border-b-transparent ml-1"></div>
										</div>
									</div>
									<p className="text-white text-sm font-semibold absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded">
										Video/{title}
									</p>
								</div>
							)}

							{/* Podcast Content */}
							<div className="p-4">
								<h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
									{podcast.title}
								</h3>
								<p className="text-sm text-gray-600 mb-4 line-clamp-3">
									{podcast.description}
								</p>

								{/* Category Badge */}
								<div className="mb-4">
									<span className="inline-block px-3 py-1 text-xs font-semibold text-[#BB0E00] bg-red-50 rounded-full">
										{podcast.category}
									</span>
								</div>

								{/* Tags */}
								{podcast.tags && podcast.tags.length > 0 && (
									<div className="flex flex-wrap gap-2 mb-4">
										{podcast.tags.slice(0, 3).map((tag, index) => (
											<span
												key={index}
												className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
											>
												{tag}
											</span>
										))}
										{podcast.tags.length > 3 && (
											<span className="text-xs px-2 py-1 text-gray-500">
												+{podcast.tags.length - 3} more
											</span>
										)}
									</div>
								)}

								{/* URL Display */}
								{podcast.url && (
									<p className="text-xs text-gray-500 mb-4 truncate">
										🔗 {podcast.url}
									</p>
								)}

								{/* Action Buttons */}
								<div className="flex gap-2 pt-2 border-t">
									<button
										onClick={() => handleViewPodcast(podcast._id)}
										className="flex-1 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
									>
										View
									</button>
									<button
										onClick={(e) => handleEditPodcast(podcast, e)}
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

			{/* Podcast Form Modal */}
			<PodcastFormModal
				podcast={editingPodcast}
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setEditingPodcast(null);
				}}
				type={type}
			/>
		</div>
	);
}

export default PodcastManagement;
