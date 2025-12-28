import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
	FaUser,
	FaStar,
	FaBook,
	FaUsers,
	FaFolder,
	FaComments,
	FaBox,
	FaChartLine,
	FaVideo,
	FaRupeeSign,
	FaQuoteRight,
	FaCog,
	FaHome,
	FaBars,
	FaCalendarAlt,
	FaShoppingCart,
	FaTicketAlt,
	FaBullhorn,
	FaMoneyBillWave,
	FaServicestack,
	FaClipboardList,
} from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const menuItems = [
	{
		title: "Dashboard",
		icon: <FaHome size={20} />,
		path: "/admin/dashboard",
	},
	{
		title: "Chat",
		icon: <IoChatbubbleEllipsesOutline size={20} />,
		path: "/admin/chat",
	},
	{
		title: "User Management",
		icon: <FaUser size={20} />,
		children: [
			{
				title: "Student Management",
				path: "/admin/student-management",
				icon: <FaBook size={17} />,
			},
			// {
			// 	title: "Customer Management",
			// 	path: "/admin/customers",
			// 	icon: <FaUsers size={17} />,
			// },
		],
	},
	{
		title: "Course Management",
		icon: <FaFolder size={20} />,
		children: [
			{
				title: "All Courses",
				path: "/admin/courses",
				icon: <FaBook size={17} />,
			},
			{
				title: "Session Management",
				path: "/admin/session-management",
				icon: <FaVideo size={17} />,
			},
		],
	},
	{
		title: "Event Management",
		icon: <FaCalendarAlt size={20} />,
		children: [
			{
				title: "All Events",
				path: "/admin/events",
				icon: <FaCalendarAlt size={17} />,
			},
			// {
			// 	title: "Event Payments",
			// 	path: "/admin/event-payment",
			// 	icon: <FaRupeeSign size={17} />,
			// },
		],
	},
	{
		title: "Services",
		icon: <FaServicestack size={20} />,
		children: [
			{
				title: "Consultations",
				path: "/admin/consultations",
				icon: <FaComments size={17} />,
			},
			{
				title: "Packages",
				path: "/admin/packages",
				icon: <FaBox size={17} />,
			},
			{
				title: "Standalone Services",
				path: "/admin/services",
				icon: <FaServicestack size={17} />,
			},
			{
				title: "Service Bookings",
				path: "/admin/service-bookings",
				icon: <FaBook size={17} />,
			},
		],
	},
	{
		title: "Products",
		icon: <FaBox size={20} />,
		children: [
			{
				title: "Books",
				path: "/admin/books",
				icon: <FaBook size={17} />,
			},
		],
	},
	{
		title: "Orders",
		icon: <FaClipboardList size={20} />,
		path: "/admin/orders",
	},
	{
		title: "Enquiries",
		icon: <FaComments size={20} />,
		path: "/admin/enquiries",
	},
	{
		title: "Content Management",
		icon: <FaVideo size={20} />,
		children: [
			{
				title: "Home Content",
				path: "/admin/home-content",
				icon: <FaHome size={17} />,
			},
			{
				title: "Blog Management",
				path: "/admin/blog-management",
				icon: <FaBook size={17} />,
			},
			{
				title: "Podcast Management",
				path: "/admin/podcast-management",
				icon: <FaVideo size={17} />,
			},
			{
				title: "Free Courses",
				path: "/admin/free-courses",
				icon: <FaVideo size={17} />,
			},
			{
				title: "Banner Management",
				path: "/admin/banner-management",
				icon: <FaBullhorn size={17} />,
			},
			{
				title: "About Us",
				path: "/admin/edit-about",
				icon: <FaBook size={17} />,
			},
		],
	},
	// {
	// 	title: "Finance",
	// 	icon: <FaRupeeSign size={20} />,
	// 	children: [
	// 		{
	// 			title: "Financial Reports",
	// 			path: "/admin/financial-management",
	// 			icon: <FaMoneyBillWave size={17} />,
	// 		},
	// 	],
	// },
	// {
	// 	title: "Support",
	// 	icon: <FaTicketAlt size={20} />,
	// 	children: [
	// 		{
	// 			title: "Ticket Management",
	// 			path: "/admin/ticket-management",
	// 			icon: <FaTicketAlt size={17} />,
	// 		},
	// 		{
	// 			title: "Manage Tickets",
	// 			path: "/admin/manage-ticket",
	// 			icon: <FaTicketAlt size={17} />,
	// 		},
	// 	],
	// },
	{
		title: "Reviews & Testimonials",
		path: "/admin/testimonials",
		icon: <FaQuoteRight size={20} />,
	},
	// Settings hidden for now
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
	const [openMenus, setOpenMenus] = useState({});

	const navClass = ({ isActive }) =>
		`flex items-center gap-2.5 px-3 py-3 text-sm rounded-md transition-colors ${
			isActive
				? "bg-red-50 text-red-700 font-semibold"
				: "text-gray-800 hover:bg-red-50 hover:text-red-700"
		}`;

	const dropdownClass =
		"flex items-center gap-2.5 px-3 py-3 text-sm text-gray-800 rounded-md transition-colors hover:bg-red-50 hover:text-red-700 cursor-pointer";

	const subNavClass =
		"flex items-center gap-2 py-2 text-xs text-gray-600 hover:text-red-700";

	const toggleMenu = (title) => {
		setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
	};

	return (
		<>
			{/* Overlay for mobile - only visible when sidebar is open */}
			{sidebarOpen && (
				<div
					onClick={() => setSidebarOpen(false)}
					className="fixed inset-0 bg-gray-400/40 z-40 md:hidden transition-opacity duration-300"
				></div>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed md:static top-0 left-0 h-full bg-white border-r border-gray-200 
          transition-all duration-300 flex flex-col w-[250px]
          ${sidebarOpen ? "translate-x-0 z-50" : "-translate-x-full -z-10"} 
          md:translate-x-0 md:z-auto`}
			>
				<img
					src="/images/vastu-logo.png"
					alt="Vastu Abhishek"
					className="h-22 w-auto md:hidden object-contain mx-auto my-2"
				/>
				{/* Menu - Scrollable */}
				<nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pt-4 md:pt-0">
					<ul className="list-none p-0 m-0 space-y-1 px-2 pb-4">
						{menuItems.map((item) => (
							<li key={item.title}>
								{item.children ? (
									<>
										<div
											onClick={() => toggleMenu(item.title)}
											className={dropdownClass}
										>
											{item.icon}
											{item.title}
											<span className="ml-auto text-xs">
												{openMenus[item.title] ? "▲" : "▼"}
											</span>
										</div>
										{openMenus[item.title] && (
											<ul className="pl-6 space-y-1">
												{item.children.map((child) => (
													<li key={child.title}>
														<NavLink
															to={child.path}
															className={subNavClass}
															onClick={() => setSidebarOpen(false)}
														>
															{child.icon} {child.title}
														</NavLink>
													</li>
												))}
											</ul>
										)}
									</>
								) : (
									<NavLink
										to={item.path}
										className={navClass}
										onClick={() => setSidebarOpen(false)}
									>
										{item.icon} {item.title}
									</NavLink>
								)}
							</li>
						))}
					</ul>
				</nav>
			</aside>
		</>
	);
};

export default Sidebar;
