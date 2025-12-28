import React from "react";

function VastuAbhishekCard() {
	return (
		<div className="flex flex-col md:flex-row justify-between bg-[#FCFCFC] ml-[15px]">
			{/* Left Section */}
			<div className="w-full md:w-[356px] h-auto md:h-[355px]">
				<img
					src="/images/AstroVastuCard.png"
					alt="Astro Vastu"
					className="w-full h-auto md:h-[355px] object-cover"
				/>
			</div>

			{/* Right Section */}
			<div className="w-full md:w-[692px] h-auto md:h-[416px] flex flex-col items-start justify-between">
				{/* Heading */}
				<div>
					<p className="text-[22px] not-italic font-[550] leading-normal">
						About{" "}
						<span className="bg-[linear-gradient(93deg,#610908_11.86%,#C71210_31.18%,#610908_49.22%,#C71210_63.62%,#610908_76.23%,#C71210_86.55%,#C71210_97.94%)] bg-clip-text text-transparent font-[590]">
							Vastu Abhishek
						</span>
					</p>
				</div>

				{/* Description */}
				<div>
					<p className="text-[16px] font-[500] leading-[22px] text-[rgba(0,0,0,0.70)]">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat. Duis aute irure dolor in
						reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
						pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
						culpa qui officia deserunt mollit anim id est laborum.
					</p>
				</div>

				{/* Services */}
				<div className="flex flex-col items-start gap-[20px] mt-[10px]">
					<div>
						<p className="text-[25px] not-italic font-[560] leading-normal">
							Services
						</p>
					</div>
					<div className="ml-[30px]">
						<ul className="list-disc flex flex-col items-start gap-[15px]">
							<li className="text-[18px] font-[500] leading-normal text-[rgba(0,0,0,0.70)]">
								Lorem ipsum dolor sit amet
							</li>
							<li className="text-[18px] font-[500] leading-normal text-[rgba(0,0,0,0.70)]">
								Lorem ipsum dolor sit amet
							</li>
							<li className="text-[18px] font-[500] leading-normal text-[rgba(0,0,0,0.70)]">
								Lorem ipsum dolor sit amet
							</li>
							<li className="text-[18px] font-[500] leading-normal text-[rgba(0,0,0,0.70)]">
								Lorem ipsum dolor sit amet
							</li>
							<li className="text-[18px] font-[500] leading-normal text-[rgba(0,0,0,0.70)]">
								Lorem ipsum dolor sit amet
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

export default VastuAbhishekCard;
