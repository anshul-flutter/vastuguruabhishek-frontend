// Vastu Services Page - Display vastu services information and features
import FeatureOverview from "./FeatureOverview";
import VastuAbhishekCard from "./VastuAbhishekCard";
import ContactCard from "./ContactCard";
import FAQSection from "./FAQSection";
import PrivacyPolicyPage from "./PrivacyPolicyPage";
import BottomPart from "./Bottompart";

function VastuServicesPage() {
	return (
		<>
			<FeatureOverview />

			<FeatureOverview />
			<br />
			<VastuAbhishekCard />

			<br />
			<ContactCard />
			<br />

			<FAQSection />
			<br />

			<PrivacyPolicyPage />
			<br />

			<BottomPart />
		</>
	);
}

export default VastuServicesPage;
