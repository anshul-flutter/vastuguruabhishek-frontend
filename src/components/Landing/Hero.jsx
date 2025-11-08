import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useBannersQuery } from "../../hooks/useBannersApi";

import "swiper/css";
import "swiper/css/pagination";

const Hero = () => {
	const { data: banners = [], isLoading, error } = useBannersQuery();

	// Function to get button text color based on background
	const getButtonTextColor = (background) => {
		// For gradients, use a dark color that provides good contrast on white button
		if (background && background.includes("gradient")) {
			// Check the gradient colors to determine the best contrast
			if (background.includes("#667eea") || background.includes("#764ba2")) {
				return "#4c51bf"; // Indigo for blue-purple gradient
			}
			if (background.includes("#f093fb") || background.includes("#f5576c")) {
				return "#d53f8c"; // Pink for pink gradient
			}
			if (background.includes("#4facfe") || background.includes("#00f2fe")) {
				return "#3182ce"; // Blue for cyan gradient
			}
			if (background.includes("#43e97b") || background.includes("#38f9d7")) {
				return "#38a169"; // Green for green gradient
			}
			// Default for unknown gradients
			return "#2d3748";
		}
		// If it's a solid color, use it
		if (background && background.startsWith("#")) {
			return background;
		}
		// Default fallback
		return "#bb1401";
	};

	// Loading state
	if (isLoading) {
		return (
			<section className="py-8 sm:py-12 md:py-16">
				<div className="min-h-[300px] sm:min-h-[350px] md:h-[400px] flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 text-white">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
						<p className="text-lg">Loading banners...</p>
					</div>
				</div>
			</section>
		);
	}

	// Error state
	if (error) {
		return (
			<section className="py-8 sm:py-12 md:py-16">
				<div className="min-h-[300px] sm:min-h-[350px] md:h-[400px] flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 text-white">
					<div className="text-center">
						<p className="text-lg mb-4">Unable to load banners</p>
						<p className="text-sm opacity-75">Please try refreshing the page</p>
					</div>
				</div>
			</section>
		);
	}

	// No banners state
	if (!banners || banners.length === 0) {
		return (
			<section className="py-8 sm:py-12 md:py-16">
				<div className="min-h-[300px] sm:min-h-[350px] md:h-[400px] flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 text-white">
					<div className="text-center">
						<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
							Welcome to Vastu Abhishek
						</h1>
						<p className="text-lg sm:text-xl opacity-90 mb-6">
							Discover the ancient wisdom of Vastu, Astrology, and Palmistry
						</p>
						<button className="bg-white text-red-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
							Explore Services
						</button>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section>
			<Swiper
				modules={[Autoplay, Pagination]}
				spaceBetween={30}
				slidesPerView={1}
				autoplay={{ delay: 3000, disableOnInteraction: false }}
				pagination={{ clickable: true }}
				loop={true}
				className="w-full"
			>
				{banners.map((slide) => (
					<SwiperSlide key={slide._id}>
						{slide.isFullImageBanner && slide.image ? (
							// Full Image Banner Mode
							<div className="h-[30vh] sm:h-[40vh] md:h-[70vh] w-screen relative overflow-hidden">
								<img
									src={slide.image}
									alt={slide.title || "Banner"}
									className="w-full h-full object-fill"
									loading="lazy"
								/>
							</div>
						) : (
							// Default Banner Mode with Text and Image
							<div
								className="h-[30vh] sm:h-[40vh] md:h-[70vh] w-screen py-8 sm:py-12 md:py-16 flex flex-col md:flex-row items-center text-white justify-between gap-6 sm:gap-8 md:gap-16 lg:gap-20 px-4 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden"
								style={{
									background: slide.background, // directly use color hex from API
								}}
							>
								<div className="bg-transparent w-full md:w-auto">
									<div className="w-full max-w-full md:max-w-[600px]">
										<h1 className="text-xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
											{slide.title}
										</h1>
										<p className="text-xs sm:text-base md:text-lg opacity-90 leading-relaxed max-w-2xl mb-6 sm:mb-8">
											{slide.description}
										</p>
										{slide.buttonText && (
											<button
												className="bg-white cursor-pointer px-6 sm:px-8 py-2 rounded-md text-sm sm:text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
												style={{
													color: getButtonTextColor(slide.background),
												}}
											>
												{slide.buttonText}
											</button>
										)}
									</div>
								</div>

								{slide.image && (
									<div className="hidden md:block flex-shrink-0">
										<img
											src={slide.image}
											alt="Hero Slide"
											className="object-contain h-[250px] w-[250px] lg:h-[350px] lg:w-[350px]"
											loading="lazy"
										/>
									</div>
								)}
							</div>
						)}
					</SwiperSlide>
				))}
			</Swiper>
		</section>
	);
};

export default Hero;
