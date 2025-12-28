// Security & Backup Settings Page - Manage security and backup configurations
import FeatureOverview from "./FeatureOverview";
import SecurityBackupDetails from "./SecurityBackupDetails";
import SecuritySettings from "./SecuritySettings";
import Footer from "./Footer";
import ToggleSwitch from "./ToggleSwitch";

function SecurityBackupPage() {
	return (
		<>
			<br />
			<FeatureOverview />
			<br />
			<SecurityBackupDetails />
			<br /> <br />
			<SecuritySettings />
			<br /> <br /> <br />
			<Footer />
		</>
	);
}

export default SecurityBackupPage;
