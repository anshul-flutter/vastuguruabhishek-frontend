import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useState } from "react";
import { menuOptions } from "../../utils/constants";

const MobileMenu = ({ onClose }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const [openDropdown, setOpenDropdown] = useState(null);

	const toggleDropdown = (label) => {
		setOpenDropdown(openDropdown === label ? null : label);
	};

	const handleNavigate = (path) => {
		navigate(path);
		onClose?.();
	};

	return (
		<div className="flex flex-col gap-[5px] p-4">
			{menuOptions.map(({ label, path, links }) => (
				<div key={label} className="flex flex-col">
					{links ? (
						<>
							<div className="flex items-center justify-between pr-2">
								<button
									onClick={() => {
										if (label === "Courses") {
											handleNavigate("/courses");
										}
									}}
									className={`flex justify-between items-center py-[5px] px-3 rounded-md transition-colors duration-200 ${
										location.pathname === path
											? "text-orange-800"
											: "text-gray-800"
									}`}
								>
									{label}
								</button>
								<MdOutlineKeyboardArrowDown
									onClick={() => toggleDropdown(label)}
									className={`transition-transform duration-300 ${
										openDropdown === label ? "rotate-180" : "rotate-0"
									}`}
								/>
							</div>

							<div
								className={`flex flex-col ml-4 border-l border-gray-200 overflow-hidden transition-all duration-300 ${
									openDropdown === label
										? "max-h-96 opacity-100"
										: "max-h-0 opacity-0"
								}`}
							>
								{links.map(({ label: subLabel, path: subPath }) => (
									<Link
										key={subLabel}
										to={subPath}
										className={`py-2 px-3 text-sm hover:text-orange-600 transition-colors ${
											location.pathname === subPath
												? "text-orange-800"
												: "text-gray-600"
										}`}
										onClick={() => {
											setOpenDropdown(null);
											onClose?.();
										}}
									>
										{subLabel}
									</Link>
								))}
							</div>
						</>
					) : (
						<Link
							to={path}
							className={`py-2 px-3 rounded-md transition-colors duration-200 ${
								location.pathname === path ? "text-orange-800" : "text-gray-800"
							}`}
							onClick={() => {
								setOpenDropdown(null);
								onClose?.();
							}}
						>
							{label}
						</Link>
					)}
				</div>
			))}
		</div>
	);
};

export default MobileMenu;
