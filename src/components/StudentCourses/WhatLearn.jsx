import React from "react";
import { FaCheck } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";

const WhatLearn = ({ crsDetails }) => {
	return (
		<div className="w-full border p-4 rounded-xl border-gray-300 bg-white">
			<h2 className="text-[1.25rem] font-semibold mb-[1rem]">
				What You'll Learn
			</h2>
			<ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-[2rem] gap-y-[0.75rem]">
				{(crsDetails?.whatYouWillLearn ?? []).map((item, idx) => (
					<li key={idx} className="flex gap-2">
						<IoMdCheckmark className="text-[#BB0E00] mt-[2px]" />
						<span className="text-gray-800">{item}</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default WhatLearn;
