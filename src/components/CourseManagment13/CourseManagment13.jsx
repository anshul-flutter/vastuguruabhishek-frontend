// Role & Permission Management Page - Manage user roles and permissions
import FeatureOverview from "./FeatureOverview.jsx";
import RolePermissionManagment from "./RolePermissionManagment.jsx";
import PermissionsManager from "./PermissionsManager.jsx";
import Footer from "./Footer.jsx";

function RolePermissionPage() {
	return (
		<>
			<br />
			<FeatureOverview />
			<br />
			<RolePermissionManagment />
			<br /> <br />
			<PermissionsManager />
			<br />
			<Footer />
		</>
	);
}

export default RolePermissionPage;
