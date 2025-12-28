import React, { useState, useEffect, useRef } from "react";
import {
	FaBars,
	FaCog,
	FaQuestionCircle,
	FaSearch,
	FaSignOutAlt,
	FaUser,
} from "react-icons/fa";
import { FaBell } from "react-icons/fa6";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useClickOutside from "../../hooks/useClickOutside";
import { RxCross2 } from "react-icons/rx";
import { menuOptions } from "../../utils/constants";
import TopBar from "../TopBar/TopBar";
import {
	useNotificationsQuery,
	useMarkAsReadMutation,
} from "../../hooks/useNotificationsApi";
import { useCartQuery } from "../../hooks/useCartApi";
import { PiShoppingCartFill } from "react-icons/pi";
import { MdDashboard, MdKey } from "react-icons/md";
import Dropdown from "./Dropdown";
import MobileMenu from "./MobileMenu";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../../utils/apiClient";
import {
	selectCurrentUser,
	selectIsAuthenticated,
	selectAuthToken,
	setCredentials,
	logout as logoutAction,
} from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useCurrentUserQuery } from "../../hooks/useAuthApi";

const profileDropdownItems = [
	{
		id: 1,
		label: "Profile",
		icon: <FaUser />,
		path: "/profile",
	},
	{
		id: 2,
		label: "Dashboard",
		icon: <MdDashboard />,
		path: "/dashboard",
	},
	{
		id: 3,
		label: "Chat",
		icon: <IoChatbubbleEllipsesOutline />,
		path: "/chat",
		hideAbove900: true,
	},
	{
		id: 4,
		label: "Notifications",
		icon: <FaBell />,
		path: "/notifications",
		hideAbove900: true,
	},
	{
		id: 5,
		label: "Cart",
		icon: <PiShoppingCartFill />,
		path: "/cart",
		hideAbove900: true,
	},
	{
		id: 6,
		label: "Change Password",
		icon: <MdKey />,
		path: "/change-password",
	},
	{
		id: 7,
		label: "Logout",
		icon: <FaSignOutAlt />,
		path: "/logout",
	},
];

