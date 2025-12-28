import React from "react";
import serviceImg from "../../assets/services.png";

const services = Array(12).fill({
	title: "Name Numerology",
	description:
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.",
	price: "₹ 5,000.0",
	image: serviceImg,
});

export default function Services() {
	return (
		<div className="px-6 md:px-12 py-6">
			<h2 className="text-2xl font-bold mb-5 ">Our Best of Services</h2>

			<div className="flex flex-wrap justify-between gap-5">
				{services.map((service, index) => (
					<div
						key={index}
						className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition 
                       w-full sm:w-[48%] md:w-[31%] lg:w-[23%] border border-transparent 
                       hover:border-[#e5e5e5]"
					>
						<img
							src={service.image}
							alt={service.title}
							className="w-full h-40 object-cover"
						/>
						<div className="p-3">
							<h3 className="font-semibold text-[15px]">{service.title}</h3>
							<p className="text-gray-600 text-[16px] mt-0">
								{service.description}
							</p>
							<div className="h-5 w-6 text-red-700"></div>
							<div className="border-t border-gray-300 mt-0 pt-3 flex items-center justify-between">
								<span className="font-bold text-gray-800">{service.price}</span>
								<button
									className="bg-gradient-to-b from-[#C71210] to-[#B94400] 
                             text-white text-sm px-4 py-2 rounded-lg 
                             shadow-inner hover:opacity-90 transition"
								>
									Book Service
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
