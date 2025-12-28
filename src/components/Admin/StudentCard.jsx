import React, { useState, useRef, useEffect } from "react";
import {
	GlobeAltIcon,
	EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import MiniChart from "./MiniChart";
import {
	useDeleteUserMutation,
	useUpdateUserRoleMutation,
} from "../../hooks/useAdminApi";

const StudentCard = ({ student, onView }) => {
	const { name, email, phone, _id, createdAt } = student;
	const [showMenu, setShowMenu] = useState(false);
	const menuRef = useRef(null);

	const deleteUserMutation = useDeleteUserMutation();
	const updateUserRoleMutation = useUpdateUserRoleMutation();

	// const dobString = `${dob.day}/${dob.month}/${dob.year}`;
	const joinedDate = new Date(createdAt).toLocaleDateString();

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setShowMenu(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this user?")) {
			deleteUserMutation.mutate(_id);
		}
		setShowMenu(false);
	};

	const handleMakeAdmin = () => {
		if (window.confirm("Are you sure you want to make this user an admin?")) {
			updateUserRoleMutation.mutate({ userId: _id, role: "astrologer" });
		}
		setShowMenu(false);
	};

	return (
		<div className="bg-white shadow-md rounded-xl w-full max-w-[344px] relative">
			{/* Top gradient header */}
			<div className="bg-gradient-to-b from-[#BB0E00] to-[#B94400] w-full h-[160px] flex flex-col items-center justify-start pt-3 relative rounded-t-xl">
				{/* Name centered with 3 dots on right */}
				<div className="flex items-center justify-between w-full px-4 relative">
					<div className="w-5"></div>
					<h2 className="text-lg font-bold text-white text-center flex-1">
						{name}
					</h2>
					<div className="relative" ref={menuRef}>
						<EllipsisVerticalIcon
							className="w-5 h-5 text-white cursor-pointer"
							onClick={() => setShowMenu(!showMenu)}
						/>
						{showMenu && (
							<div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 py-1">
								<button
									onClick={handleMakeAdmin}
									className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								>
									Make Admin
								</button>
								<button
									onClick={handleDelete}
									className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
								>
									Delete User
								</button>
							</div>
						)}
					</div>
				</div>

				{/* ID and Email */}
				<p className="text-xs text-white mt-1">ID: {_id}</p>
				<p className="text-xs text-white">{email}</p>

				{/* Image Circle */}
				<img
					src="/images/aditi.png"
					alt={name}
					className="w-20 h-20 rounded-full border-2 border-white object-cover absolute bottom-[-40px]"
				/>
			</div>

			{/* Chart */}
			<div className="flex justify-center mt-12">
				<MiniChart />
			</div>

			{/* Phone & Joined */}
			<div className="px-4 mt-4 text-sm text-gray-700 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<GlobeAltIcon className="w-4 h-4 text-gray-600" />
					<span>
						Phone: <span className="font-bold">{phone}</span>
					</span>
				</div>
				<p className="text-gray-500">Joined - {joinedDate}</p>
			</div>

			{/* Actions */}
			<div className="flex gap-2 justify-center mt-4 mb-4">
				<button
					onClick={() => onView && onView(_id)}
					className="bg-[#BB0E00] text-white px-4 py-1 rounded-md hover:opacity-90"
				>
					View
				</button>
			</div>
		</div>
	);
};

export default StudentCard;
