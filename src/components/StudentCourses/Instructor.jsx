import React from "react";
import { BsDot } from "react-icons/bs";

const Instructor = ({ instructor }) => {
	if (!instructor) {
		return (
			<div className="mx-[1.5rem]">
				<h2 className="text-[1.25rem] font-semibold">Instructor</h2>
				<p className="text-gray-500">No instructor information available.</p>
			</div>
		);
	}

	return (
		<div className="mx-[1.5rem]">
			<h2 className="text-[1.25rem] font-semibold">Instructor</h2>
			<p className="font-semibold text-[#BB0E00] mt-[.5rem]">
				{instructor.name}
			</p>
			<div className="my-[1rem] flex items-center gap-[2rem]">
				{instructor.profileImage && (
					<img
						src={instructor.profileImage}
						alt="profile"
						className="h-[100px] w-[100px] object-cover rounded-full border border-gray-300"
					/>
				)}
				{instructor.expertise && instructor.expertise.length > 0 && (
					<ul>
						{instructor.expertise.map((item, idx) => (
							<li key={idx} className="flex items-center">
								<BsDot size={24} />
								{item}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default Instructor;
