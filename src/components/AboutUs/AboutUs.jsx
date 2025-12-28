import { useAboutQuery } from "../../hooks/useContentApi";
import { MdCall } from "react-icons/md";
import { IoMdMail } from "react-icons/io";
import { GoDotFill } from "react-icons/go";

import aboutus from "../../assets/about.jpg";

export default function AboutUs() {
	// Fetch about data using React Query
	const { data: aboutData, isLoading: loading } = useAboutQuery();

	if (loading) return <p className="text-center py-10">Loading...</p>;
	if (!aboutData) return <p className="text-center py-10">No data found</p>;

	return (
		<section
			className="min-h-screen flex flex-col gap-4 px-4 py-6 mx-[1.5rem]"
			style={{ paddingTop: "83px" }}
		>
			<div className="flex flex-col md:flex-row gap-8">
				{/* Image */}
				<div className="border red-shadow relative w-full sm:w-[280px] h-[200px] sm:h-[250px] flex-shrink-0 rounded-md overflow-hidden border-[#DCDCDC]">
					<img
						src={aboutData.image || aboutus}
						alt="About Vastu Abhishek"
						className="w-full h-full object-cover"
					/>
				</div>

				{/* About Content */}
				<article className="flex-1 flex flex-col gap-2">
					<h2 className="text-[18px] sm:text-[20px] font-medium">
						About{" "}
						<span className="text-[#C71210] font-semibold">Vastu Abhishek</span>
					</h2>

					<p className="text-[13px] sm:text-[14px] text-black/70 leading-[1.4]">
						{aboutData.description}
					</p>

					{/* Services */}
					<section className="flex flex-col gap-1">
						<h3 className="text-[18px] sm:text-[18px] text-gray-700 font-semibold ">
							Services
						</h3>
						<div className="flex flex-col gap-1 sm:gap-2">
							{aboutData.services.map((service, idx) => (
								<div
									key={idx}
									className="flex items-center gap-[5px] text-[13px] sm:text-[14px] text-black/70 font-medium break-words"
								>
									<GoDotFill size={12} />
									{service}
								</div>
							))}
						</div>
					</section>
				</article>
			</div>

			{/* Contact Info */}
			<section className="flex flex-col gap-3 sm:gap-4">
				{/* Phone */}
				<div className="w-full p-2 bg-[#fbfbfb] shadow-[0_0_14.7px_rgba(0,0,0,0.08)] rounded-[15px] outline outline-[#EEEEEE] outline-offset-[-1px] flex items-center gap-3 sm:gap-4">
					<div className="w-[40px] h-[40px] sm:w-[49px] sm:h-[49px] bg-[#FFD7D4] rounded-[10px] flex justify-center items-center">
						<MdCall size={24} className="text-[#C71210]" />
					</div>
					<div>
						<p className="text-[11px] sm:text-[12px] text-black/56 leading-[20px]">
							Our 24/7 customer services
						</p>
						<p className="text-[#C71210] text-[14px] sm:text-[16px] font-[510] leading-[20px]">
							{aboutData.customerCareNumber}
						</p>
					</div>
				</div>

				{/* Email */}
				<div className="w-full p-2 bg-[#fbfbfb] shadow-[0_0_14.7px_rgba(0,0,0,0.08)] rounded-[15px] outline outline-[#EEEEEE] outline-offset-[-1px] flex items-center gap-3 sm:gap-4">
					<div className="w-[40px] h-[40px] sm:w-[49px] sm:h-[49px] bg-[#FFD7D4] rounded-[10px] flex justify-center items-center">
						<IoMdMail size={24} className="text-[#C71210]" />
					</div>
					<div>
						<p className="text-[11px] sm:text-[12px] text-black/56 leading-[20px]">
							Write Us at
						</p>
						<p className="text-[#C71210] text-[14px] sm:text-[16px] font-[510] leading-[20px]">
							{aboutData.contactEmail}
						</p>
					</div>
				</div>
			</section>
		</section>
	);
}
