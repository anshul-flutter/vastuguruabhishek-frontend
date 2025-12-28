import { useEffect, useMemo, useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import PodcastCard from "./PodcastCard";
import { usePodcastsQuery } from "../../hooks/useContentApi";

const DEFAULT_VISIBLE = 6;

const Podcasts = ({ isHomePage = false, type = "podcast" }) => {
	const [visibleCards, setVisibleCards] = useState(DEFAULT_VISIBLE);
	const {
		data: podcasts = [],
		isLoading,
		isError,
		error,
		refetch,
	} = usePodcastsQuery({
		params: { type },
	});

	const visiblePodcasts = useMemo(
		() => podcasts.slice(0, visibleCards),
		[podcasts, visibleCards]
	);

	const title = type === "free_course" ? "Free Courses" : "Latest Videos";
	const viewAllLink = type === "free_course" ? "/free-courses" : "/podcast";

	useEffect(() => {
		if (visibleCards === DEFAULT_VISIBLE) return;
		if (visibleCards > podcasts.length) {
			setVisibleCards(podcasts.length || DEFAULT_VISIBLE);
		}
	}, [podcasts.length, visibleCards]);

	return (
		<div className="px-[1.5rem]">
			<h1 className="my-[2rem] text-[1.5rem] font-semibold">{title}</h1>

			{isLoading && <p className="text-sm text-gray-500">Loading...</p>}

			{isError && (
				<div className="flex flex-col items-center gap-3 py-6">
					<p className="text-sm text-red-600">
						{error?.response?.data?.message ??
							error?.message ??
							"Unable to load content."}
					</p>
					<button
						onClick={() => refetch()}
						className="text-white bg-[#c02c07] px-4 py-2 rounded-lg text-sm hover:opacity-85"
					>
						Retry
					</button>
				</div>
			)}

			{!isLoading && !isError && podcasts.length === 0 && (
				<p className="text-sm text-gray-500">No content available right now.</p>
			)}

			<div className="grid gap-6 max-[600px]:grid-cols-1 max-[850px]:grid-cols-2 min-[850px]:grid-cols-3">
				{visiblePodcasts.map((video) => (
					<PodcastCard key={video._id ?? video.id} video={video} />
				))}
			</div>

			{podcasts.length > DEFAULT_VISIBLE && (
				<div className="flex items-center justify-center my-[2rem]">
					{visibleCards >= podcasts.length ? (
						<button
							onClick={() => setVisibleCards(DEFAULT_VISIBLE)}
							className="font-semibold transition-opacity duration-300 hover:opacity-80 text-white bg-[#c02c07] px-4 py-2 cursor-pointer rounded-lg text-sm"
						>
							View Less
						</button>
					) : isHomePage ? (
						<Link
							to={viewAllLink}
							className="flex items-center gap-[5px] font-semibold transition-opacity duration-300 hover:opacity-80 text-white bg-[#c02c07] px-4 py-2 cursor-pointer rounded-lg text-sm"
						>
							View All <IoIosArrowRoundForward size={24} />
						</Link>
					) : (
						<button
							onClick={() => setVisibleCards(podcasts.length)}
							className="flex items-center gap-[5px] font-semibold transition-opacity duration-300 hover:opacity-80 text-white bg-[#c02c07] px-4 py-2 cursor-pointer rounded-lg text-sm"
						>
							View All <IoIosArrowRoundForward size={24} />
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default Podcasts;
