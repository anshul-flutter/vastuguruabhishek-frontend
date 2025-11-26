import React from "react";
import PropTypes from "prop-types";
import {
	FaCaretRight,
	FaEdit,
	FaTrash,
	FaToggleOn,
	FaToggleOff,
	FaShoppingCart,
} from "react-icons/fa";
import BaseCard from "../BaseCard";
import ImageWithFallback from "../ImageWithFallback";

/**
 * ServiceCard - Reusable card component for services, packages, and consultations
 * Supports admin mode (edit/delete) and user mode (book now)
 */
const ServiceCard = ({
	service,
	onEdit,
	onDelete,
	onAddToCart,
	isDeleting = false,
	isAddingToCart = false,
	isInCart = false,
	isAdmin = false,
}) => {
	const [showAllFeatures, setShowAllFeatures] = React.useState(false);

	const getPlanTier = (price) => {
		if (price <= 15000) return "Basic";
		if (price <= 30000) return "Silver";
		if (price <= 60000) return "Gold";
		return "Platinum";
	};

	const tier = getPlanTier(service.price);

	const logoGradient =
		"bg-gradient-to-r from-[#610908] to-[#c41210] text-white";
	const whiteButton = "bg-white text-[#610908] hover:bg-gray-100";

	const planStyles = {
		Basic: {
			gradient: logoGradient,
			button: whiteButton,
			icon: "text-white",
			badge: "bg-white/20 text-white",
		},
		Silver: {
			gradient: logoGradient,
			button: whiteButton,
			icon: "text-white",
			badge: "bg-white/20 text-white",
		},
		Gold: {
			gradient: logoGradient,
			button: whiteButton,
			icon: "text-white",
			badge: "bg-white/20 text-white",
		},
		Platinum: {
			gradient: logoGradient,
			button: whiteButton,
			icon: "text-white",
			badge: "bg-white/20 text-white",
		},
	};

	const style = planStyles[tier];

	const getBadgeColor = () => {
		// Using white/transparent badges for better look on dark gradient
		return "bg-white/20 text-white";
	};

	const handleEdit = (e) => {
		e.stopPropagation();
		if (onEdit) {
			onEdit(service);
		}
	};

	const handleDelete = (e) => {
		e.stopPropagation();
		if (onDelete) {
			onDelete(service._id || service.id);
		}
	};

	const handleAddToCart = (e) => {
		e.stopPropagation();
		if (onAddToCart) {
			onAddToCart(service);
		}
	};

	return (
		<BaseCard
			className={`p-6 flex flex-col justify-between w-full max-w-[340px] mx-auto transition-transform hover:scale-105 ${style.gradient}`}
			variant="gradient"
		>
			{/* Admin controls */}
			{isAdmin && (
				<div className="absolute top-3 right-3 flex gap-2 items-center">
					{service.isActive ? (
						<FaToggleOn className="text-green-500 text-2xl" title="Active" />
					) : (
						<FaToggleOff className="text-gray-400 text-2xl" title="Inactive" />
					)}
				</div>
			)}

			<div>
				{/* Service type badges */}
				<div className="flex flex-wrap gap-2 mb-3">
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor()}`}
					>
						{service.serviceType}
					</span>
					{service.subCategory && (
						<span
							className={`px-2 py-1 rounded-full text-xs font-medium ${style.badge}`}
						>
							{service.subCategory}
						</span>
					)}
				</div>

				{/* Service image */}
				{service.image && (
					<div className="mb-4">
						<ImageWithFallback
							src={service.image}
							alt={service.title}
							className="w-full h-40 object-cover rounded-lg"
						/>
					</div>
				)}

				{/* Title and description */}
				<h3 className="text-2xl font-bold text-center mb-2">{service.title}</h3>
				<p className="text-sm text-center mb-4 opacity-80 line-clamp-3">
					{service.description}
				</p>

				{/* Price */}
				<div className="text-center mb-2">
					<p className="text-4xl font-extrabold">
						<sup className="text-[15px]">₹ </sup>
						{service.price.toLocaleString("en-IN")}
					</p>
					{service.originalPrice && service.originalPrice > service.price && (
						<p className="text-sm opacity-60 line-through">
							₹ {service.originalPrice.toLocaleString("en-IN")}
						</p>
					)}
				</div>

				{/* Category */}
				{service.category && (
					<span className="block text-center opacity-70 text-sm capitalize mb-4">
						{service.category}
					</span>
				)}

				{/* Features */}
				{service.features && service.features.length > 0 && (
					<ul className="mt-4 space-y-2">
						{(showAllFeatures
							? service.features
							: service.features.slice(0, 4)
						).map((feature, i) => (
							<li key={i} className="flex items-start gap-2 text-sm">
								<FaCaretRight className={`${style.icon} mt-1 flex-shrink-0`} />
								<span className="text-left">{feature}</span>
							</li>
						))}
						{service.features.length > 4 && (
							<li
								className="text-xs opacity-90 text-center mt-2 cursor-pointer hover:underline font-semibold"
								onClick={(e) => {
									e.stopPropagation();
									setShowAllFeatures(!showAllFeatures);
								}}
							>
								{showAllFeatures
									? "Show less"
									: `+${service.features.length - 4} more features`}
							</li>
						)}
					</ul>
				)}
			</div>

			{/* Action buttons */}
			<div className="mt-6">
				{isAdmin ? (
					<div className="flex gap-2">
						<button
							onClick={handleEdit}
							className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
						>
							<FaEdit />
							Edit
						</button>
						<button
							onClick={handleDelete}
							disabled={isDeleting}
							className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-md flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-60"
						>
							<FaTrash />
							{isDeleting ? "Deleting..." : "Delete"}
						</button>
					</div>
				) : isInCart ? (
					<button
						onClick={(e) => {
							e.stopPropagation();
							window.location.href = "/cart";
						}}
						className="w-full px-5 py-2 font-semibold rounded-md flex items-center justify-center gap-2 bg-orange-500 text-white hover:bg-orange-600 transition-colors"
					>
						Go to Cart
					</button>
				) : (
					<button
						onClick={handleAddToCart}
						disabled={isAddingToCart}
						className={`w-full px-5 py-2 font-semibold rounded-md flex items-center justify-center gap-2 ${
							style.button
						} transition-opacity ${
							isAddingToCart ? "opacity-60 cursor-wait" : "hover:opacity-90"
						}`}
					>
						{isAddingToCart ? (
							<>
								<div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
								Adding...
							</>
						) : (
							<>
								<FaShoppingCart />
								Add to Cart
							</>
						)}
					</button>
				)}
			</div>
		</BaseCard>
	);
};

ServiceCard.propTypes = {
	service: PropTypes.shape({
		_id: PropTypes.string,
		id: PropTypes.string,
		title: PropTypes.string.isRequired,
		description: PropTypes.string,
		price: PropTypes.number.isRequired,
		originalPrice: PropTypes.number,
		category: PropTypes.string,
		serviceType: PropTypes.string,
		subCategory: PropTypes.string,
		image: PropTypes.string,
		features: PropTypes.arrayOf(PropTypes.string),
		isActive: PropTypes.bool,
	}).isRequired,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
	onAddToCart: PropTypes.func,
	isDeleting: PropTypes.bool,
	isAddingToCart: PropTypes.bool,
	isInCart: PropTypes.bool,
	isAdmin: PropTypes.bool,
};

export default ServiceCard;
