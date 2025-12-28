import { Link } from "react-router-dom";
import { getYouTubeEmbedUrl } from "../../utils/youtubeHelpers";

const PodcastCard = ({ video }) => {
	const embedUrl = getYouTubeEmbedUrl(video.url);

	return (
		<article className="bg-white flex flex-col rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-300">
			{/* Video Preview */}
			<Link
				to={`/podcast/${video._id}`}
				className="relative w-full h-[200px] block overflow-hidden bg-gray-900"
			>
				{video.url && embedUrl && embedUrl.includes("youtube.com") ? (
					<iframe
						src={embedUrl}
						title={video.title}
						className="w-full h-full pointer-events-none"
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					></iframe>
				) : (
					<div className="w-full h-full flex items-center justify-center text-white">
						<p>Video Preview Unavailable</p>
					</div>
				)}
			</Link>

			{/* Content */}
			<div className="flex flex-col justify-between flex-1 p-6">
				<div>
					<h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
						{video.title}
					</h3>
					<p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
						{video.description}
					</p>
				</div>

				<Link
					to={`/podcast/${video._id}`}
					className="font-semibold transition-opacity duration-300 hover:opacity-80 text-white bg-[#c02c07] px-4 py-2 rounded-lg text-sm text-center"
				>
					Watch Now →
				</Link>
			</div>
		</article>
	);
};

export default PodcastCard;
