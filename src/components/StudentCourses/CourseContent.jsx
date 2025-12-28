import React, { useState } from "react";
import { FaVideo, FaPlay, FaLock } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

export default function CourseContent({ crsDetails, isEnrolled }) {
	const [visibleCount, setVisibleCount] = useState(6);

	const videos = React.useMemo(
		() => crsDetails?.courseContent ?? [],
		[crsDetails?.courseContent]
	);

	// Debug: Log course content to check what data we're receiving
	React.useEffect(() => {
		if (videos.length > 0) {
			console.log("📹 Course Content Data:", videos);
			console.log("📹 First video item:", videos[0]);
		}
	}, [videos]);

	return (
		<>
			<div className="w-full mt-[1.5rem]">
				<h2 className="text-[1.25rem] font-semibold mb-4">Course Content</h2>

				<div className="space-y-3">
					{videos.slice(0, visibleCount).map((item, index) => (
						<div
							key={item._id || index}
							className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-2 bg-white"
						>
							<div className="flex items-center gap-3">
								<FaVideo className="text-gray-600" />
								<span className="text-sm font-medium">{item.title}</span>
							</div>

							{/* Support both videoUrl (new) and video (old) fields */}
							{(item.videoUrl || item.video) && (isEnrolled || item.preview) ? (
								<button
									className="flex items-center gap-2 text-red-600 font-medium"
									onClick={() =>
										window.open(item.videoUrl || item.video, "_blank")
									}
								>
									<FaPlay /> {isEnrolled ? "View" : "Preview"}
								</button>
							) : (
								<button className="text-gray-400 cursor-not-allowed">
									<FaLock />
								</button>
							)}
						</div>
					))}
				</div>
			</div>
			{videos.length > 6 && (
				<button
					className="mt-3 text-sm underline text-[#BB0E00]"
					onClick={() =>
						setVisibleCount(visibleCount === videos.length ? 6 : videos.length)
					}
				>
					{visibleCount === videos.length ? "See less" : "See more"}
				</button>
			)}
		</>
	);
}
