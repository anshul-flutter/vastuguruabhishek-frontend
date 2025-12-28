import React from "react";
import { FaPlay } from "react-icons/fa";
import bannerImg from "../../assets/bannerImg.png";

const ContentManagement = () => {
	return (
		<div className="w-full h-full overflow-y-auto scrollbar-thin">
			<div className="flex items-start justify-center p-5 min-h-screen">
				<div className="flex flex-col w-full max-w-7xl">
					<h2 className="text-lg font-semibold mb-1">
						New course on Palmistry now available!
					</h2>
					<p className="text-sm text-gray-500 mb-3">
						Last Updated: Jul 12, 2025
					</p>

					<div className="flex gap-6 flex-wrap">
						<div className="relative w-72 h-40 bg-gradient-to-r from-[#bb0f01] to-[#c63c00] rounded-xl p-4 flex flex-col justify-between shadow-md text-white overflow-hidden">
							<p className="text-xs font-medium">Upcoming Sessions</p>

							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-sm font-semibold leading-snug mb-2">
										Lorem ipsum dolor sit amet, consectetur
									</h3>
									<div className="mt-3 flex items-center gap-2">
										<button className="bg-white text-red-600 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100">
											Start Your Journey
										</button>
										<div className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
											<FaPlay size={14} className="text-red-700" />
										</div>
									</div>
								</div>
							</div>
							<img
								src={bannerImg}
								alt="Thumbnail"
								className="absolute top-1/2 -right-10 transform -translate-y-1/2 w-32 h-32 rounded-full shadow-md"
							/>
						</div>
						<div className="flex flex-col gap-6">
							<div className="flex gap-6 flex-wrap">
								<div className="w-72 h-40 border-2 border-dashed border-red-400 rounded-xl flex items-center justify-center text-red-500">
									<span className="text-sm">+ Add Thumbnail</span>
								</div>
								<div className="w-72 h-40 border-2 border-dashed border-red-400 rounded-xl flex items-center justify-center text-red-500">
									<span className="text-sm">+ Add Thumbnail</span>
								</div>
							</div>
							<div className="flex gap-6 flex-wrap">
								<button className="w-72 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-[#bb3e01] to-[#bc1d06]">
									Upload New Banner
								</button>
								<button className="w-72 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-[#bb3e01] to-[#bc1d06]">
									Upload New Banner
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContentManagement;
