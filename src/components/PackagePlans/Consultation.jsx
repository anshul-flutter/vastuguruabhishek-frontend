import React, { useMemo } from "react";
import { useServicesQuery } from "../../hooks/useServicesApi";
import CommonConsultation from "./CommonConsultation";

const logoGradient = "bg-gradient-to-r from-[#610908] to-[#c41210] text-white";
const whiteButton = "bg-white text-[#610908] hover:bg-gray-100";

const planStyles = {
	Basic: {
		gradient: logoGradient,
		button: whiteButton,
		icon: "text-white",
	},
	Silver: {
		gradient: logoGradient,
		button: whiteButton,
		icon: "text-white",
	},
	Gold: {
		gradient: logoGradient,
		button: whiteButton,
		icon: "text-white",
	},
	Platinum: {
		gradient: logoGradient,
		button: whiteButton,
		icon: "text-white",
	},
};

const getPlanTier = (price) => {
	if (price <= 15000) return "Basic";
	if (price <= 30000) return "Silver";
	if (price <= 60000) return "Gold";
	return "Platinum";
};

export default function Consultation() {
	// Fetch services using React Query
	const { data: services = [], isLoading: loading } = useServicesQuery({
		params: {
			serviceType: "package",
			category: "astrology",
			isActive: true,
		},
	});

	// Transform and sort the plans
	const plans = useMemo(() => {
		const transformed = services.map((service) => ({
			name: getPlanTier(service.price),
			price: service.price.toLocaleString("en-IN"),
			desc: service.description,
			features: service.features || [],
		}));

		// Sort by price
		return transformed.sort((a, b) => {
			const priceA = parseInt(a.price.replace(/,/g, ""));
			const priceB = parseInt(b.price.replace(/,/g, ""));
			return priceA - priceB;
		});
	}, [services]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100 py-10 px-4 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 py-10 px-4">
			<h2 className="text-3xl font-bold text-center mb-10">
				Astrology Consultation Packages
			</h2>

			<div className="flex flex-wrap justify-center gap-6">
				{plans.map((plan, index) => (
					<CommonConsultation
						key={index}
						plan={plan}
						style={planStyles[plan.name]}
					/>
				))}
			</div>
		</div>
	);
}
