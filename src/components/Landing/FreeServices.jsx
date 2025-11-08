import React from "react";
import { CgChevronRight } from "react-icons/cg";
import { PiStarOfDavidLight, PiStarOfDavidThin } from "react-icons/pi";
import icon1 from "../../assets/icon1.png";
import icon2 from "../../assets/icon2.png";
import icon3 from "../../assets/icon3.png";
import { MdMenuBook } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const FreeServices = () => {
	const navigate = useNavigate();
	return (
		<>
			{" "}
			<section className="py-10 sm:py-12 md:py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col-reverse lg:flex-row items-center gap-8 md:gap-10 lg:gap-16 justify-between">
					{/* Left: Cards */}
					<div className="flex-1 w-full min-w-0 flex flex-col gap-4 sm:gap-5">
						{[
							{
								icon: icon1,
								title: "Kundli",
								color: "from-red-500 to-red-400",
								path: "/kundli",
							},
							{
								icon: icon2,
								title: "Name Numerology",
								color: "from-blue-500 to-blue-400",
								path: "/name-calculator",
							},
							{
								icon: icon3,
								title: "Free Vastu courses",
								color: "from-orange-500 to-orange-400",
								url: "https://www.youtube.com/watch?v=avOuTWxFqEo&list=PLnAXf2e99Pr43Q14NqirgZLLsg5rikciq&pp=gAQB",
							},
						].map(({ icon, title, color, path, url }) => (
							<div
								key={title}
								onClick={() => {
									if (path) {
										navigate(path);
									} else if (url) {
										window.open(url, "_blank");
									}
								}}
								className={`flex justify-between items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl text-white bg-gradient-to-r ${color} shadow-lg transition-transform transform hover:scale-105 hover:rotate-y-6 cursor-pointer relative overflow-hidden`}
								style={{ transformStyle: "preserve-3d" }}
							>
								<div className="flex items-center gap-3 sm:gap-4 min-w-0">
									<span className="text-2xl rounded-full flex-shrink-0">
										<img src={icon} alt="" className="h-[50px] sm:h-[60px]" />
									</span>
									<div className="min-w-0">
										<h3 className="text-base sm:text-lg font-semibold truncate">
											{title}
										</h3>
									</div>
								</div>
								<div className="h-[40px] w-[40px] sm:h-[50px] sm:w-[50px] absolute top-[70%] left-[40%] rounded-full bg-white/20" />
								<div className="h-[40px] w-[40px] sm:h-[50px] sm:w-[50px] absolute -top-[20%] right-[20%] rounded-full bg-white/20" />
								<CgChevronRight
									size={"1.5rem"}
									className="sm:text-[2rem] flex-shrink-0"
								/>
							</div>
						))}
					</div>

					{/* Right: Text */}
					<div className="flex-1 space-y-3 sm:space-y-4 w-full">
						<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
							Free Services
						</h2>
						<p className="text-sm sm:text-base text-gray-600 leading-tight">
							Discover our complimentary tools designed to help you understand
							the fundamentals of Vastu and personal astrology. Whether you're
							exploring Kundli charts, decoding numerology, or checking Panchang
							— our free tools are here to guide your spiritual journey.
						</p>
					</div>
				</div>
			</section>
		</>
	);
};

export default FreeServices;
