import { BsThreeDotsVertical } from "react-icons/bs";
import LowerPart from "./LowerPart";

// Student Progress Tracking Component
function StudentProgressTracking() {
	return (
		<>
			<div className="w-full max-w-[full] flex flex-col gap-6 bg-[#FFF] p-4 md:p-6 rounded-lg">
				{/* Header */}
				<div className="relative flex flex-col p-4 border bg-[#F8F8F8] border-[#E1E1E1] rounded-xl">
					{/* Profile row */}
					<div className="inline-flex items-center gap-[15px]">
						<div className="rounded-full overflow-hidden">
							<img
								src="/images/Girl.png"
								width={74}
								height={74}
								alt="Student"
							/>
						</div>
						<div>
							<p className="font-[590] text-[16px] font-sans">
								Aditi R. Sharma
							</p>
							<p className="font-[510] text-[11px] leading-[14px] font-sans">
								ID: STU-2025-0378
							</p>
							<p className="font-[510] text-[12px] leading-[16px] font-sans">
								Advanced Vedic Astrology
							</p>
						</div>
					</div>

					{/* Icon */}
					<BsThreeDotsVertical
						className="absolute top-[10px] right-[10px] cursor-pointer"
						size={16}
					/>
				</div>

				{/* Lower Part */}
				<LowerPart />
			</div>
			<br /> <br />
			<div className="w-full max-w-[full] flex flex-col gap-6 bg-[#FFF] p-4 md:p-6 rounded-lg">
				{/* Header */}
				<div className="relative flex flex-col p-4 border bg-[#F8F8F8] border-[#E1E1E1] rounded-xl">
					{/* Profile row */}
					<div className="inline-flex items-center gap-[15px]">
						<div className="rounded-full overflow-hidden">
							<img
								src="/images/Girl.png"
								width={74}
								height={74}
								alt="Student"
							/>
						</div>
						<div>
							<p className="font-[590] text-[16px] font-sans">
								Aditi R. Sharma
							</p>
							<p className="font-[510] text-[11px] leading-[14px] font-sans">
								ID: STU-2025-0378
							</p>
							<p className="font-[510] text-[12px] leading-[16px] font-sans">
								Advanced Vedic Astrology
							</p>
						</div>
					</div>

					{/* Icon */}
					<BsThreeDotsVertical
						className="absolute top-[10px] right-[10px] cursor-pointer"
						size={16}
					/>
				</div>

				{/* Lower Part */}
				<LowerPart />
			</div>
		</>
	);
}

export default StudentProgressTracking;
