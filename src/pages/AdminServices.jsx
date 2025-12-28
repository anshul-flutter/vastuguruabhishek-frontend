import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	useServicesQuery,
	useDeleteServiceMutation,
} from "../hooks/useServicesApi";
import CommonConsultation from "../components/PackagePlans/CommonConsultation";

const planStyles = {
	Basic: {
		gradient: "bg-white text-black border-2 border-gray-200",
		button: "bg-[#ba3800] text-white",
		icon: "text-orange-400",
	},
	Silver: {
		gradient:
			"bg-gradient-to-tr from-[#f5f5f5] to-[#dbdbdb] text-black shadow-gray-300",
		button: "bg-[#ba3800] text-white",
		icon: "text-orange-400",
	},
	Gold: {
		gradient: "bg-gradient-to-tr from-[#ffaa00] to-[#ff8c00] text-white",
		button: "bg-[#ba3800] text-white",
		icon: "text-white",
	},
	Platinum: {
		gradient: "bg-gradient-to-tr from-[#a62b3d] to-[#6c69c9] text-white",
		button: "bg-[#ba3800] text-white",
		icon: "text-orange-400",
	},
};

const getPlanTier = (price) => {
	if (price <= 15000) return "Basic";
	if (price <= 30000) return "Silver";
	if (price <= 60000) return "Gold";
	return "Platinum";
};

const AdminServices = () => {
	const navigate = useNavigate();
	const [filter, setFilter] = useState({
		category: "",
		subCategory: "",
		page: 1,
		limit: 10,
	});

	// Build query params from filter
	const queryParams = {
		serviceType: "service",
		page: filter.page,
		limit: filter.limit,
	};
	if (filter.category) queryParams.category = filter.category;
	if (filter.subCategory) queryParams.subCategory = filter.subCategory;

	// Use services query hook
	const { data: services = [], isLoading: loading } = useServicesQuery({
		params: queryParams,
	});

	// Delete mutation hook
	const deleteServiceMutation = useDeleteServiceMutation();

	const handleDelete = (id) => {
		if (!window.confirm("Are you sure you want to delete this service?"))
			return;

		deleteServiceMutation.mutate(id);
	};

	const handleEdit = (id) => {
		navigate("/admin/create-service", {
			state: {
				serviceType: "service",
				editId: id,
			},
		});
	};

	const handleCreateNew = () => {
		navigate("/admin/create-service", {
			state: { serviceType: "service" },
		});
	};

	// Transform services to card format
	const transformedServices = services.map((service) => ({
		id: service._id,
		name: getPlanTier(service.price),
		price: service.price,
		desc: service.description,
		features: service.features || [],
		subCategory: service.subCategory,
	}));

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Standalone Services Management</h1>
				<button
					onClick={handleCreateNew}
					className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
				>
					Create New Service
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

			{/* Services Grid */}
			{loading ? (
				<div className="flex justify-center py-8">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				</div>
			) : services.length === 0 ? (
				<div className="bg-white rounded-lg shadow p-8 text-center">
					<p className="text-gray-500 mb-4">
						No services found. Create your first service to get started.
					</p>
					<button
						onClick={handleCreateNew}
						className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
					>
						Create First Service
					</button>
				</div>
			) : (
				<div className="flex flex-wrap gap-6 justify-center">
					{transformedServices.map((service) => (
						<CommonConsultation
							key={service.id}
							plan={service}
							style={planStyles[service.name] || planStyles.Basic}
							isAdmin={true}
							onEdit={handleEdit}
							onDelete={handleDelete}
							serviceId={service.id}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default AdminServices;
