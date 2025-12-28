import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import { useAddToCartMutation, useCartQuery } from "../../hooks/useCartApi";

const ProductCard = ({ product }) => {
	const navigate = useNavigate();
	const { mutate: addToCart, isPending } = useAddToCartMutation();
	const { data: cartData } = useCartQuery();

	const [isInCart, setIsInCart] = useState(false);

	// Check if product is already in cart
	useEffect(() => {
		if (cartData?.items) {
			const inCart = cartData.items.some(
				(item) => item.productId === product._id && item.kind === "Product"
			);
			setIsInCart(inCart);
		}
	}, [cartData, product._id]);

	const {
		_id,
		title,
		productCode,
		quantity,
		price,
		rating,
		images,
		category,
		description,
	} = product;

	const handleAddToCart = (e) => {
		e.stopPropagation(); // Prevent card click
		addToCart({
			productId: _id,
			quantity: 1,
			kind: "Product",
		});
	};

	const handleCardClick = () => {
		// Navigate to product detail page if needed
		// navigate(`/products/${_id}`);
	};

	// Get first image URL
	const imageUrl = images?.[0]?.url || "/images/default-product.png";

	return (
		<div
			onClick={handleCardClick}
			className="bg-white flex items-center min-shadow gap-[1rem] rounded-2xl p-3 max-w-[450px] min-w-[350px] h-[170px] border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
		>
			<div className="w-[120px] h-full flex items-center justify-center bg-gray-50 rounded-lg">
				<img
					src={imageUrl}
					alt={title}
					className="h-full w-full object-contain rounded-lg"
				/>
			</div>
			<div className="flex-1 flex flex-col justify-between h-full">
				<div>
					<h3 className="font-semibold text-gray-800 line-clamp-1">{title}</h3>
					{productCode && (
						<p className="text-sm text-gray-500">Code: {productCode}</p>
					)}
					<p className="text-xs text-gray-400 mt-1">{category}</p>
					{description && (
						<p className="text-xs text-gray-600 mt-1 line-clamp-2">
							{description}
						</p>
					)}
				</div>

				<div className="flex items-center justify-between mt-2">
					<div>
						<p className="font-bold text-[#c02c07] text-lg">
							₹{price.toLocaleString()}
						</p>
						<div className="flex items-center mt-1">
							<FaStar className="text-yellow-500 w-4 h-4 mr-1" />
							<span className="text-sm text-gray-700">
								{rating?.average?.toFixed(1) || "0.0"}
							</span>
							<span className="text-xs text-gray-500 ml-1">
								({rating?.count || 0})
							</span>
						</div>
					</div>

					{isInCart ? (
						<button
							onClick={() => navigate("/cart")}
							className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition bg-orange-500 text-white hover:bg-orange-600"
						>
							<span className="text-sm">Go to Cart</span>
						</button>
					) : (
						<button
							onClick={handleAddToCart}
							disabled={isPending || quantity === 0}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
								quantity === 0
									? "bg-gray-300 text-gray-500 cursor-not-allowed"
									: isPending
									? "bg-orange-400 text-white cursor-wait"
									: "bg-[#c02c07] text-white hover:bg-[#a02506]"
							}`}
						>
							{isPending ? (
								<>
									<div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
									Adding...
								</>
							) : quantity === 0 ? (
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

				{quantity > 0 && quantity < 10 && (
					<p className="text-xs text-orange-600 mt-1">
						Only {quantity} left in stock!
					</p>
				)}
			</div>
		</div>
	);
};

export default ProductCard;
