import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";

const CourseHeader = ({
	onFilterChange,
	onSearchChange,
	priceFilter = "all",
	onPriceFilterChange,
}) => {
	const [filter, setFilter] = useState("All");
	const [searchTerm, setSearchTerm] = useState("");

	const handleFilterChange = (item) => {
		setFilter(item);
		onFilterChange?.(item);
	};

	const handleSearchChange = (e) => {
		const value = e.target.value;
		setSearchTerm(value);
		onSearchChange?.(value);
	};

	const handlePriceFilter = (value) => {
		onPriceFilterChange?.(value);
	};

	return (
		<div className="mt-[2rem] px-6">
			<h2 className="text-lg font-semibold text-gray-800">
				What Do You Want to Learn?
			</h2>
			<div className="flex items-center flex-wrap gap-[2rem] justify-between mt-[1rem]">
				<div className="flex flex-wrap gap-[10px]">
					{["All", "Astrology", "Numerology", "Tarot", "Vastu"].map((item) => (
						<button
							key={item}
							onClick={() => handleFilterChange(item)}
							className={`px-[1rem] py-[2px] rounded-[5px] cursor-pointer transition-colors
                ${
									filter === item
										? " bg-gradient-to-b from-[#bf1305] to-[#f64f42] text-white"
										: "bg-gray-200 border border-gray-300 hover:bg-gray-300"
								}
              `}
						>
							{item}
						</button>
					))}
				</div>
				<div className="flex items-center gap-[1rem]">
					<div className="min-shadow flex items-center gap-[10px] border border-gray-300 text-gray-800 px-[1rem] py-[.5rem] rounded-full">
						<IoIosSearch size={22} className="text-gray-700" />
						<input
							type="text"
							value={searchTerm}
							onChange={handleSearchChange}
							placeholder="Search Keywords"
							className="outline-none border-none"
						/>
					</div>

					{/* Price Filter */}
					<div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-full px-1 py-1">
						{[
							{ key: "all", label: "All" },
							{ key: "paid", label: "Paid" },
							{ key: "free", label: "Free" },
						].map((opt) => (
							<button
								key={opt.key}
								onClick={() => handlePriceFilter(opt.key)}
								className={`px-3 py-1 text-sm rounded-full cursor-pointer transition-colors ${
									priceFilter === opt.key
										? "bg-white text-[#bf1305] border border-[#f64f42]"
										: "text-gray-700 hover:bg-white"
								}`}
							>
								{opt.label}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseHeader;
