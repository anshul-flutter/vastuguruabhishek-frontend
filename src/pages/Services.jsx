import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAddToCartMutation, useCartQuery } from "../hooks/useCartApi";
import { useServicesQuery } from "../hooks/useServicesApi";
import { ServiceCard } from "../components/common/cards";
import { useAppSelector } from "../store/hooks";
import { selectCurrentUser } from "../store/slices/authSlice";
import { ROLES } from "../utils/constants";

const Services = () => {
	const navigate = useNavigate();
	const currentUser = useAppSelector(selectCurrentUser);
	const isAdmin =
		currentUser?.role === ROLES.ASTROLOGER || currentUser?.role === ROLES.ADMIN;

	const [addingToCartId, setAddingToCartId] = useState(null); // Track which service is being added
	const [filters, setFilters] = useState({
		search: "",
		page: 1,
		limit: 12,
	});

	// Build query params from filters
	const queryParams = {
		...filters,
		isActive: "true", // Only show active services
		serviceType: "service", // Only show standalone services (not consultations or packages)
	};

	// Use services query hook
	const { data: servicesData = [], isLoading: loading } = useServicesQuery({
		params: queryParams,
	});

	// Extract services and pagination (if the API returns structured data)
	const services = Array.isArray(servicesData)
		? servicesData
		: servicesData.data || [];
	const pagination = servicesData.pagination || {
		total: 0,
		pages: 1,
		currentPage: filters.page,
	};

	const { mutate: addToCart } = useAddToCartMutation();
	const { data: cartData } = useCartQuery(undefined, {
		skip: !currentUser || isAdmin,
	});

	// Check if service is in cart
	const isServiceInCart = (serviceId) => {
		const items = cartData?.items;
		if (!items || !serviceId) return false;
		return items.some(
			(item) =>
				(item.productId === serviceId || item.itemId === serviceId) &&
				(item.kind === "Service" || item.itemType === "Service")
		);
	};

	const handleFilterChange = (key, value) => {
		setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
	};

	const handlePageChange = (newPage) => {
		setFilters((prev) => ({ ...prev, page: newPage }));
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleAddToCart = (service) => {
		// Check if user is logged in
		if (!currentUser) {
			toast("Please log in to continue", { icon: "🔐" });
			navigate("/auth/login", {
				state: { from: { pathname: window.location.pathname } },
			});
			return;
		}


		// Check if already in cart
		if (isServiceInCart(service._id)) {
			navigate("/cart");
			return;
		}

		// Set loading state for this specific service
		setAddingToCartId(service._id);

		// All services (consultation, package, service) from Service collection
		// should use "Service" as itemType in cart
		// Backend cart accepts: "Course", "Book", "Consultation", "Service"
		// Note: "Consultation" itemType is for the Consultation model (booked consultations),
		// while service items with serviceType="consultation" use "Service" itemType
		const itemType = "Service";

		addToCart(
			{
				itemId: service._id,
				itemType: itemType,
				quantity: 1,
			},
			{
				onSuccess: () => {
					setAddingToCartId(null);
					// Toast is already shown by useAddToCartMutation hook
				},
				onError: (error) => {
					setAddingToCartId(null);
					toast.error(
						error?.response?.data?.message ||
							"Failed to add to cart. Please try again."
					);
				},
			}
		);
	};

	const handleEdit = (service) => {
		// Navigate to service edit page
		navigate(`/admin/edit-service/${service._id}`);
	};

	const handleDelete = (serviceId) => {
		if (!serviceId) return;
		if (!window.confirm("Are you sure you want to delete this service?"))
			return;
		// TODO: Implement delete service mutation
		toast.error("Delete functionality not implemented yet");
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h1>
				<p className="text-gray-600">
					Explore our wide range of spiritual and consultation services
				</p>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-lg shadow-sm p-4 mb-6">
				<div className="flex items-center gap-4">
					{/* Search */}
					<div className="flex-1">
						<input
							type="text"
							placeholder="Search services..."
							value={filters.search}
							onChange={(e) => handleFilterChange("search", e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
						/>
					</div>

					{/* Clear Filters */}
					{filters.search && (
						<div>
							<button
								onClick={() =>
									setFilters({
										search: "",
										page: 1,
										limit: 12,
									})
								}
								className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
							>
								Clear
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Loading State */}
			{loading && (
				<div className="flex justify-center items-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
				</div>
			)}

			{/* Services Grid */}
			{!loading && services.length > 0 && (
				<div className="flex flex-wrap justify-center gap-6 mb-8">
					{services.map((service) => (
						<div key={service._id} className="flex justify-center">
							<ServiceCard
								service={service}
								isAdmin={isAdmin}
								onEdit={handleEdit}
								onDelete={handleDelete}
								onAddToCart={handleAddToCart}
								isAddingToCart={addingToCartId === service._id}
								isInCart={isServiceInCart(service._id)}
								isDeleting={false}
							/>
						</div>
					))}
				</div>
			)}

			{/* Empty State */}
			{!loading && services.length === 0 && (
				<div className="text-center py-12">
					<p className="text-gray-600 text-lg mb-2">No services found</p>
					<p className="text-gray-500 text-sm">
						Try adjusting your filters or search criteria
					</p>
				</div>
			)}

			{/* Pagination */}
			{!loading && pagination?.pages > 1 && (
				<div className="flex justify-center items-center gap-2">
					<button
						onClick={() => handlePageChange(filters.page - 1)}
						disabled={filters.page === 1}
						className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Previous
					</button>
					<span className="text-gray-600">
						Page {pagination?.currentPage ?? filters.page} of{" "}
						{pagination?.pages ?? 1}
					</span>
					<button
						onClick={() => handlePageChange(filters.page + 1)}
						disabled={filters.page >= (pagination?.pages ?? 1)}
						className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Next
					</button>
				</div>
			)}
		</div>
	);
};

export default Services;
