import React from "react";
import { FaClipboardCheck, FaGraduationCap, FaRegClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import StatsChart from "./StatsChart";
import UpcomingSessions from "./UpcomingSessions";
import { BsThreeDotsVertical } from "react-icons/bs";
import Courses from "./Courses";

const courseStats = [
	{
		id: 1,
		title: "Total Courses",
		count: 3,
		label: "Course",
		icon: <FaGraduationCap className="text-[#bb1201]" size={"2.75rem"} />,
		actionText: "Learn more",
		actionLink: "/courses",
		bgColor: "bg-red-100",
	},
	{
		id: 2,
		title: "Ongoing Course",
		count: 2,
		label: "Course",
		icon: <FaRegClock className="text-[#bb1201]" size={"2.75rem"} />,
		actionText: "Continue",
		actionLink: "/courses/ongoing",
		bgColor: "bg-red-100",
	},
	{
		id: 3,
		title: "Completed Courses",
		count: 1,
		label: "Course",
		icon: <FaClipboardCheck className="text-[#bb1201]" size={"2.75rem"} />,
		actionText: "View",
		actionLink: "/courses/completed",
		bgColor: "bg-red-100",
	},
];
const AstrologerDashboard = () => {
	const navigate = useNavigate();
	return (
		<>
			<div className="mx-[1.5rem] my-[1rem]">
				<h2 className="font-semibold text-[1.25rem] mb-[1rem]">Overview</h2>

				<div className="flex gap-[2rem] max-[1000px]:flex-col">
					<div className="flex flex-col gap-[1rem]">
						<div className="flex items-center gap-x-[2rem] gap-y-[1rem] flex-wrap">
							{courseStats.map((item) => (
								<div className="flex items-center border border-gray-300 rounded-xl gap-[1rem] p-4 flex-1 bg-[#fbfbfb] whitespace-nowrap">
									<span className="flex items-center justify-center h-[100px] w-[100px] rounded-lg bg-[#ffd7d4]">
										{item.icon}
									</span>
									<div className="">
										<p className="text-sm text-gray-600">{item.title}</p>
										<p className="font-semibold text-gray-800 text-[1.25rem]">
											{item.count} courses
										</p>
										<button
											className="text-[#bb1201] cursor-pointer font-semibold text-sm"
											onClick={() => navigate(item.actionLink)}
										>
											{item.actionText}
										</button>
									</div>
								</div>
							))}
						</div>
						<div className="">
							<div className="flex justify-between items-center mb-[1rem]">
								<h2 className="font-semibold text-gray-800 text-[1.15rem]">
									Activity Graph
								</h2>
								<BsThreeDotsVertical />
							</div>
							<StatsChart />
						</div>
					</div>
					<UpcomingSessions />
				</div>
			</div>
			<Courses />
		</>
	);
};

export default AstrologerDashboard;
