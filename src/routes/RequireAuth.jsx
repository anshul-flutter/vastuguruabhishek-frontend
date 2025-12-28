import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { selectIsAuthenticated } from "../store/slices/authSlice";

const RequireAuth = () => {
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const location = useLocation();

	if (!isAuthenticated) {
		return <Navigate to="/auth/login" state={{ from: location }} replace />;
	}

	return <Outlet />;
};

export default RequireAuth;
