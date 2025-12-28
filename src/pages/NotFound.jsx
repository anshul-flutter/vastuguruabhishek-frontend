import { Link } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { selectCurrentUser } from "../store/slices/authSlice";
import { ROLES } from "../utils/constants";

const NotFound = () => {
	const currentUser = useAppSelector(selectCurrentUser);
	const redirectPath =
		currentUser?.role === ROLES.ADMIN || currentUser?.role === ROLES.ASTROLOGER
			? "/admin/dashboard"
			: "/";

	return (
		<div className="flex flex-col items-center justify-center py-24 px-6 text-center">
			<h1 className="text-6xl font-bold text-[#bb1201] mb-4">404</h1>
			<p className="text-xl text-gray-700 mb-6">
				Oops! The page you are looking for could not be found.
			</p>
			<Link
				to={redirectPath}
				className="inline-flex items-center gap-2 bg-[#bb1201] text-white px-6 py-3 rounded-lg shadow hover:opacity-90 transition"
			>
				Return to Home
			</Link>
		</div>
	);
};

export default NotFound;
