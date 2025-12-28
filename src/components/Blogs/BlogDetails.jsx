import { useParams } from "react-router-dom";
import { RiShareFill } from "react-icons/ri";
import { GoDotFill } from "react-icons/go";
import { useBlogQuery } from "../../hooks/useContentApi";
import toast from "react-hot-toast";
import { getYouTubeEmbedUrl } from "../../utils/youtubeHelpers";

const BlogDetails = () => {
	const { id } = useParams();
	const { data: blog, isLoading, isError } = useBlogQuery(id);

	const handleShare = async () => {
		const url = window.location.href;
		try {
			await navigator.clipboard.writeText(url);
			toast.success("Blog URL copied to clipboard!");
		} catch (err) {
			console.error("Failed to copy:", err);
			toast.error("Failed to copy URL");
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-20">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
			</div>
		);
	}

	if (isError || !blog) {
		return (
			<div className="max-w-4xl mx-auto px-6 py-10">
				<p className="text-center text-gray-600">
					Blog not found or failed to load.
				</p>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
			{/* Title */}
			<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
				{blog.title}
			</h1>
			{/* Tags + Author + Date */}
			<div className="flex flex-col gap-3 mt-3 text-sm text-gray-600">
				<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
					{blog.tags?.map((tag, i) => (
						<span
							key={i}
							className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs whitespace-nowrap flex-shrink-0"
						>
							{tag}
						</span>
					))}
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<span className="break-all">{blog.author}</span>
					<span>
						<GoDotFill className="text-gray-500 flex-shrink-0" size={12} />
					</span>
					<span className="break-all">
						{new Date(blog.date).toDateString()}
					</span>
				</div>
			</div>
			<div className="w-full h-[2px] mt-[1rem] bg-gray-200" />
			{/* Main Image */}
			<div className="mt-6 rounded-xl overflow-hidden shadow">
				<img
					src={blog.mainImage || "/images/course.png"}
					alt={blog.title}
					className="w-full h-[250px] sm:h-[350px] object-cover"
				/>
			</div>
			{/* Main Description */}
			<p className="mt-6 text-base sm:text-lg leading-relaxed text-gray-700 break-words">
				{blog.description}
			</p>
			{/* YouTube Video (if available) */}
			{blog.videoUrl && (
				<div className="mt-8">
					<div className="w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg">
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
			<div className="mt-10 space-y-10">
				{blog.sections?.map((section, idx) => (
					<div key={idx}>
						<h2 className="text-xl sm:text-2xl font-semibold text-gray-800 break-words">
							{section.subheading}
						</h2>
						<p className="mt-3 text-gray-700 leading-relaxed break-words">
							{section.text}
						</p>

						{/* Optional Images */}
						{section.images?.length > 0 && (
							<div className="mt-4">
								{/* 1 Image */}
								{section.images.length === 1 && (
									<img
										src={section.images[0]}
										alt={`section-${idx}-img-0`}
										className="w-full border border-gray-300 rounded-lg object-cover"
									/>
								)}

								{/* 2 Images */}
								{section.images.length === 2 && (
									<div className="grid gap-4 min-[800px]:grid-cols-2">
										{section.images.map((img, i) => (
											<img
												key={i}
												src={img}
												alt={`section-${idx}-img-${i}`}
												className="w-full border border-gray-300 h-full rounded-lg object-cover"
											/>
										))}
									</div>
								)}

								{/* 3 Images */}
								{section.images.length === 3 && (
									<div className="grid gap-4 min-[800px]:grid-cols-2">
										{/* First two images (side by side only on >=800px) */}
										{section.images.slice(0, 2).map((img, i) => (
											<img
												key={i}
												src={img}
												alt={`section-${idx}-img-${i}`}
												className="w-full border border-gray-300 h-full rounded-lg object-cover"
											/>
										))}
										{/* Third image always spans full width */}
										<div className="col-span-1 min-[800px]:col-span-2">
											<img
												src={section.images[2]}
												alt={`section-${idx}-img-2`}
												className="w-full border border-gray-300 rounded-lg object-cover"
											/>
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				))}
			</div>
			<div className="flex items-center gap-[1rem] mt-[2rem]">
				<button
					onClick={handleShare}
					className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
				>
					<div className="flex items-center justify-center rounded-full border min-shadow border-gray-300 w-[35px] h-[35px]">
						<RiShareFill size={"1.15rem"} className="text-gray-700" />
					</div>
					<span className="text-[.75rem] text-gray-700">Share</span>
				</button>
			</div>
		</div>
	);
};

export default BlogDetails;