const Header = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [showNotification, setShowNotification] = useState(false);
	const [showProfile, setShowProfile] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [openDropdown, setOpenDropdown] = useState(false);
	const dispatch = useAppDispatch();
	const queryClient = useQueryClient();
	const currentUser = useAppSelector(selectCurrentUser);
	const authToken = useAppSelector(selectAuthToken);
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const notificationRef = useRef(null);
	const profileRef = useRef(null);
	const mobileMenuRef = useRef(null);

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	const { data: fetchedUser } = useCurrentUserQuery({
		enabled: !currentUser,
	});

	useEffect(() => {
		if (fetchedUser) {
			dispatch(
				setCredentials({
					user: fetchedUser,
					token: authToken ?? null,
				})
			);
		}
	}, [authToken, dispatch, fetchedUser]);

	useClickOutside(profileRef, () => setShowProfile(false));
	useClickOutside(notificationRef, () => setShowNotification(false));
	useClickOutside(mobileMenuRef, () => setMobileMenuOpen(false));

	// Define userData first before using it
	const userData = currentUser ?? fetchedUser;

	// Fetch notifications for the user
	const { data: notificationsData } = useNotificationsQuery({
		userId: userData?._id,
		limit: 10,
		enabled: Boolean(userData?._id),
	});

	const notifications = notificationsData?.notifications ?? [];
	const unreadCount = notificationsData?.unreadCount ?? 0;

	const markAsReadMutation = useMarkAsReadMutation();

	// Fetch cart items count
	const { data: cartData } = useCartQuery({
		enabled: Boolean(userData?._id) && isAuthenticated,
	});
	const cartItemsCount = cartData?.items?.length ?? 0;

	const handleNotificationClick = (notificationId) => {
		if (notificationId) {
			markAsReadMutation.mutate(notificationId);
		}
		// Close the notification dropdown
		setShowNotification(false);
	};

	const handleLogout = async () => {
		try {
			await apiClient.post("/logout", {});
			toast.success("Logged out successfully");
		} catch (err) {
			console.error(err);
			toast.error("Unable to logout. Please try again.");
		}
		dispatch(logoutAction());
		queryClient.removeQueries({ queryKey: ["currentUser"] });
		setShowProfile(false);
		navigate("/");
	};

	return (
		<>
			<section className="sticky top-0 z-50">
				<TopBar />
				<header
					className={`bg-transparent backdrop-blur-[10px] min-shadow w-full transition-all duration-300`}
				>
					<nav className="mx-auto px-4 sm:px-6">
						<div className="flex items-center justify-between py-2 gap-2">
							{/* Logo */}
							<span
								onClick={() => navigate("/")}
								className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#610908] to-[#c41210] cursor-pointer"
							>
								<img
									src="/images/logo.jpg"
									alt="logo"
									className="h-[50px] sm:h-[55px] md:h-[60px]"
								/>
							</span>

							{/* Desktop Nav Links */}
							<div className="flex items-center gap-2 sm:gap-4">
								<div className="hidden min-[1100px]:flex gap-4 lg:gap-6 relative">
									{menuOptions.map(({ label, path, altPath, links }) =>
										links ? (
											<Dropdown
												key={label}
												label={label}
												path={path}
												altPath={altPath}
												links={links}
												openDropdown={openDropdown}
												setOpenDropdown={setOpenDropdown}
											/>
										) : (
											<Link
												key={label}
												to={path}
												onClick={() => setOpenDropdown(null)}
												className={`transition-colors duration-300 ${
													location.pathname === path ||
													location.pathname === altPath
														? "text-orange-800 underline"
														: "text-gray-800"
												}`}
											>
												{label}
											</Link>
										)
									)}
								</div>{" "}
								{/* Right Icons */}
								<div className="flex items-center gap-2 sm:gap-3">
									{/* Chat Icon - Only show when authenticated */}
									{isAuthenticated && (
										<button
											className="max-[1100px]:hidden cursor-pointer flex items-center justify-center bg-white border border-gray-200 h-[40px] w-[40px] sm:h-[45px] sm:w-[45px] rounded-full hover:bg-gray-50 transition-colors"
											onClick={() => navigate("/chat")}
											title="Chat"
										>
											<IoChatbubbleEllipsesOutline className="text-gray-700 text-base sm:text-lg" />
										</button>
									)}

									{/* Notification Section */}
									{isAuthenticated && (
										<div ref={notificationRef} className="max-[1100px]:hidden">
											<button
												className="relative cursor-pointer flex items-center justify-center bg-white border border-gray-200 h-[40px] w-[40px] sm:h-[45px] sm:w-[45px] rounded-full"
												onClick={() => setShowNotification((prev) => !prev)}
											>
												<FaBell className="text-gray-700 text-base sm:text-lg" />
												{unreadCount > 0 && (
													<span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
														{unreadCount > 9 ? "9+" : unreadCount}
													</span>
												)}
											</button>

											<div
												className={`absolute top-[90%] right-[10%] w-[280px] sm:w-[320px] bg-white shadow-xl px-2 py-3 sm:px-[8px] sm:py-[16px] rounded-lg border border-gray-200 overflow-hidden transition-all duration-500 ease-in-out ${
													showNotification
														? "max-h-[400px] opacity-100"
														: "max-h-0 opacity-0"
												}`}
											>
												<h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-[5px] px-2 flex justify-between items-center">
													Notifications
													{unreadCount > 0 && (
														<span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
															{unreadCount}
														</span>
													)}
												</h3>
												<ul className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto thin-scrollbar">
													{notifications.length === 0 ? (
														<li className="px-2 py-4 text-center text-sm text-gray-500">
															No notifications
														</li>
													) : (
														notifications.map((note) => (
															<li key={note._id} className="">
																<Link
																	to={note.path || "#"}
																	onClick={() =>
																		handleNotificationClick(note._id)
																	}
																	className="block hover:bg-gray-100 p-2 rounded-md transition-colors duration-200"
																>
																	<div className="flex justify-between items-start">
																		<p className="text-sm font-medium text-gray-800">
																			{note.title}
																		</p>
																		{!note.isRead && (
																			<span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
																		)}
																	</div>
																	<p className="text-xs text-gray-600">
																		{note.message}
																	</p>
																	<p className="text-[10px] text-gray-400 mt-1">
																		{new Date(note.createdAt).toLocaleString()}
																	</p>
																</Link>
															</li>
														))
													)}
												</ul>
											</div>
										</div>
									)}

									{/* AUTHENTICATION OPTIONS - Conditionally render based on auth status */}
									{!isAuthenticated ? (
										<div className="flex items-center gap-2">
											<button
												onClick={() => navigate("/auth/login")}
												className="border-2 border-[#bb1201] text-[#bb1201] px-2 sm:px-3 py-1 rounded-[5px] cursor-pointer text-xs sm:text-sm whitespace-nowrap"
											>
												Login
											</button>
											<button
												onClick={() => navigate("/auth/register")}
												className="bg-[#bb1201] text-white rounded-[5px] px-2 sm:px-3 py-1 border-2 border-[#bb1201] cursor-pointer text-xs sm:text-sm whitespace-nowrap"
											>
												Sign Up
											</button>
										</div>
									) : (
										<div className="flex items-center gap-2">
											<button
												className="max-[1100px]:hidden relative cursor-pointer flex items-center text-gray-700 justify-center bg-white border border-gray-200 h-[40px] w-[40px] sm:h-[45px] sm:w-[45px] rounded-full"
												onClick={() => navigate("/cart")}
											>
												<PiShoppingCartFill
													size={20}
													className="sm:text-[22px]"
												/>
												{cartItemsCount > 0 && (
													<span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
														{cartItemsCount > 9 ? "9+" : cartItemsCount}
													</span>
												)}
											</button>
										</div>
									)}

									{/* PROFILE SECTION - Only show when authenticated */}
									{isAuthenticated && userData && (
										<div ref={profileRef}>
											<div
												className="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] cursor-pointer border border-gray-400 rounded-full overflow-hidden"
												onClick={() => setShowProfile((prev) => !prev)}
											>
												<img
													src="/images/profile.png"
													alt="user"
													className="object-cover w-full h-full"
												/>
											</div>
											<div
												className={`absolute top-[90%] right-0 bg-white shadow-xl px-2 py-2 sm:px-[8px] sm:py-[10px] w-[220px] sm:w-[250px] rounded-lg border border-gray-200 overflow-hidden transition-all duration-500 ease-in-out ${
													showProfile
														? "max-h-[400px] opacity-100"
														: "max-h-0 opacity-0"
												}`}
											>
												<div className="px-2 py-1 border-b border-gray-100">
													<h3 className="text-base sm:text-lg font-semibold text-gray-800">
														{userData.name || "User"}
													</h3>
													<p className="text-xs text-gray-600 truncate">
														{userData.email}
													</p>
												</div>
												<ul className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto thin-scrollbar">
													{profileDropdownItems.map((item) => (
														<li
															key={item.id}
															className={
																item.hideAbove900 ? "min-[1100px]:hidden" : ""
															}
														>
															{item.label === "Logout" ? (
																<button
																	onClick={handleLogout}
																	className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 transition-colors text-sm text-gray-800 w-full text-left"
																>
																	<span>{item.icon}</span>
																	<span>{item.label}</span>
																</button>
															) : (
																<Link
																	to={item.path}
																	className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 transition-colors text-sm text-gray-800"
																	onClick={() => setShowProfile(false)}
																>
																	<span className="relative">
																		{item.icon}
																		{item.label === "Cart" &&
																			cartItemsCount > 0 && (
																				<span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
																					{cartItemsCount > 9
																						? "9+"
																						: cartItemsCount}
																				</span>
																			)}
																	</span>
																	<span>{item.label}</span>
																</Link>
															)}
														</li>
													))}
												</ul>
											</div>
										</div>
									)}

									{/* Mobile Menu Button */}
									<button
										onClick={toggleMobileMenu}
										className="block focus:outline-none focus:border-none min-[1100px]:hidden text-lg sm:text-xl text-gray-700"
									>
										{mobileMenuOpen ? (
											<RxCross2 size={20} className="sm:text-[22px]" />
										) : (
											<FaBars size={18} className="sm:text-xl" />
										)}
									</button>
								</div>
							</div>
						</div>

						{/* Mobile Menu */}
						<div
							ref={mobileMenuRef}
							className={`absolute bg-[#fbfbfb] w-full left-0 px-3 sm:px-4 pb-2 sm:pb-3 shadow-sm overflow-hidden transition-all duration-500 ease-in-out ${
								mobileMenuOpen
									? "max-h-[450px] opacity-100"
									: "max-h-0 opacity-0"
							}`}
						>
							<MobileMenu
								isAuthenticated={isAuthenticated}
								userData={userData}
								onLogout={handleLogout}
								onClose={() => setMobileMenuOpen(false)}
							/>
						</div>
					</nav>
				</header>
			</section>
		</>
	);
};

export default Header;
