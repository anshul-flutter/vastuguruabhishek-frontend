import React from "react";
import PropTypes from "prop-types";
import { FaEdit, FaTrash, FaShoppingCart, FaStar } from "react-icons/fa";
import BaseCard from "../BaseCard";

/**
 * ProductCard - Reusable card component for displaying products
 * Supports both admin (edit/delete) and user (view/add to cart) modes
 */
const ProductCard = ({
	product,
	onEdit,
	onDelete,
	onAddToCart,
	onGoToCart,
	isDeleting = false,
	isAddingToCart = false,
	isInCart = false,
	isAdmin = false,
	layout = "horizontal", // "horizontal" or "vertical"
}) => {
	const truncateText = (text, length = 100) => {
		if (!text) return "";
		return text.length > length ? text.substring(0, length) + "..." : text;
	};

	const handleAddToCart = (e) => {
		e.stopPropagation();
		if (onAddToCart) {
			onAddToCart(product);
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
			onEdit(product);
		}
	};

	const handleDelete = (e) => {
		e.stopPropagation();
		if (onDelete) {
			onDelete(product._id || product.id);
		}
	};

	const imageUrl =
		product.images?.[0]?.url || product.image || "/images/default-product.png";
	const isOutOfStock = product.quantity === 0;
	const isLowStock = product.quantity > 0 && product.quantity < 10;

	if (layout === "horizontal") {
		return (
			<BaseCard className="flex items-center gap-4 p-3 h-[170px] min-w-[350px] max-w-[450px]">
				{/* Product Image */}
				<div className="w-[120px] h-full flex items-center justify-center bg-gray-50 rounded-lg flex-shrink-0">
					<img
						src={imageUrl}
						alt={product.title}
						className="h-full w-full object-contain rounded-lg"
					/>
				</div>

				{/* Product Info */}
				<div className="flex-1 flex flex-col justify-between h-full">
					<div>
						<h3 className="font-semibold text-gray-800 line-clamp-1">
							{product.title}
						</h3>
						{product.productCode && (
							<p className="text-sm text-gray-500">
								Code: {product.productCode}
							</p>
						)}
						{product.category && (
							<p className="text-xs text-gray-400 mt-1">{product.category}</p>
						)}
						{product.description && (
							<p className="text-xs text-gray-600 mt-1 line-clamp-2">
								{truncateText(product.description, 80)}
							</p>
						)}
					</div>

					<div className="flex items-center justify-between mt-2">
						<div>
							<p className="font-bold text-red-600 text-lg">
								₹{product.price.toLocaleString()}
							</p>
							{product.rating && (
								<div className="flex items-center mt-1">
									<FaStar className="text-yellow-500 w-4 h-4 mr-1" />
									<span className="text-sm text-gray-700">
										{product.rating?.average?.toFixed(1) || "0.0"}
									</span>
									<span className="text-xs text-gray-500 ml-1">
										({product.rating?.count || 0})
									</span>
								</div>
							)}
						</div>

						{isAdmin ? (
							<div className="flex gap-2">
								<button
									onClick={handleEdit}
									className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									<FaEdit />
								</button>
								<button
									onClick={handleDelete}
									disabled={isDeleting}
									className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
								>
									<FaTrash />
								</button>
							</div>
						) : isInCart ? (
							<button
								onClick={handleGoToCart}
								className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition bg-orange-500 text-white hover:bg-orange-600"
							>
								<span className="text-sm">Go to Cart</span>
							</button>
						) : (
							<button
								onClick={handleAddToCart}
								disabled={isAddingToCart || isOutOfStock}
								className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
									isOutOfStock
										? "bg-gray-300 text-gray-500 cursor-not-allowed"
										: isAddingToCart
										? "bg-orange-400 text-white cursor-wait"
										: "bg-red-600 text-white hover:bg-red-700"
								}`}
							>
								{isAddingToCart ? (
									<>
										<div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
										Adding...
									</>
								) : isOutOfStock ? (
									"Out of Stock"
								) : (
									<>
										<FaShoppingCart className="w-4 h-4" />
										<span className="text-sm">Add</span>
									</>
								)}
							</button>
						)}
					</div>

					{isLowStock && !isAdmin && (
						<p className="text-xs text-orange-600 mt-1">
							Only {product.quantity} left in stock!
						</p>
					)}
				</div>
			</BaseCard>
		);
	}

	// Vertical layout
	return (
		<BaseCard className="flex flex-col h-full">
			{/* Product Image */}
			<div className="relative w-full h-48 bg-gray-100">
				<img
					src={imageUrl}
					alt={product.title}
					className="w-full h-full object-cover"
				/>
				{isOutOfStock && (
					<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
						<span className="text-white font-bold text-lg">Out of Stock</span>
					</div>
				)}
			</div>

			{/* Product Info */}
			<div className="p-4 flex-1 flex flex-col justify-between">
				<div>
					<h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
						{product.title}
					</h3>
					{product.category && (
						<p className="text-sm text-gray-500 mb-2">{product.category}</p>
					)}
					{product.description && (
						<p className="text-sm text-gray-600 line-clamp-3">
							{truncateText(product.description, 100)}
						</p>
					)}
				</div>

				<div className="mt-auto">
					<div className="flex items-center justify-between mb-3">
						<p className="font-bold text-red-600 text-xl">
							₹{product.price.toLocaleString()}
						</p>
						{product.rating && (
							<div className="flex items-center">
								<FaStar className="text-yellow-500 w-4 h-4 mr-1" />
								<span className="text-sm text-gray-700">
									{product.rating?.average?.toFixed(1) || "0.0"}
								</span>
							</div>
						)}
					</div>

					{isLowStock && !isAdmin && (
						<p className="text-xs text-orange-600 mb-2">
							Only {product.quantity} left!
						</p>
					)}

					{isAdmin ? (
						<div className="flex gap-2">
							<button
								onClick={handleEdit}
								className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
							>
								<FaEdit />
								Edit
							</button>
							<button
								onClick={handleDelete}
								disabled={isDeleting}
								className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
							>
								<FaTrash />
								{isDeleting ? "Deleting..." : "Delete"}
							</button>
						</div>
					) : isInCart ? (
						<button
							onClick={handleGoToCart}
							className="w-full px-4 py-2 rounded-lg font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors"
						>
							Go to Cart
						</button>
					) : (
						<button
							onClick={handleAddToCart}
							disabled={isAddingToCart || isOutOfStock}
							className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
								isOutOfStock
									? "bg-gray-300 text-gray-500 cursor-not-allowed"
									: isAddingToCart
									? "bg-orange-400 text-white cursor-wait"
									: "bg-red-600 text-white hover:bg-red-700"
							}`}
						>
							{isAddingToCart ? (
								<span className="flex items-center justify-center gap-2">
									<div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
									Adding...
								</span>
							) : isOutOfStock ? (
								"Out of Stock"
							) : (
								<span className="flex items-center justify-center gap-2">
									<FaShoppingCart className="w-4 h-4" />
									Add to Cart
								</span>
							)}
						</button>
					)}
				</div>
			</div>
		</BaseCard>
	);
};

ProductCard.propTypes = {
	product: PropTypes.shape({
		_id: PropTypes.string,
		id: PropTypes.string,
		title: PropTypes.string.isRequired,
		description: PropTypes.string,
		price: PropTypes.number.isRequired,
		quantity: PropTypes.number,
		productCode: PropTypes.string,
		category: PropTypes.string,
		images: PropTypes.arrayOf(
			PropTypes.shape({
				url: PropTypes.string,
			})
		),
		image: PropTypes.string,
		rating: PropTypes.shape({
			average: PropTypes.number,
			count: PropTypes.number,
		}),
	}).isRequired,
	isAdmin: PropTypes.bool,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
	onAddToCart: PropTypes.func,
	onGoToCart: PropTypes.func,
	isDeleting: PropTypes.bool,
	isAddingToCart: PropTypes.bool,
	isInCart: PropTypes.bool,
	layout: PropTypes.oneOf(["horizontal", "vertical"]),
};

export default ProductCard;
