import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	useServicesQuery,
	useDeleteServiceMutation,
} from "../hooks/useServicesApi";
import CommonConsultation from "../components/PackagePlans/CommonConsultation";

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

const AdminConsultations = () => {
	const navigate = useNavigate();
	const [filter, setFilter] = useState({
		category: "",
		subCategory: "",
		page: 1,
		limit: 10,
	});

	// Build query params from filter
	const queryParams = {
		serviceType: "consultation",
		page: filter.page,
		limit: filter.limit,
	};
	if (filter.category) queryParams.category = filter.category;
	if (filter.subCategory) queryParams.subCategory = filter.subCategory;

	// Use services query hook for consultations
	const { data: consultations = [], isLoading: loading } = useServicesQuery({
		params: queryParams,
	});

	// Delete mutation hook
	const deleteServiceMutation = useDeleteServiceMutation();

	const handleDelete = (id) => {
		if (!window.confirm("Are you sure you want to delete this consultation?"))
			return;

		deleteServiceMutation.mutate(id);
	};

	const handleEdit = (id) => {
		navigate("/admin/create-service", {
			state: {
				serviceType: "consultation",
				editId: id,
			},
		});
	};

	const handleCreateNew = () => {
		navigate("/admin/create-service", {
			state: { serviceType: "consultation" },
		});
	};

	// Transform consultations to card format
	const transformedConsultations = consultations.map((consultation) => ({
		id: consultation._id,
		name: getPlanTier(consultation.price),
		price: consultation.price,
		desc: consultation.description,
		features: consultation.features || [],
		subCategory: consultation.subCategory,
	}));

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Consultations Management</h1>
				<button
					onClick={handleCreateNew}
					className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
				>
					Create New Consultation
				</button>
			</div>

			{/* Filters */}
			<div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
				<select
					value={filter.category}
					onChange={(e) => setFilter({ ...filter, category: e.target.value })}
					className="border rounded px-3 py-2"
				>
					<option value="">All Categories</option>
					<option value="vastu">Vastu</option>
					<option value="astrology">Astrology</option>
					<option value="numerology">Numerology</option>
					<option value="spiritual">Spiritual</option>
					<option value="other">Other</option>
				</select>

				<input
					type="text"
					placeholder="Filter by sub-category"
					value={filter.subCategory}
					onChange={(e) =>
						setFilter({ ...filter, subCategory: e.target.value })
					}
					className="border rounded px-3 py-2"
				/>

				<button
					onClick={() =>
						setFilter({ category: "", subCategory: "", page: 1, limit: 10 })
					}
					className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
				>
					Clear Filters
				</button>
			</div>

			{/* Consultations Grid */}
			{loading ? (
				<div className="flex justify-center py-8">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				</div>
			) : consultations.length === 0 ? (
				<div className="bg-white rounded-lg shadow p-8 text-center">
					<p className="text-gray-500 mb-4">
						No consultations found. Create your first consultation to get
						started.
					</p>
					<button
						onClick={handleCreateNew}
						className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
					>
						Create First Consultation
					</button>
				</div>
			) : (
				<div className="flex flex-wrap gap-6 justify-center">
					{transformedConsultations.map((consultation) => (
						<CommonConsultation
							key={consultation.id}
							plan={consultation}
							style={planStyles[consultation.name] || planStyles.Basic}
							isAdmin={true}
							onEdit={handleEdit}
							onDelete={handleDelete}
							serviceId={consultation.id}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default AdminConsultations;
