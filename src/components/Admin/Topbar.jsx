import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaBell, FaBars } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import Cookies from "js-cookie";
import { ADMIN_HIDE_GREETING_PATHS } from "../../utils/constants";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout, selectCurrentUser } from "../../store/slices/authSlice";
import apiClient from "../../utils/apiClient";
import {
	useNotificationsQuery,
	useMarkAsReadMutation,
} from "../../hooks/useNotificationsApi";

const Topbar = ({
	pageTitle,
	showNotification,
	setShowNotification,
	notificationRef,
	sidebarOpen,
	setSidebarOpen,
}) => {
	const location = useLocation();
	const dispatch = useAppDispatch();
	const currentUser = useAppSelector(selectCurrentUser);
	const [showProfileMenu, setShowProfileMenu] = useState(false);
	const profileRef = useRef(null);

	const shouldHideGreeting = ADMIN_HIDE_GREETING_PATHS.some((path) =>
		location.pathname.startsWith(path)
	);

	// Fetch notifications for the admin user
	const { data: notificationsData } = useNotificationsQuery({
		userId: currentUser?._id,
		limit: 10,
		enabled: Boolean(currentUser?._id),
	});

	const notifications = notificationsData?.notifications ?? [];
	const unreadCount = notificationsData?.unreadCount ?? 0;

	const markAsReadMutation = useMarkAsReadMutation();

	const handleNotificationClick = (notificationId) => {
		if (notificationId) {
			markAsReadMutation.mutate(notificationId);
		}
	};

	// Close profile dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (profileRef.current && !profileRef.current.contains(e.target)) {
				setShowProfileMenu(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLogout = async () => {
		try {
			// Call logout API to clear server-side cookie
			await apiClient.post("/logout");
		} catch (error) {
			console.error("Logout API error:", error);
		} finally {
			// Clear client-side state regardless of API result
			Cookies.remove("token");
			dispatch(logout());
		}
	};

	return (
		<div
			className="flex justify-between items-center px-4 sm:px-6 border-b border-[#ddd] sticky left-0 top-0 z-[10] shadow-sm bg-[#FBFBFB] w-full"
			style={{
				height: "106px",
			}}
		>
			{/* Left Section: Hamburger + Logo + Greeting/Title */}
			<div className="flex items-center gap-4">
				{/* Hamburger Menu for Mobile */}
				<button
					onClick={() => setSidebarOpen(!sidebarOpen)}
					className="md:hidden text-gray-700 text-2xl"
				>
					<FaBars />
				</button>

				{/* Logo - visible on small screens */}
				<img
					src="/images/vastu-logo.png"
					alt="Vastu Abhishek"
					className="h-10 w-auto "
				/>

				{/* Conditionally render greeting or page title */}
				{!shouldHideGreeting ? (
					<div className="hidden sm:flex flex-col leading-tight">
						<span className="text-[#666] whitespace-nowrap text-[16px]">
							Welcome !
						</span>
						<span className="font-bold text-[#333] whitespace-nowrap text-[16px]">
							{currentUser?.name || currentUser?.role || "Admin"}
						</span>
					</div>
				) : (
					<div className="hidden sm:flex items-center">
						<h1 className="text-2xl font-bold text-gray-800">
							{pageTitle || "Admin Panel"}
						</h1>
					</div>
				)}
			</div>

			<div className="flex items-center gap-4 w-full justify-end">
				{/* Notification Section */}
				<div ref={notificationRef} className="relative">
					<button
						className="relative cursor-pointer flex items-center justify-center bg-white border border-gray-200 h-[54px] w-[54px] rounded-full"
						onClick={() => setShowNotification((prev) => !prev)}
					>
						<FaBell className="text-gray-700" />
					</button>

					{/* Notifications Dropdown */}
					<div
						className={`absolute top-[90%] right-0 w-[320px] bg-white shadow-xl px-[8px] py-[16px] rounded-lg border border-gray-200 overflow-hidden transition-all duration-500 ease-in-out ${
							showNotification
								? "max-h-[400px] opacity-100 z-50"
								: "max-h-0 opacity-0"
						}`}
					>
						<h3 className="text-lg font-semibold text-gray-800 mb-[5px] flex justify-between items-center">
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
									<li key={note._id}>
										<Link
											to={note.path || "#"}
											onClick={() => handleNotificationClick(note._id)}
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
											<p className="text-xs text-gray-600">{note.message}</p>
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

				{/* Profile Dropdown */}
				<div ref={profileRef} className="relative">
					<button
						className="flex items-center gap-2 cursor-pointer bg-white border border-gray-200 h-[54px] px-4 rounded-full"
						onClick={() => setShowProfileMenu((prev) => !prev)}
					>
						<FaUserCircle className="text-gray-700 text-xl" />
						<span className="hidden sm:block font-medium text-gray-700">
							{currentUser?.name || "User"}
						</span>
					</button>

					{/* Profile Menu */}
					<div
						className={`absolute top-[90%] right-0 w-[200px] bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out ${
							showProfileMenu
								? "max-h-[400px] opacity-100 z-50"
								: "max-h-0 opacity-0"
						}`}
					>
						<ul className="divide-y divide-gray-100">
							<li>
								<Link
									to="/admin/profile"
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								>
									My Profile
								</Link>
							</li>
							<li>
								<Link
									to="/admin/settings"
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								>
									Settings
								</Link>
							</li>
							<li>
								<button
									onClick={handleLogout}
									className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
								>
									Logout
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Topbar;
