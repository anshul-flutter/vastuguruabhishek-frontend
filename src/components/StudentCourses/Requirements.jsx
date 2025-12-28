import React from "react";
import { BsDot } from "react-icons/bs";

const Requirements = ({ crsDetails }) => {
	return (
		<div className="w-full mt-6">
			<h2 className="text-[1.25rem] font-semibold mb-3">Requirements</h2>
			<ul className="space-y-1">
				{(crsDetails?.requirements ?? []).map((item, idx) => (
					<li key={idx} className="flex items-center text-gray-800">
						<BsDot size={24} className="text-gray-500" />
						{item}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Requirements;
