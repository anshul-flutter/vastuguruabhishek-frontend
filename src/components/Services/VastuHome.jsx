import React, { useState, useEffect } from "react";
import axios from "axios";
import VastuService from "./VastuService";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { usePublicLayout } from "../../Layout/LayoutContext";

const VastuHome = () => {
	const { inPublicLayout } = usePublicLayout();
	const [packages, setPackages] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchVastuHomeConsultations = async () => {
			try {
				const response = await axios.get(
					`${
						import.meta.env.VITE_BACKEND_URL
					}/services?serviceType=consultation&subCategory=Vastu for Home&isActive=true`
				);

				console.log("Vastu for Home API Response:", response.data);

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
				console.error("Error fetching Vastu for Home consultations:", error);
				console.error("Error details:", error.response?.data || error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchVastuHomeConsultations();
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
				sectionTitle="Vastu For Home"
				headingLines={[
					[
						{ text: "The Space", bold: false },
						{ text: "In Which You Live", bold: true },
						{ text: "Decides What", bold: false },
						{ text: "Universe", bold: true },
						{ text: "Will Give You", bold: false },
					],
				]}
				description="Vastu of your home affects you and your overall growth to a great extent. If you are living in a vastu perfect building, you will definitely convert your karma into gains and prosperity. If your home has vastu dosh, your hard work will not give good results. Get consultation from Vastu Guru Abhishek Goel personally and enjoy a happy and purpose-driven life. Requirements – layout plans, Google location, birth details, problem and target list, complete video of home in case of online consultation."
				packages={packages}
			/>
			{!inPublicLayout && <Footer />}
		</>
	);
};

export default VastuHome;
