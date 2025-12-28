import React from "react";
import { PiStarOfDavidLight } from "react-icons/pi";
import icon1 from "../../assets/icon1.png";
import icon2 from "../../assets/icon2.png";
import icon3 from "../../assets/icon3.png";
import { useNavigate } from "react-router-dom";

const PremiumServices = ({ content }) => {
	const navigate = useNavigate();

	const title = content?.title ?? "Premium Services";
	const subtitle =
		content?.subtitle ??
		"Unlock the full potential of your spaces with our comprehensive premium Vastu consultation services.";
	return (
		<>
			{" "}
			<section className="py-8 sm:py-10 bg-white text-center">
				<div className="max-w-7xl mx-auto px-4 sm:px-6">
					{/* Header */}
					<div className="mb-8 sm:mb-12">
						<h2 className="text-2xl sm:text-3xl font-bold text-black">
							{title}
						</h2>
						<p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-2 max-w-2xl mx-auto px-4">
							{subtitle}
						</p>
					</div>

					{/* Cards Grid */}
					<div className="flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-6">
						{[
							{
								title: "Vastu Consultation",
								color: "from-orange-600 to-orange-400",
								text: "text-orange-600",
								icon: icon2,
								path: "/vastu-consultation",
							},
							{
								title: "Astrology Consultation",
								color: "from-blue-600 to-blue-400",
								text: "text-blue-600",
								icon: icon3,
								path: "/astrology-consultation",
							},
							{
								title: "Numero Vastu Consultation",
								color: "from-red-600 to-red-400",
								text: "text-red-600",
								icon: icon1,
								path: "/numerologyconsultation",
							},
							{
								title: "Logo Designing Consultation",
								color: "from-green-600 to-green-400",
								text: "text-orange-600",
								icon: icon2,
								path: "/services",
							},
						].map(({ title, color, text, icon, path }) => (
							<div
								key={title}
								className={`relative w-full sm:w-[calc(50%-0.5rem)] md:w-[260px] lg:w-[280px] p-5 sm:p-6 rounded-3xl text-white bg-gradient-to-br ${color} shadow-lg transform transition-transform hover:-translate-y-2 hover:scale-105 overflow-hidden`}
							>
								<div className="h-[120px] w-[120px] sm:h-[150px] sm:w-[150px] absolute -top-[10%] -left-[10%] rounded-full bg-white/20" />
								<div className="h-[60px] w-[60px] sm:h-[75px] sm:w-[75px] absolute -bottom-[10%] -right-[10%] rounded-full bg-white/20" />
								{/* Content */}
								<div className="relative z-10 flex flex-col justify-between h-full">
									<div className="text-4xl mb-4 flex flex-col items-center gap-3 sm:gap-4">
										<img src={icon} alt="" className="h-[50px] sm:h-[60px]" />
										<h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 px-2">
											{title}
										</h3>
									</div>
									<button
										onClick={() => navigate(path)}
										className={`get-btn bg-white px-5 sm:px-6 py-2 rounded-[10px] font-bold flex items-center justify-center transition-transform hover:scale-105 mx-auto cursor-pointer text-sm sm:text-base ${text}`}
									>
										Get <span className="ml-2 font-bold">→</span>
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
};

export default PremiumServices;
