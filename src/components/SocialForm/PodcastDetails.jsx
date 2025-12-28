import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import { useDeletePodcastMutation } from "../../hooks/useContentApi";
import PodcastFormModal from "./PodcastFormModal";

function PodcastDetails() {
	const { podcastId } = useParams();
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Fetch podcast details
	const {
		data: podcast,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["podcast", podcastId],
		queryFn: async () => {
			const response = await apiClient.get(`/podcasts/${podcastId}`);
			return response.data?.data;
		},
		enabled: !!podcastId,
	});

	const deleteMutation = useDeletePodcastMutation({
		onSuccess: () => {
			if (podcast?.type === "free_course") {
				navigate("/admin/free-courses");
			} else {
				navigate("/admin/podcast-management");
			}
		},
	});

	const handleEdit = () => {
		setIsModalOpen(true);
	};

	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this podcast?")) {
			deleteMutation.mutate(podcastId);
		}
	};

	const handleBack = () => {
		if (podcast?.type === "free_course") {
			navigate("/admin/free-courses");
		} else {
			navigate("/admin/podcast-management");
		}
	};

	// Extract video ID from YouTube URL
	const getYouTubeEmbedUrl = (url) => {
		if (!url) return null;
		const regExp =
			/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
		const match = url.match(regExp);
		const videoId = match && match[7].length === 11 ? match[7] : null;
		return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BB0E00]"></div>
			</div>
		);
	}

	if (error || !podcast) {
		return (
			<div className="flex flex-col justify-center items-center min-h-[400px]">
				<p className="text-red-600 mb-4">Podcast not found</p>
				<button
					onClick={handleBack}
					className="px-6 py-2 bg-[#BB0E00] text-white rounded-lg hover:bg-[#A00D00] transition-colors"
				>
					Back to Podcasts
				</button>
			</div>
		);
	}

	const embedUrl = getYouTubeEmbedUrl(podcast.url);

	return (
		<div className="p-4 sm:p-6 max-w-5xl mx-auto">
			{/* Header */}
			<div className="flex justify-between items-start mb-6">
				<button
					onClick={handleBack}
					className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
				>
					← Back to Podcasts
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
				{/* Video/Podcast Player */}
				{podcast.url && (
					<div className="w-full aspect-video bg-gray-900">
						{embedUrl && embedUrl.includes("youtube.com") ? (
							<iframe
								src={embedUrl}
								title={podcast.title}
								className="w-full h-full"
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							></iframe>
						) : (
							<div className="w-full h-full flex items-center justify-center text-white">
								<div className="text-center">
									<p className="mb-4">External Media</p>
									<a
										href={podcast.url}
										target="_blank"
										rel="noopener noreferrer"
										className="px-6 py-3 bg-[#BB0E00] text-white rounded-lg hover:bg-[#A00D00] transition-colors inline-block"
									>
										Open in New Tab
									</a>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Podcast Info */}
				<div className="p-8">
					{/* Title */}
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						{podcast.title}
					</h1>

					{/* Category Badge */}
					{podcast.category && (
						<div className="mb-4">
							<span className="inline-block px-4 py-2 text-sm font-semibold text-[#BB0E00] bg-red-50 rounded-full">
								{podcast.category}
							</span>
						</div>
					)}

					{/* Tags */}
					{podcast.tags && podcast.tags.length > 0 && (
						<div className="flex flex-wrap gap-2 mb-6">
							{podcast.tags.map((tag, index) => (
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
					<div className="prose max-w-none mb-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							Description
						</h2>
						<p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
							{podcast.description}
						</p>
					</div>

					{/* URL */}
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Original Link
						</h3>
						<a
							href={podcast.url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-[#BB0E00] hover:underline break-all"
						>
							{podcast.url}
						</a>
					</div>

					{/* Timestamps */}
					<div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
						<div className="flex flex-wrap gap-4">
							{podcast.createdAt && (
								<span>
									Created: {new Date(podcast.createdAt).toLocaleString()}
								</span>
							)}
							{podcast.updatedAt && (
								<span>
									Last Updated: {new Date(podcast.updatedAt).toLocaleString()}
								</span>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Edit Modal */}
			<PodcastFormModal
				podcast={podcast}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				type={podcast.type}
			/>
		</div>
	);
}

export default PodcastDetails;
