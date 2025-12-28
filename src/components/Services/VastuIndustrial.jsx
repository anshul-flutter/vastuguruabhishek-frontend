import React, { useState, useEffect } from "react";
import axios from "axios";
import VastuService from "./VastuService";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { usePublicLayout } from "../../Layout/LayoutContext";

const VastuIndustrial = () => {
	const { inPublicLayout } = usePublicLayout();
	const [packages, setPackages] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchVastuIndustrialConsultations = async () => {
			try {
				const response = await axios.get(
					`${
						import.meta.env.VITE_BACKEND_URL
					}/services?serviceType=consultation&subCategory=Vastu for Factory/Commercial&isActive=true`
				);

				console.log(
					"Vastu for Factory/Commercial API Response:",
					response.data
				);

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
				console.error(
					"Error fetching Vastu for Factory/Commercial consultations:",
					error
				);
				console.error("Error details:", error.response?.data || error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchVastuIndustrialConsultations();
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
				sectionTitle="Vastu For Industrial/Commercial Units"
				headingLines={[
					[
						{ text: "Sync Your Machines With", bold: false },
						{ text: "The +VE Energies", bold: true },
						{ text: "Of Your Factory Buildings And Do", bold: false },
					],
					[{ text: "Double Production", bold: true }],
				]}
				description="Vastu Of Your Factories Or Industries Affects Your Production And Product Quality To A Great Extent. Get Vastu Consultation From Vastu Guru Abhishek Goel Personally And Enjoy More Profits And Gains."
				packages={packages}
			/>
			{!inPublicLayout && <Footer />}
		</>
	);
};

export default VastuIndustrial;
