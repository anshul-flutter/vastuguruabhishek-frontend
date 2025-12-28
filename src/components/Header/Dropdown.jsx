import React, { useRef } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import useClickOutside from "../../hooks/useClickOutside";

const Dropdown = ({
	label,
	path,
	altPath,
	links,
	openDropdown,
	setOpenDropdown,
}) => {
	const location = useLocation();
	const navigate = useNavigate();
	const dropdownRef = useRef(null);

	useClickOutside(dropdownRef, () => setOpenDropdown(null));

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => {
					setOpenDropdown(
						openDropdown === label.toLowerCase() ? null : label.toLowerCase()
					);
				}}
				className={`transition-colors duration-300 flex gap-[5px] items-center ${
					location.pathname === path || location.pathname === altPath
						? "text-orange-800 underline"
						: "text-gray-800"
				}`}
			>
				{label} <MdOutlineKeyboardArrowDown />
			</button>

			<div
				className={`absolute left-0 mt-2 w-[200px] text-sm bg-white shadow-lg rounded-md border border-gray-200 z-50 transform transition-all duration-300 origin-top ${
					openDropdown === label.toLowerCase()
						? "opacity-100 scale-y-100"
						: "opacity-0 scale-y-0 pointer-events-none"
				}`}
			>
				{links.map(({ label: linkLabel, path: linkPath }) => (
					<button
						key={linkLabel}
						onClick={() => {
							setOpenDropdown(null);
							navigate(linkPath);
						}}
						className="block w-full text-left px-4 py-2 hover:underline text-gray-800 hover:bg-gray-50"
					>
						{linkLabel}
					</button>
				))}
			</div>
		</div>
	);
};

export default Dropdown;
