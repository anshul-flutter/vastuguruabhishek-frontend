import StatusSection from "./StatusSection";
import { GoGlobe } from "react-icons/go";

// Product Management Component
function ProductManagement() {
	return (
		<>
			<StatusSection />

			<div className="flex flex-col items-start gap-5 sm:gap-[30px] px-3 sm:p-[15px] mt-5">
				{/* Heading */}
				<div className="w-full">
					<p className="text-[18px] sm:text-[20px] font-semibold leading-[24px] sm:leading-[26px]">
						Payment Status
					</p>
				</div>

				{/* Booking Details */}
				<div className="flex py-2.5 justify-center items-center w-full rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
					<div className="flex flex-col text-center gap-[7px] px-4">
						<p className="text-[12px] sm:text-[14px] font-normal leading-[16px] sm:leading-[18px] text-black/60">
							Booking Details
						</p>
						<p className="text-[14px] sm:text-[16px] font-medium leading-[18px] sm:leading-[21px]">
							ID: CNST-5521
						</p>
						<p className="text-[20px] sm:text-[24px] font-semibold leading-[26px] sm:leading-[31px]">
							₹899
						</p>
					</div>
				</div>

				{/* Details Section - Mobile Stack, Desktop Side by Side */}
				<div className="w-full">
					{/* Mobile Layout */}
					<div className="flex flex-col gap-4 sm:hidden">
						<div className="flex justify-between items-center">
							<div className="flex items-center gap-[5px]">
								<GoGlobe size={13} />
								<p className="text-[14px] font-normal leading-[18px] text-black/70">
									Student Name:
								</p>
							</div>
							<p className="text-[14px] font-medium leading-[18px]">
								Swati Joshi
							</p>
						</div>

						<div className="flex justify-between items-center">
							<div className="flex items-center gap-[5px]">
								<GoGlobe size={13} />
								<p className="text-[14px] font-normal leading-[18px] text-black/70">
									Astrologer Name:
								</p>
							</div>
							<p className="text-[14px] font-medium leading-[18px]">
								Rahul Mehta
							</p>
						</div>

						<div className="flex justify-between items-center">
							<div className="flex items-center gap-[5px]">
								<GoGlobe size={13} />
								<p className="text-[14px] font-normal leading-[18px] text-black/70">
									Fee:
								</p>
							</div>
							<p className="text-[14px] font-medium leading-[18px]">₹899</p>
						</div>

						<div className="flex justify-between items-center">
							<div className="flex items-center gap-[5px]">
								<GoGlobe size={13} />
								<p className="text-[14px] font-normal leading-[18px] text-black/70">
									Payment Date:
								</p>
							</div>
							<p className="text-[14px] font-medium leading-[18px]">Jul 14</p>
						</div>

						<div className="flex justify-between items-center">
							<div className="flex items-center gap-[5px]">
								<GoGlobe size={13} />
								<p className="text-[14px] font-normal leading-[18px] text-black/70">
									Payable Time:
								</p>
							</div>
							<p className="text-[14px] font-medium leading-[18px]">5:00 PM</p>
						</div>

						<div className="flex justify-between items-center">
							<div className="flex items-center gap-[5px]">
								<GoGlobe size={13} />
								<p className="text-[14px] font-normal leading-[18px] text-black/70">
									Status:
								</p>
							</div>
							<p className="text-[14px] font-medium leading-[18px] text-[#BB0E00]">
								Not Paid
							</p>
						</div>
					</div>

					{/* Desktop Layout */}
					<div className="hidden sm:flex justify-between items-start w-full">
						{/* Left Labels */}
						<div className="flex flex-col items-start gap-[25px]">
							<div className="flex items-center gap-[5px]">
								<GoGlobe size={15} />
								<p className="text-[16px] lg:text-[18px] font-normal leading-[20px] lg:leading-[23px] text-black/70">
									Student Name:
								</p>
							</div>
							<div className="flex items-center gap-[5px]">
								<GoGlobe size={15} />
								<p className="text-[16px] lg:text-[18px] font-normal leading-[20px] lg:leading-[23px] text-black/70">
									Astrologer Name:
								</p>
							</div>
							<div className="flex items-center gap-[5px]">
								<GoGlobe size={15} />
								<p className="text-[16px] lg:text-[18px] font-normal leading-[20px] lg:leading-[23px] text-black/70">
									Fee:
								</p>
							</div>
							<div className="flex items-center gap-[5px]">
								<GoGlobe size={15} />
								<p className="text-[16px] lg:text-[18px] font-normal leading-[20px] lg:leading-[23px] text-black/70">
									Payment Date:
								</p>
							</div>
							<div className="flex items-center gap-[5px]">
								<GoGlobe size={15} />
								<p className="text-[16px] lg:text-[18px] font-normal leading-[20px] lg:leading-[23px] text-black/70">
									Payable Time:
								</p>
							</div>
							<div className="flex items-center gap-[5px]">
								<GoGlobe size={15} />
								<p className="text-[16px] lg:text-[18px] font-normal leading-[20px] lg:leading-[23px] text-black/70">
									Status:
								</p>
							</div>
						</div>

						{/* Right Values */}
						<div className="flex flex-col items-end gap-[25px]">
							<div>
								<p className="text-[16px] lg:text-[18px] font-medium leading-[20px] lg:leading-[23px]">
									Swati Joshi
								</p>
							</div>
							<div>
								<p className="text-[16px] lg:text-[18px] font-medium leading-[20px] lg:leading-[23px]">
									Rahul Mehta
								</p>
							</div>
							<div>
								<p className="text-[16px] lg:text-[18px] font-medium leading-[20px] lg:leading-[23px]">
									₹899
								</p>
							</div>
							<div>
								<p className="text-[16px] lg:text-[18px] font-medium leading-[20px] lg:leading-[23px]">
									Jul 14
								</p>
							</div>
							<div>
								<p className="text-[16px] lg:text-[18px] font-medium leading-[20px] lg:leading-[23px]">
									5:00 PM
								</p>
							</div>
							<div>
								<p className="text-[16px] lg:text-[18px] font-medium leading-[20px] lg:leading-[23px] text-[#BB0E00]">
									Not Paid
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Payment Buttons */}
				<div className="flex flex-col items-start gap-[15px] w-full">
					<button className="w-full h-[45px] sm:h-[50px] flex justify-center items-center border border-[#BB0E00] rounded-[5px] shadow-[inset_0_4px_12.4px_rgba(255,255,255,0.25)] text-white text-[14px] sm:text-[15px] font-semibold bg-gradient-to-b from-[#BB0E00] to-[#B94400]">
						Send Payment Link
					</button>
					<button className="w-full h-[45px] sm:h-[50px] flex justify-center items-center border border-[#BB0E00] rounded-[5px] shadow-[inset_0_4px_12.4px_rgba(255,255,255,0.25)] text-[#BB0E00] text-[14px] sm:text-[15px] font-semibold bg-white">
						Mark as Paid
					</button>
				</div>
			</div>
		</>
	);
}

export default ProductManagement;
