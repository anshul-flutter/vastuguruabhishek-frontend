import React from "react";
import PropTypes from "prop-types";
import { FaEdit, FaTrash, FaShoppingCart, FaCheck } from "react-icons/fa";
import BaseCard from "../BaseCard";
import ImageWithFallback from "../ImageWithFallback";

/**
 * CourseCard - Reusable card component for displaying courses
 * Supports admin mode (edit/delete) and user mode (add to cart/enrolled)
 */
const CourseCard = ({
	course,
	onEdit,
	onDelete,
	onAddToCart,
	onViewDetails,
	onGoToCart,
	isDeleting = false,
	isAddingToCart = false,
	isInCart = false,
	isEnrolled = false,
	isAdmin = false,
}) => {
	const truncateText = (text, wordLimit) => {
		if (!text) return "";
		const words = text.split(" ");
		return words.length > wordLimit
			? words.slice(0, wordLimit).join(" ") + "..."
			: text;
	};

	const calculateDiscount = () => {
		if (course.originalPrice && course.originalPrice > course.price) {
			return Math.round(
				((course.originalPrice - course.price) / course.originalPrice) * 100
			);
		}
		return 0;
	};

	const handleCardClick = () => {
		if (onViewDetails) {
			onViewDetails(course);
		}
	};

	const handleAddToCart = (e) => {
		e.stopPropagation();
		if (onAddToCart) {
			onAddToCart(course);
		}
	};

	const handleGoToCart = (e) => {
		e.stopPropagation();
		if (onGoToCart) {
			onGoToCart();
		}
	};

	const handleEdit = (e) => {
		e.stopPropagation();
		if (onEdit) {
			onEdit(course);
		}
	};

	const handleDelete = (e) => {
		e.stopPropagation();
		if (onDelete) {
			onDelete(course._id || course.id);
		}
	};

	const discount = calculateDiscount();

	return (
		<BaseCard
			onClick={!isAdmin ? handleCardClick : undefined}
			className="flex flex-col h-full"
		>
			{/* Course Image */}
			<div className="relative w-full h-48 bg-gray-100 overflow-hidden group">
				<ImageWithFallback
					src={course.image}
					alt={course.title}
					className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
				/>
				{discount > 0 && (
					<div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
						{discount}% OFF
					</div>
				)}
			</div>

			{/* Course Content */}
			<div className="p-4 flex-1 flex flex-col justify-between">
				<div>
					<h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
						{course.title}
					</h3>
					<p className="text-sm text-gray-600 mb-3 line-clamp-2">
						{truncateText(course.description, 10)}
					</p>
				</div>

				{/* Price Section */}
				<div className="mt-auto">
					<div className="flex items-center gap-3 mb-4">
						<span className="font-bold text-2xl text-gray-900">
							₹{course.price?.toLocaleString()}
						</span>
						{course.originalPrice && course.originalPrice > course.price && (
							<span className="text-gray-400 line-through text-sm">
								₹{course.originalPrice?.toLocaleString()}
							</span>
						)}
					</div>

					{/* Action Buttons */}
					{isAdmin ? (
						<div className="flex gap-2">
							<button
								onClick={handleEdit}
								className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
							>
								<FaEdit />
								Edit
							</button>
							<button
								onClick={handleDelete}
								disabled={isDeleting}
								className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm font-medium"
							>
								<FaTrash />
								{isDeleting ? "Deleting..." : "Delete"}
							</button>
						</div>
					) : isEnrolled ? (
						<button
							className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-default text-sm font-medium shadow-sm"
							disabled
						>
							<FaCheck className="w-4 h-4" />
							Enrolled
						</button>
					) : isInCart ? (
						<button
							onClick={handleGoToCart}
							className="w-full bg-orange-500 text-white px-4 py-2.5 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium shadow-sm"
						>
							Go to Cart
						</button>
					) : (
						<button
							onClick={handleAddToCart}
							disabled={isAddingToCart}
							className={`w-full px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium shadow-sm transition-all ${
								isAddingToCart
									? "bg-red-400 text-white cursor-wait"
									: "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600"
							}`}
						>
							{isAddingToCart ? (
								<>
									<div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
									Adding...
								</>
							) : (
								<>
									<FaShoppingCart className="w-4 h-4" />
									Add to Cart
								</>
							)}
						</button>
					)}
				</div>
			</div>
		</BaseCard>
	);
};

CourseCard.propTypes = {
	course: PropTypes.shape({
		_id: PropTypes.string,
		id: PropTypes.string,
		title: PropTypes.string.isRequired,
		description: PropTypes.string,
		price: PropTypes.number.isRequired,
		originalPrice: PropTypes.number,
		image: PropTypes.string.isRequired,
	}).isRequired,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
	onAddToCart: PropTypes.func,
	onViewDetails: PropTypes.func,
	onGoToCart: PropTypes.func,
	isDeleting: PropTypes.bool,
	isAddingToCart: PropTypes.bool,
	isInCart: PropTypes.bool,
	isEnrolled: PropTypes.bool,
	isAdmin: PropTypes.bool,
};

export default CourseCard;
