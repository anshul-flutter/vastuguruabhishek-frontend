import React from "react";
import { useAppSelector } from "../store/hooks";
import { selectCurrentUser } from "../store/slices/authSlice";
import UnifiedChat from "../components/UnifiedChat/UnifiedChat";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const AstrologerUnifiedChatPage = () => {
	const user = useAppSelector(selectCurrentUser);
	const navigate = useNavigate();

	if (!user) {
		return (
			<div className="flex items-center justify-center h-[500px]">
				<p className="text-gray-500">Please log in to access chat</p>
			</div>
		);
	}

	if (user.role !== "astrologer" && user.role !== "admin") {
		return (
			<div className="flex items-center justify-center h-[500px]">
				<p className="text-gray-500">Access denied</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Back Button */}
			<div className="bg-white border-b border-gray-200 px-4 py-3">
				<button
					onClick={() => navigate("/admin/dashboard")}
					className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
				>
					<IoArrowBack size={20} />
					<span className="font-medium">Back to Dashboard</span>
				</button>
			</div>

			<UnifiedChat
				currentUserId={user._id}
				currentUserName={user.name}
				currentUserRole={user.role}
			/>
		</div>
	);
};

export default AstrologerUnifiedChatPage;
