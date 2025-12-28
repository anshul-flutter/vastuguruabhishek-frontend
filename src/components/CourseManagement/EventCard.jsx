import { MdLocationPin } from "react-icons/md";
import { IoCalendarClearOutline } from "react-icons/io5";

function EventCard() {
	return (
		<>
			{/* Event Card */}
			<div className="mx-1 xs:mx-2 sm:mx-4 md:mx-6 mt-8 bg-white">
				{/* Content Card */}
				<div className="bg-white flex flex-col lg:flex-row gap-4 lg:gap-2.5 justify-between border border-[#E1E1E1] rounded-[15px] w-full max-w-4xl mx-auto p-3 xs:p-4 sm:p-5 shadow-[0_4px_14.6px_0_rgba(0,0,0,0.10)]">
					{/* Left Section */}
					<div className="border-b-2 lg:border-b-0 lg:border-r-2 border-black/20 lg:border-black w-full lg:w-1/2 flex flex-col items-start pb-4 lg:pb-0 lg:pr-4">
						{/* Small Image Above Title */}
						<div className="w-72 h-44 sm:w-80 sm:h-56 mb-3 rounded-lg overflow-hidden">
							<img
								src="/images/AstroChat.png"
								alt="Full Moon Healing Meditation"
								className="w-full h-full object-cover"
							/>
						</div>

						<h2 className="font-[590] text-[18px] sm:text-[20px] mb-3 leading-tight">
							Full Moon Healing Meditation
						</h2>
						<div className="flex items-center font-medium gap-2 mb-3 text-sm sm:text-base">
							<IoCalendarClearOutline className="w-[15px] h-[15px] flex-shrink-0" />
							<p>Jul 18,2025 | 8:00 PM</p>
						</div>
						<div className="flex items-center font-medium gap-2 mb-3 text-sm sm:text-base">
							<MdLocationPin size={20} className="flex-shrink-0" />
							<p>Online (Zoom)</p>
						</div>
						<div className="flex flex-wrap items-center gap-2 mb-3">
							<span className="border border-gray-300 px-[10px] py-[4px] rounded-full text-xs sm:text-sm bg-gray-50 hover:bg-gray-100 transition-colors">
								Astrology
							</span>
							<span className="border border-gray-300 px-[10px] py-[4px] rounded-full text-xs sm:text-sm bg-gray-50 hover:bg-gray-100 transition-colors">
								Vastu
							</span>
						</div>
						<div className="flex items-center font-medium gap-2 mb-2">
							<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
								<img
									src="/images/Girls.png"
									alt="Event members"
									className="w-full h-full object-cover"
								/>
							</div>
							<p className="text-sm sm:text-base">100+ Members</p>
						</div>
					</div>
					{/* Right Section */}
					<div className="w-full lg:w-1/2 flex flex-col">
						<h3 className="text-[1.1rem] sm:text-[1.2rem] font-semibold mb-3">
							About The Event
						</h3>
						<p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 flex-grow">
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ex fugit
							ullam ipsam maiores vitae dolore ratione nesciunt quas architecto
							pariatur! Adipisci quisquam nihil libero autem? Ipsa quasi tempora
							amet nam.architecto pariatur! Adipisci quisquam nihil libero
						</p>

						<div className="mb-4">
							<h4 className="font-semibold mb-2 text-sm sm:text-base">
								Top Mentors
							</h4>
							<div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-gray-200">
								<img
									src="/images/Guruji.png"
									alt="Top mentor - Guruji"
									className="w-full h-full object-cover object-center"
								/>
							</div>
						</div>

						<button className="w-full py-3 sm:py-4 bg-[#BB0E00] text-white rounded-[5px] font-medium text-sm sm:text-base cursor-pointer border border-[#BB0E00] hover:bg-[#9a0c00] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#BB0E00] focus:ring-opacity-50">
							Publish Event
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default EventCard;
