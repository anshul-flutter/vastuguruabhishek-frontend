import { RiProgress7Line } from "react-icons/ri";
import { TbAlertCircleFilled, TbHelpSquareFilled } from "react-icons/tb";
import { TiImage } from "react-icons/ti";

function LowerPart() {
	const stats = [
		{
			icon: <TiImage size={22} color="red" />,
			bgColor: "bg-[#FFB3AD]",
			label: "Videos Watched",
			value: "14 / 18",
		},
		{
			icon: <TbHelpSquareFilled size={22} color="red" />,
			bgColor: "bg-[#FFB3AD]",
			label: "Quizzes Completed",
			value: "4 / 5",
		},
		{
			icon: <RiProgress7Line size={22} color="red" />,
			bgColor: "bg-[#FFB3AD]",
			label: "Progress",
			value: "78%",
		},
		{
			icon: <TbAlertCircleFilled size={22} color="red" />,
			bgColor: "bg-[#FFB3AD]",
			label: "Status",
			value: "on Track",
			valueColor: "text-[#078B00]",
		},
	];

	return (
		<div className="flex flex-col lg:flex-row gap-6 sm:gap-6">
			{/* Left Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-[352px]">
				{stats.map((stat, idx) => (
					<div
						key={idx}
						className="border border-[#E1E1E1] bg-[#F8F8F8] shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-xl p-3 flex flex-col gap-2 items-start"
					>
						<div
							className={`w-[49px] h-[49px] flex items-center justify-center rounded ${stat.bgColor}`}
						>
							{stat.icon}
						</div>
						<p className="text-[13px] font-[400]">{stat.label}</p>
						<p className={`text-[18px] font-[590] ${stat.valueColor || ""}`}>
							{stat.value}
						</p>
					</div>
				))}
			</div>

			{/* Right Graph */}
			<div className="relative border border-[#E1E1E1] bg-[#F8F8F8] rounded-xl p-4 flex-1 flex justify-center items-center shadow-[0_0_15px_0_rgba(0,0,0,0.10)] w-full max-w-full">
				<div className="relative w-full">
					<img
						src="/images/Graph.png"
						alt="Graph"
						className="w-full h-auto object-contain"
					/>
					<div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between pointer-events-none z-10">
						{[...Array(5)].map((_, i) => (
							<div
								key={i}
								className="border-t border-dashed border-[rgba(0,0,0,0.16)] w-full"
							></div>
						))}
						<div className="border-t border-[rgba(0,0,0,0.16)] w-full"></div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LowerPart;
