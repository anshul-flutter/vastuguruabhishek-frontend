import React, { useState, useEffect } from "react";
import axios from "axios";
import VastuService from "./VastuService";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { usePublicLayout } from "../../Layout/LayoutContext";

const VastuOffice = () => {
	const { inPublicLayout } = usePublicLayout();
	const [packages, setPackages] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchVastuOfficeConsultations = async () => {
			try {
				const response = await axios.get(
					`${
						import.meta.env.VITE_BACKEND_URL
					}/services?serviceType=consultation&subCategory=Vastu for Office&isActive=true`
				);

				console.log("Vastu for Office API Response:", response.data);

				// Transform API data to match the expected format
				const transformedPackages = response.data.data.map((service) => ({
					id: service._id,
					title: service.title,
					subtitle: `₹${service.price.toLocaleString("en-IN")}`,
					features: service.features || [],
					price: `₹${service.price.toLocaleString("en-IN")}`,
					oldPrice: service.originalPrice
						? `₹${service.originalPrice.toLocaleString("en-IN")}`
						: "",
					buttonText: "Buy Package",
					detailsLink: "#",
				}));

				setPackages(transformedPackages);
			} catch (error) {
				console.error("Error fetching Vastu for Office consultations:", error);
				console.error("Error details:", error.response?.data || error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchVastuOfficeConsultations();
	}, []);

	if (loading) {
		return (
			<>
				{!inPublicLayout && <Header />}
				<div className="min-h-screen flex items-center justify-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
				</div>
				{!inPublicLayout && <Footer />}
			</>
		);
	}

	return (
		<>
			{!inPublicLayout && <Header />}
			<VastuService
				sectionTitle="Vastu For Office"
				headingLines={[
					[
						{ text: "Energies", bold: false },
						{ text: "Of", bold: false },
						{ text: "Your Working Space", bold: true },
						{ text: "Is Directly Proportional To", bold: false },

						{ text: "Your Growth", bold: true },
					],
				]}
				description="Vastu of your Office affects your business decisions which in turn affects your growth. If you are working in a vastu perfect office building, your decisions and actions will attract gains and profits in your business. Get vastu consultation from Vastu Guru Abhishek Goel personally for your office and enjoy more profits and gains."
				packages={packages}
			/>
			{!inPublicLayout && <Footer />}
		</>
	);
};

export default VastuOffice;
