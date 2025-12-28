import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setSelectedRole } from "../../store/slices/authSlice";

const ChooseRole = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleChoose = (selectedRole) => {
		dispatch(setSelectedRole(selectedRole));
		navigate("/auth/register");
	};

	return (
		<div className="flex h-screen">
			{/* Left side */}
			<div className="flex-1 flex flex-col justify-end items-center gap-[2rem]">
				<div className="text-center">
					<p className="text-3xl font-semibold">
						Choose Your <span className="text-[#c34420]">Cosmic Role</span> To
						Continue
					</p>
					<p className="mt-[1rem] max-w-[400px] mx-auto leading-tight text-gray-700">
						Select your profile to unlock a personalized astrology experience.
					</p>
				</div>
				<div>
					<img
						src="/images/role.png"
						alt="role"
						className="w-[400px] object-contain"
					/>
				</div>
			</div>

			{/* Right side */}
			<div className="flex-1 bg-[#f8edec] flex justify-center items-center">
				<div className="border flex flex-col gap-[1rem] rounded-lg min-w-[80%] border-[#ff0000] px-6 py-10">
					<button
						className="bg-white rounded-lg px-[2rem] py-[10px] w-full border border-[#ff0000] cursor-pointer"
						onClick={() => handleChoose("astrologer")}
					>
						Continue as Astrologer
					</button>
					<button
						className="bg-white rounded-lg px-[2rem] py-[10px] w-full border border-[#ff0000] cursor-pointer"
						onClick={() => handleChoose("student")}
					>
						Continue as Student
					</button>
				</div>
			</div>
		</div>
	);
};

export default ChooseRole;
