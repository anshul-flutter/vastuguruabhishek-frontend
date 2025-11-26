import React from "react";
import { BiSolidFactory } from "react-icons/bi";
import { FaHome } from "react-icons/fa";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { MdMenuBook } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Services = ({ content }) => {
	const navigate = useNavigate();

	const title = content?.title ?? "Our Services";
	const description =
		content?.subtitle ??
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

	return (
		<>
			<section
				id="services"
				className="py-8 sm:py-10 bg-gray-50 relative overflow-hidden"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-14">
					{/* Left side */}
					<div className="flex-1 w-full lg:pr-8">
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3 sm:mb-4">
							{title}
						</h2>
						<p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-tight">
							{description}
						</p>
					</div>

					{/* Right side - Cards */}
					<div className="flex-1 min-h-[280px] sm:min-h-[350px] flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
						<div className="flex flex-row sm:flex-col w-full sm:w-1/2 gap-3 sm:gap-4">
							<div
								onClick={() => navigate("/vastu-home")}
								className="cursor-pointer hover:scale-102 transition-all .3s ease-in-out p-3 sm:p-4 flex-1 sm:h-[70%] bg-[#ee6340] border border-[#ee6340] rounded-[15px] relative overflow-hidden"
							>
								<span className="text-white text-sm sm:text-base lg:text-[1.15rem] font-semibold">
									Vastu for <br /> Home
								</span>
								<FaHome
									size={"6rem"}
									className="text-white absolute -right-[10%] -bottom-[10%] sm:text-[8rem] lg:text-[10rem]"
								/>
								<div className="h-[100px] w-[100px] sm:h-[150px] sm:w-[150px] absolute -top-[25%] -left-[20%] rounded-full bg-white/20" />
								<div className="h-[30px] w-[30px] sm:h-[50px] sm:w-[50px] absolute top-[60%] rounded-full bg-white/20" />
								<div className="h-[60px] w-[60px] sm:h-[100px] sm:w-[100px] absolute bottom-[60%] -right-[20%] rounded-full bg-white/20" />
							</div>
							<div
								onClick={() => navigate("/vastu-industrial")}
								className="cursor-pointer hover:scale-102 transition-all .3s ease-in-out flex items-center gap-2 sm:gap-4 flex-1 sm:h-[30%] bg-[#1386cb] p-3 sm:p-4 rounded-[15px] relative overflow-hidden"
							>
								<BiSolidFactory
									size={"3rem"}
									className="text-white sm:text-[4rem]"
								/>
								<span className="text-white text-sm sm:text-base lg:text-[1.15rem] leading-tight font-semibold">
									Vastu for <br /> Factory
								</span>
								<div className="h-[30px] w-[30px] sm:h-[50px] sm:w-[50px] absolute -top-[30%] left-[20%] rounded-full bg-white/20" />
								<div className="h-[30px] w-[30px] sm:h-[50px] sm:w-[50px] absolute top-[60%] rounded-full bg-white/20" />
								<div className="h-[60px] w-[60px] sm:h-[100px] sm:w-[100px] absolute bottom-[60%] -right-[20%] rounded-full bg-white/20" />
							</div>
						</div>
						<div className="flex flex-row sm:flex-col w-full sm:w-1/2 gap-3 sm:gap-4">
							<div
								onClick={() => navigate("/vastu-office")}
								className="cursor-pointer hover:scale-102 transition-all .3s ease-in-out flex items-center gap-2 sm:gap-4 flex-1 sm:h-[30%] bg-[#1386cb] p-3 sm:p-4 rounded-[15px] relative overflow-hidden"
							>
								<HiMiniBuildingOffice2
									size={"3rem"}
									className="text-white sm:text-[4rem]"
								/>
								<span className="text-white text-sm sm:text-base lg:text-[1.15rem] leading-tight font-semibold">
									Vastu for <br /> Office
								</span>
								<div className="h-[30px] w-[30px] sm:h-[50px] sm:w-[50px] absolute -top-[30%] left-[20%] rounded-full bg-white/20" />
								<div className="h-[30px] w-[30px] sm:h-[50px] sm:w-[50px] absolute top-[60%] rounded-full bg-white/20" />
								<div className="h-[60px] w-[60px] sm:h-[100px] sm:w-[100px] absolute bottom-[60%] -right-[20%] rounded-full bg-white/20" />
							</div>
							<div
								onClick={() => navigate("/courses")}
								className="cursor-pointer hover:scale-102 transition-all .3s ease-in-out p-3 sm:p-4 flex-1 sm:h-[70%] bg-[#ef4e40] border border-[#ef4e40] rounded-[15px] relative overflow-hidden"
							>
								<span className="text-white text-sm sm:text-base lg:text-[1.15rem] font-semibold">
									Advanced Vastu Courses
								</span>
								<MdMenuBook
									size={"6rem"}
									className="text-white absolute right-[10%] bottom-[10%] hidden sm:block sm:text-[8rem]"
								/>
								<div className="h-[100px] w-[100px] sm:h-[150px] sm:w-[150px] absolute -top-[25%] -left-[20%] rounded-full bg-white/20" />
								<div className="h-[50px] w-[50px] sm:h-[75px] sm:w-[75px] absolute bottom-[0%] right-[10%] rounded-full bg-white/20" />
								<div className="h-[60px] w-[60px] sm:h-[100px] sm:w-[100px] absolute bottom-[60%] -right-[20%] rounded-full bg-white/20" />
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Services;
