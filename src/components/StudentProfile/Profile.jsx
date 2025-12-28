import React, { useState, useEffect } from "react";
import { MdLogout } from "react-icons/md";
import { LuPencilLine } from "react-icons/lu";
import { FaGraduationCap, FaShoppingBag } from "react-icons/fa";
import { IoIosArrowForward, IoMdLock } from "react-icons/io";
import { BiSupport } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { selectCurrentUser } from "../../store/slices/authSlice";
import { logout } from "../../store/slices/authSlice";
import toast from "react-hot-toast";
import { useEnrolledCoursesQuery } from "../../hooks/useEnrolledCoursesApi";
import { useMyOrdersQuery } from "../../hooks/useOrdersApi";

const Profile = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const currentUser = useAppSelector(selectCurrentUser);

	const [stats, setStats] = useState({
		coursesCount: 0,
		ordersCount: 0,
		studyTime: 0,
	});

	// Use React Query hooks for data fetching
	const { data: enrolledCourses = [], isLoading: enrolledCoursesLoading } =
		useEnrolledCoursesQuery();

	const { data: ordersData, isLoading: ordersLoading } = useMyOrdersQuery({
		params: { limit: 1 },
	});

	const menuItems = [
		{
			label: "My Courses",
			icon: <FaGraduationCap className="text-[#ce0d06] text-lg" />,
			path: "/my-courses",
		},
		{
			label: "My Orders",
			icon: <FaShoppingBag className="text-[#ce0d06] text-lg" />,
			path: "/my-orders",
		},
		{
			label: "Change Password",
			icon: <IoMdLock className="text-[#ce0d06] text-lg" />,
			path: "/change-password",
		},
		{
			label: "Help & Support",
			icon: <BiSupport className="text-[#ce0d06] text-lg" />,
			path: "/support",
		},
	];

	// Sync orders count from React Query data
	useEffect(() => {
		if (ordersData?.pagination?.total !== undefined) {
			setStats((prev) => ({
				...prev,
				ordersCount: ordersData.pagination.total,
			}));
		}
	}, [ordersData]);

	// Sync enrolled courses count from the authoritative source
	useEffect(() => {
		setStats((prev) => ({
			...prev,
			coursesCount: Array.isArray(enrolledCourses) ? enrolledCourses.length : 0,
		}));
	}, [enrolledCourses]);

	const loading = enrolledCoursesLoading || ordersLoading;

	const handleLogout = () => {
		dispatch(logout());
		toast.success("Logged out successfully");
		navigate("/auth/login");
	};

	// Get user's first name or full name
	const displayName = currentUser?.name || "User";
	const displayEmail = currentUser?.email || "email@example.com";

	return (
		<section className="mx-[1.5rem] my-[2rem]">
			<div className="flex justify-between items-center">
				<span className="text-[1.25rem] font-semibold">My Profile</span>
				<button
					type="button"
					onClick={handleLogout}
					className="flex items-center gap-[5px] text-[#ce0d06] hover:text-[#e47031] transition-colors"
				>
					<span className="bg-white p-2 rounded-full min-shadow cursor-pointer">
						<MdLogout />
					</span>
					Logout
				</button>
			</div>

			<div className="mt-[50px] max-[850px]:flex-col flex justify-between gap-[3rem] mx-[0.5rem]">
				<div className="relative rounded-xl h-full min-[475px]:h-[200px] w-[450px] max-[520px]:w-[100%] bg-gradient-to-b from-[#ce0d06] to-[#e47031] p-3">
					<div className="max-[475px]:hidden absolute flex items-center justify-center -top-[18%] -left-[5%] h-[180px] w-[180px] bg-[#f4f4f4] rounded-full">
						<div className="h-[80%] w-[80%] rounded-full border-2 border-[#ce0d06] red-shadow overflow-hidden bg-white flex items-center justify-center">
							{currentUser?.profileImage ? (
								<img
									src={currentUser.profileImage}
									alt="Profile"
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 text-white text-4xl font-bold">
									{displayName.charAt(0).toUpperCase()}
								</div>
							)}
						</div>
					</div>
					<div className="hidden max-[475px]:block h-[40%]">
						{currentUser?.profileImage ? (
							<img
								src={currentUser.profileImage}
								alt="Profile"
								className="h-[200px] w-[200px] object-cover object-center rounded-full mx-auto"
							/>
						) : (
							<div className="h-[200px] w-[200px] rounded-full mx-auto bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-6xl font-bold">
								{displayName.charAt(0).toUpperCase()}
							</div>
						)}
					</div>
					<div className="min-[475px]:ml-[40%] flex items-center justify-between text-white border-b pb-[1rem]">
						<div>
							<p className="text-[1.25rem] font-semibold leading-tight">
								{displayName}
							</p>
							<p className="text-sm">{displayEmail}</p>
						</div>
						<span
							onClick={() => navigate("/edit-profile")}
							className="border p-2 rounded-full bg-white/30 cursor-pointer hover:bg-white/40 transition-colors"
						>
							<LuPencilLine />
						</span>
					</div>
					<div className="min-[475px]:ml-[40%] mt-[1rem] flex gap-[1rem] text-white">
						<span className="flex-1 border rounded-lg p-2 bg-white/30">
							<p className="font-semibold">
								{loading ? "..." : stats.coursesCount}
							</p>
							<p className="text-sm">Enrolled Courses</p>
						</span>
						<span className="flex-1 border rounded-lg p-2 bg-white/30">
							<p className="font-semibold">
								{loading ? "..." : stats.ordersCount}
							</p>
							<p className="text-sm">Orders</p>
						</span>
					</div>
				</div>

				<div className="flex flex-col gap-[1rem] overflow-hidden flex-1">
					{menuItems.map((item, index) => (
						<button
							type="button"
							onClick={() => navigate(item.path)}
							key={index}
							className="flex min-shadow justify-between items-center p-3 border border-gray-300 rounded-lg text-left hover:bg-gray-50 transition-colors"
						>
							<span className="flex items-center gap-3">
								{item.icon}
								<span>{item.label}</span>
							</span>
							<IoIosArrowForward className="text-gray-500" />
						</button>
					))}
				</div>
			</div>
		</section>
	);
};

export default Profile;
