import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { LayoutProvider } from "./LayoutContext";
import { useAppSelector } from "../store/hooks";
import {
	selectCurrentUser,
	selectIsAuthenticated,
} from "../store/slices/authSlice";
import { ROLES } from "../utils/constants";
import { useEffect } from "react";

const PublicLayout = () => {
	const navigate = useNavigate();
	const currentUser = useAppSelector(selectCurrentUser);
	const isAuthenticated = useAppSelector(selectIsAuthenticated);

	useEffect(() => {
		if (isAuthenticated && currentUser?.role === ROLES.ASTROLOGER) {
			navigate("/admin/dashboard", { replace: true });
		}
	}, [isAuthenticated, currentUser?.role, navigate]);

	return (
		<LayoutProvider value={{ inPublicLayout: true }}>
			<div className="min-h-screen flex flex-col bg-[#fcfcfc]">
				<Header />
				<main className="flex-1">
					<Outlet />
				</main>
				<Footer />
			</div>
		</LayoutProvider>
	);
};

export default PublicLayout;
