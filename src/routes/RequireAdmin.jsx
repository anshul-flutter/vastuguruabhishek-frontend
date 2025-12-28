import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import {
	selectCurrentUser,
	selectIsAuthenticated,
} from "../store/slices/authSlice";
import { ROLES } from "../utils/constants";

const RequireAdmin = () => {
	const currentUser = useAppSelector(selectCurrentUser);
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const location = useLocation();

	// If not authenticated, redirect to login
	if (!isAuthenticated) {
		return <Navigate to="/" state={{ from: location }} replace />;
	}

	// If authenticated but not admin or astrologer, redirect to home
	// Note: In this system, astrologer IS the admin (single person managing platform)
	if (
		currentUser?.role !== ROLES.ADMIN &&
		currentUser?.role !== ROLES.ASTROLOGER
	) {
		return <Navigate to="/" replace />;
	}

	// User is authenticated and has admin/astrologer role
	return <Outlet />;
};

export default RequireAdmin;
