import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { IoIosArrowDown, IoMdDocument, IoMdMail } from "react-icons/io";
import { MdCall, MdPrivacyTip } from "react-icons/md";

export default function HelpSupport() {
	const [openIndex, setOpenIndex] = useState(null);

	const faqs = [
		{
			question: "What is Vastu Abhishek and how does it work?",
			answer:
				"Vastu Abhishek is a traditional ritual aimed at harmonizing living and working spaces with natural energies. It blends ancient Vedic wisdom with modern guidance for balance and prosperity.",
		},
		{
			question: "How long does a consultation take?",
			answer:
				"A typical Vastu consultation takes between 1 to 2 hours, depending on the size of the space and complexity of requirements.",
		},
		{
			question: "Do I need to prepare anything before the session?",
			answer:
				"We recommend keeping your floor plan ready and ensuring the area is accessible for observation and guidance.",
		},
		{
			question: "Can Vastu remedies be done without reconstruction?",
			answer:
				"Yes. Many Vastu corrections can be made using symbolic placements, color adjustments, and energy balancing without major construction.",
		},
		{
			question: "Do you offer online consultations?",
			answer:
				"Yes, we provide both in-person and online Vastu consultations for clients across the globe.",
		},
	];

	return (
		<section className="mx-[1.5rem] p-4 space-y-6">
			{/* Contact Cards */}
			<div className="space-y-4">
				<div className="w-full p-2 bg-[#fbfbfb] shadow-[0_0_14.7px_rgba(0,0,0,0.08)] rounded-[15px] outline outline-[#EEEEEE] outline-offset-[-1px] flex items-center gap-3 sm:gap-4">
					<div className="w-[40px] h-[40px] sm:w-[49px] sm:h-[49px] bg-[#FFD7D4] rounded-[10px] flex justify-center items-center">
						<MdCall size={24} className="text-[#C71210]" />
					</div>
					<div>
						<p className="text-[11px] sm:text-[12px] text-black/56 leading-[20px]">
							Our 24/7 customer services
						</p>
						<p className="text-[#C71210] text-[14px] sm:text-[16px] font-[510] leading-[20px]">
							+91 0099009990
						</p>
					</div>
				</div>
				<div className="w-full p-2 bg-[#fbfbfb] shadow-[0_0_14.7px_rgba(0,0,0,0.08)] rounded-[15px] outline outline-[#EEEEEE] outline-offset-[-1px] flex items-center gap-3 sm:gap-4">
					<div className="w-[40px] h-[40px] sm:w-[49px] sm:h-[49px] bg-[#FFD7D4] rounded-[10px] flex justify-center items-center">
						<IoMdMail size={24} className="text-[#C71210]" />
					</div>
					<div>
						<p className="text-[11px] sm:text-[12px] text-black/56 leading-[20px]">
							Write us at
						</p>
						<p className="text-[#C71210] text-[14px] sm:text-[16px] font-[510] leading-[20px]">
							vastuabhishek@gmail.com
						</p>
					</div>
				</div>
			</div>

			{/* FAQ Section */}
			<div>
				<h2 className="text-lg font-semibold mb-4">
					Frequently Asked Questions
				</h2>
				<div className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
					{faqs.map((faq, index) => (
						<div key={index}>
							<button
								className="w-full text-left p-4 flex justify-between items-center font-medium hover:bg-gray-50"
								onClick={() => setOpenIndex(openIndex === index ? null : index)}
							>
								<span>
									{index + 1}. {faq.question}
								</span>
								<IoIosArrowDown
									className={`h-5 w-5 transition-transform ${
										openIndex === index ? "rotate-180" : ""
									}`}
								/>
							</button>
							{openIndex === index && (
								<div className="p-4 pt-0 text-sm text-gray-600">
									{faq.answer}
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Legal Section */}
			<div className="">
				<h2 className="text-lg font-semibold mb-4">Legal</h2>
				<div className="w-full bg-[#fbfbfb] p-2 shadow-[0_0_14.7px_rgba(0,0,0,0.08)] rounded-[15px] outline outline-[#EEEEEE] outline-offset-[-1px] flex items-center gap-3 sm:gap-4">
					<div className="w-[40px] h-[40px] sm:w-[49px] sm:h-[49px] bg-[#FFD7D4] rounded-[10px] flex justify-center items-center">
						<MdPrivacyTip size={24} className="text-[#C71210]" />
					</div>
					<div>
						<p className="text-black leading-[20px]">Privacy Policy</p>
						<p className="text-black/60 text-[12px] leading-[20px]">
							Elective july 2025
						</p>
					</div>
				</div>
				<div className="w-full mt-4 bg-[#fbfbfb] p-2 shadow-[0_0_14.7px_rgba(0,0,0,0.08)] rounded-[15px] outline outline-[#EEEEEE] outline-offset-[-1px] flex items-center gap-3 sm:gap-4">
					<div className="w-[40px] h-[40px] sm:w-[49px] sm:h-[49px] bg-[#FFD7D4] rounded-[10px] flex justify-center items-center">
						<IoMdDocument size={24} className="text-[#C71210]" />
					</div>
					<div>
						<p className="text-black leading-[20px]">Terms & Conditions</p>
						<p className="text-black/60 text-[12px] leading-[20px]">
							Elective july 2025
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
