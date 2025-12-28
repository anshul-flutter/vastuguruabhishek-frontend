import {
	IoCalendarClearOutline,
	IoTicketOutline,
	IoQrCodeSharp,
} from "react-icons/io5";
import { TiLocationOutline } from "react-icons/ti";
import { AiOutlineInstagram, AiOutlineTwitter } from "react-icons/ai";
import { BiLogoWhatsapp, BiLogoFacebookCircle } from "react-icons/bi";

// Event Payment Management Component
function EventPaymentManagement() {
	return (
		<div className="min-h-screen">
			{/* Main Section */}
			<section className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-[35px] mt-4 lg:mt-[70px] px-2 sm:px-4 lg:ml-[45px]">
				{/* Left Panel - Ticket */}
				<article className="relative border border-[#fbdfdf] w-full max-w-[320px] sm:max-w-[352px] h-auto lg:h-[447px] bg-[#f9f5f5]">
					<header className="flex flex-col gap-3 lg:gap-[15px] w-full px-3 lg:px-[15px] pt-4 lg:pt-[26px] pb-8 lg:pb-[180px]">
						<h2 className="text-base sm:text-lg lg:text-[20px] font-semibold leading-tight lg:leading-[26px]">
							Full Moon Healing Meditation
						</h2>
						<div className="flex items-center gap-2 lg:gap-[10px] text-xs sm:text-sm lg:text-[14px]">
							<IoCalendarClearOutline className="w-4 h-4 lg:w-5 lg:h-5" />
							<span>Jul 18, 2025 | 8:00 PM</span>
						</div>
						<div className="flex items-center gap-2 lg:gap-[10px] text-xs sm:text-sm lg:text-[14px]">
							<TiLocationOutline className="w-4 h-4 lg:w-5 lg:h-5" />
							<span>Online (ZOOM)</span>
						</div>
						<div className="flex items-center gap-2 lg:gap-[10px] text-xs sm:text-sm lg:text-[14px]">
							<IoTicketOutline className="w-4 h-4 lg:w-5 lg:h-5" />
							<span>2 VIP Tickets</span>
						</div>
					</header>

					<hr className="w-[90%] lg:w-[322px] h-[1px] bg-[#c7c7c7] mx-auto" />

					<footer className="w-[90%] lg:w-[322px] mx-auto my-3 lg:my-[15px] mb-4 lg:mb-[20px] flex justify-between items-start">
						<p className="text-sm lg:text-[15px] font-medium leading-tight lg:leading-[20px]">
							Total Payable Amount
						</p>
						<div className="flex flex-col items-end gap-1 lg:gap-[2px]">
							<p className="text-lg lg:text-[20px] font-semibold leading-tight lg:leading-[26px]">
								₹4299
							</p>
							<p className="text-xs lg:text-[12px] font-medium text-[#189200]">
								Paid
							</p>
						</div>
					</footer>

					{/* Decorative dots */}
					<div className="absolute w-[358px] top-[-4px] left-1/2 -translate-x-1/2 pointer-events-none">
						<div className="flex justify-between">
							<span
								className="h-[30px] w-[30px] rounded-full border bg-[#FCFCFC]"
								style={{
									borderColor: "transparent #fbdfdf #fbdfdf transparent",
								}}
							></span>
							<span
								className="h-[30px] w-[30px] rounded-full border bg-[#FCFCFC]"
								style={{
									borderColor: "transparent transparent #fbdfdf #fbdfdf",
								}}
							></span>
						</div>
					</div>

					<div className="absolute w-[355px] bottom-[-25px] left-[-5px]">
						<div className="flex flex-row">
							{Array.from({ length: 12 }).map((_, i) => (
								<span
									key={i}
									className="h-[30px] w-[30px] rounded-full border bg-[#FCFCFC]"
									style={{
										borderColor: "#fbdfdf transparent transparent transparent",
									}}
								></span>
							))}
						</div>
					</div>
				</article>

				{/* Add vertical space when flex-col (small screens) */}
				<div className="lg:hidden h-6"></div>

				{/* Right Panel - QR Code */}
				<aside className="relative border border-[#fbdfdf] w-full max-w-[320px] sm:max-w-[500px] lg:max-w-[884px] h-auto lg:h-[447px] bg-[#f9f5f5]">
					<div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center w-full max-w-[290px] sm:max-w-[460px] lg:max-w-[790px] mx-auto mt-8 lg:mt-[100px] px-4 lg:px-0 pb-8 lg:pb-0">
						<div className="text-center mb-6 lg:mb-0">
							<IoQrCodeSharp
								size={
									window.innerWidth < 640
										? 150
										: window.innerWidth < 1024
										? 180
										: 230
								}
							/>
							<p className="mt-2 lg:mt-[10px] text-xs sm:text-sm lg:text-[14px] px-2">
								Lorem ipsum dolor sit, amet consectetur adipisicing
							</p>
						</div>

						<div className="w-full max-w-[280px] lg:max-w-[314px] flex flex-col items-center lg:mt-[50px] gap-2 lg:gap-[8px]">
							<p className="text-sm lg:text-base">Invite friends via</p>
							<div className="flex items-center justify-center h-[40px] lg:h-[48px] gap-2 lg:gap-[7px] mt-2 lg:mt-[8px]">
								<AiOutlineInstagram
									size={30}
									color="#D266A8"
									className="lg:w-[37px] lg:h-[37px]"
								/>
								<BiLogoFacebookCircle
									size={30}
									color="blue"
									className="lg:w-[37px] lg:h-[37px]"
								/>
								<BiLogoWhatsapp
									size={30}
									color="#61FD7D"
									className="lg:w-[37px] lg:h-[37px]"
								/>
								<AiOutlineTwitter
									size={30}
									color="#1EA1F2"
									className="lg:w-[37px] lg:h-[37px]"
								/>
							</div>
							<div className="w-full mt-6 lg:mt-[37px] py-3 lg:py-[15px] rounded-[5px]  text-center">
								<button className="text-white font-medium text-sm bg-[#ba2300] lg:text-base">
									Confirm & Update
								</button>
							</div>
						</div>
					</div>

					{/* Decorative dots */}
					<div className="absolute w-[900px] bottom-[-9px] left-[-10px]">
						<div className="flex justify-between">
							<span
								className="h-[40px] w-[40px] rounded-full border bg-[#FCFCFC]"
								style={{
									borderColor: "#fbdfdf #fbdfdf transparent transparent",
								}}
							></span>
							<span
								className="h-[40px] w-[40px] rounded-full border bg-[#FCFCFC]"
								style={{
									borderColor: "#fbdfdf transparent transparent #fbdfdf",
								}}
							></span>
						</div>
					</div>

					<div className="absolute w-[900px] top-[-80px] left-[-10px]">
						<div className="flex flex-row">
							{Array.from({ length: 13 }).map((_, i) => (
								<span
									key={i}
									className="h-[90px] w-[70px] rounded-full border bg-[#FCFCFC]"
									style={{
										borderColor: "transparent transparent #fbdfdf transparent",
									}}
								></span>
							))}
						</div>
					</div>
				</aside>
			</section>
			<br /> <br />
			<p className="text-center text-[13px] font-medium text-black/60 mt-6 sm:text-[15px] sm:mt-[30px] font-['SF_Pro']">
				@ 2025 Vastu Abhishek, All rights reserved.
			</p>
		</div>
	);
}

export default EventPaymentManagement;
