import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import { getYouTubeEmbedUrl } from "../../utils/youtubeHelpers";
import { FiArrowLeft, FiExternalLink } from "react-icons/fi";

function PodcastDetails() {
	const { id } = useParams();
	const navigate = useNavigate();

	// Fetch podcast details
	const {
		data: podcast,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["podcast", id],
		queryFn: async () => {
			const response = await apiClient.get(`/podcasts/${id}`);
			return response.data?.data;
		},
		enabled: !!id,
	});

	const handleBack = () => {
		if (podcast?.type === "free_course") {
			navigate("/free-courses");
		} else {
			navigate("/podcast");
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="container mx-auto px-4 py-8">
					<div className="flex justify-center items-center min-h-[400px]">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c02c07]"></div>
					</div>
				</div>
			</div>
		);
	}

	if (error || !podcast) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="container mx-auto px-4 py-8">
					<div className="flex flex-col justify-center items-center min-h-[400px]">
						<p className="text-red-600 mb-4 text-lg">Video not found</p>
						<button
							onClick={handleBack}
							className="px-6 py-3 bg-[#c02c07] text-white rounded-lg hover:bg-[#a02306] transition-colors flex items-center gap-2"
						>
							<FiArrowLeft className="w-4 h-4" />
							Back to Videos
						</button>
					</div>
				</div>
			</div>
		);
	}

	const embedUrl = getYouTubeEmbedUrl(podcast?.url);

	const backText =
		podcast?.type === "free_course" ? "Back to Free Courses" : "Back to Videos";

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="flex justify-between items-center mb-8">
					<button
						onClick={handleBack}
						className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
					>
						<FiArrowLeft className="w-4 h-4" />
						{backText}
					</button>
				</div>

				{/* Main Content */}
				<div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
					{/* Video Player */}
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
											className="px-6 py-3 bg-[#c02c07] text-white rounded-lg hover:bg-[#a02306] transition-colors inline-flex items-center gap-2"
										>
											<FiExternalLink className="w-4 h-4" />
											Open in YouTube
										</a>
									</div>
								</div>
							)}
						</div>
					)}

					{/* Video Info */}
					<div className="p-6 sm:p-8">
						{/* Title */}
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
							{podcast.title}
						</h1>

						{/* Category Badge */}
						{podcast.category && (
							<div className="mb-4">
								<span className="inline-block px-3 py-1 text-sm font-semibold text-[#c02c07] bg-red-50 rounded-full">
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
						{podcast.description && (
							<div className="mb-6">
								<h2 className="text-xl font-bold text-gray-900 mb-3">
									Description
								</h2>
								<p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
									{podcast.description}
								</p>
							</div>
						)}

						{/* Watch on YouTube Link */}
						{podcast.url && (
							<div className="mb-6 pt-4 border-t border-gray-200">
								<a
									href={podcast.url}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
								>
									<FiExternalLink className="w-4 h-4" />
									Watch on YouTube
								</a>
							</div>
						)}

						{/* Timestamps */}
						{podcast.createdAt && (
							<div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
								<span>
									Published: {new Date(podcast.createdAt).toLocaleDateString()}
								</span>
							</div>
						)}
					</div>
				</div>

				{/* Back to Videos Button */}
				<div className="text-center mt-8">
					<button
						onClick={handleBack}
						className="px-6 py-3 bg-[#c02c07] text-white rounded-lg hover:bg-[#a02306] transition-colors"
					>
						{podcast?.type === "free_course"
							? "View More Free Courses"
							: "View More Videos"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default PodcastDetails;
