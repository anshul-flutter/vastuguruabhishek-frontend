import { IoSearch } from "react-icons/io5";
import { FiBell } from "react-icons/fi";
import { LuFilter } from "react-icons/lu";

/**
 * Reusable Page Header Component
 * Used across admin pages with consistent search, filter, and notification UI
 *
 * @param {string} title - Page title to display
 * @param {string} subtitle - Optional subtitle/description
 * @param {function} onSearch - Search callback function
 * @param {function} onFilter - Filter callback function
 * @param {function} onNotification - Notification callback function
 * @param {boolean} showSearch - Show/hide search bar (default: true)
 * @param {boolean} showFilter - Show/hide filter button (default: true)
 * @param {boolean} showNotification - Show/hide notification button (default: true)
 * @param {string} searchPlaceholder - Custom search placeholder
 * @param {React.ReactNode} actions - Custom action buttons/components
 */
function PageHeader({
	title = "Course Management",
	subtitle,
	onSearch,
	onFilter,
	onNotification,
	showSearch = true,
	showFilter = true,
	showNotification = true,
	searchPlaceholder = "Search key words...",
	actions,
}) {
	return (
		<header className="flex flex-col sm:flex-row justify-between items-center px-[10px] py-[15px] border-b border-[#EDEDED] shadow-[0_1px_11.9px_rgba(0,0,0,0.10)] bg-white">
			{/* Left - Title & Subtitle */}
			<div className="mb-2 sm:mb-0">
				<p className="text-[22px] font-semibold text-black/80">{title}</p>
				{subtitle && (
					<p className="text-[14px] text-gray-600 mt-1">{subtitle}</p>
				)}
			</div>

			{/* Right - Search, Filter, Bell, Custom Actions */}
			<div className="flex items-center gap-[9px] w-full sm:w-auto">
				{/* Search Bar */}
				{showSearch && (
					<div className="flex items-center justify-center gap-[10px] border border-[#E6E6E6] rounded-full shadow-[0_0_15.6px_0_rgba(0,0,0,0.08)] px-[10px] py-[10px] w-full sm:w-[300px]">
						<IoSearch size={20} />
						<input
							type="text"
							placeholder={searchPlaceholder}
							className="flex-1 border-none outline-none text-sm bg-transparent"
							onChange={(e) => onSearch?.(e.target.value)}
						/>
					</div>
				)}

				{/* Filter Button */}
				{showFilter && (
					<button
						onClick={onFilter}
						className="flex justify-center items-center w-[44px] h-[44px] border border-[#E6E6E6] rounded-full shadow-[0_0_15.6px_0_rgba(0,0,0,0.08)] hover:bg-gray-50 transition-colors"
						aria-label="Filter"
					>
						<LuFilter size={20} />
					</button>
				)}

				{/* Bell Button */}
				{showNotification && (
					<button
						onClick={onNotification}
						className="flex justify-center items-center w-[44px] h-[44px] border border-[#E6E6E6] rounded-full shadow-[0_0_15.6px_0_rgba(0,0,0,0.08)] hover:bg-gray-50 transition-colors"
						aria-label="Notifications"
					>
						<FiBell size={20} />
					</button>
				)}

				{/* Custom Actions */}
				{actions}
			</div>
		</header>
	);
}

export default PageHeader;
