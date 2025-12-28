import React, { useMemo, useCallback } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
	useCartQuery,
	useRemoveCartItemMutation,
	useUpdateCartItemMutation,
} from "../../hooks/useCartApi";
import ImageWithFallback from "../common/ImageWithFallback";

const Cart = () => {
	const navigate = useNavigate();
	const { data, isLoading, isError, error, refetch } = useCartQuery();
	const { mutate: updateCartItem, isPending: isUpdatingQuantity } =
		useUpdateCartItemMutation({ showSuccessToast: false });
	const { mutate: removeCartItem, isPending: isRemovingItem } =
		useRemoveCartItemMutation();
	const isMutating = isUpdatingQuantity || isRemovingItem;

	const items = useMemo(() => data?.items ?? [], [data]);
	const totals = useMemo(
		() => data?.totals ?? { totalAmount: 0, totalMRP: 0, discount: 0 },
		[data]
	);

	const handleQuantityChange = useCallback(
		(item, change) => {
			const nextQuantity = Math.max(1, Number(item.quantity ?? 1) + change);
			if (nextQuantity === item.quantity) return;
			// Use itemId (the actual item's _id) not productId (cart item's _id)
			const itemId = item.itemId ?? item.productId;
			updateCartItem({ itemId, quantity: nextQuantity });
		},
		[updateCartItem]
	);

	const handleRemove = useCallback(
		(item) => {
			// Use itemId (the actual item's _id) not productId (cart item's _id)
			const itemId = item.itemId ?? item.productId;
			console.log("Removing item with itemId:", itemId);
			removeCartItem({ itemId });
		},
		[removeCartItem]
	);

	const subtotal = useMemo(
		() => Number(totals.totalAmount ?? 0),
		[totals.totalAmount]
	);

	const renderErrorMessage = () => {
		const message =
			error?.response?.data?.message ??
			error?.message ??
			"Failed to load cart. Please try again.";

		return (
			<div className="max-w-6xl mx-auto p-4">
				<div className="text-center py-12">
					<p className="text-red-600 mb-4">{message}</p>
					<button
						onClick={() => refetch()}
						className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	};

	if (isLoading) {
		return (
			<div className="max-w-6xl mx-auto p-4">
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
						<p className="text-gray-600">Loading your cart...</p>
					</div>
				</div>
			</div>
		);
	}

	if (isError) {
		return renderErrorMessage();
	}

	if (!items.length) {
		return (
			<div className="max-w-6xl mx-auto p-4">
				<div className="text-center py-12">
					<h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
					<p className="text-gray-600 mb-6">
						Add some products to get started!
					</p>
					<button
						onClick={() => navigate("/services")}
						className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
					>
						Continue Shopping
					</button>
				</div>
			</div>
		);
	}

	const CartItem = ({ item }) => {
		const imageUrl = item.imageUrl || item.image || "/images/fallback.svg";
		const itemType = item.itemType ?? item.kind ?? "Product";
		const isCourse = itemType === "Course";
		const isService = itemType === "Service";
		const isConsultation = itemType === "Consultation";
		const isBook = itemType === "Book";

		// Determine badge display
		let badgeText = "Product";
		let badgeClass = "bg-green-100 text-green-700";

		if (isCourse) {
			badgeText = "Course";
			badgeClass = "bg-blue-100 text-blue-700";
		} else if (isService) {
			badgeText = "Service";
			badgeClass = "bg-purple-100 text-purple-700";
		} else if (isConsultation) {
			badgeText = "Consultation";
			badgeClass = "bg-orange-100 text-orange-700";
		} else if (isBook) {
			badgeText = "Book";
			badgeClass = "bg-teal-100 text-teal-700";
		}

		return (
			<div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-3">
				<div className="w-20 h-20 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
					<ImageWithFallback
						src={imageUrl}
						alt={item.name}
						className="w-full h-full object-contain"
					/>
				</div>

				<div className="flex-1">
					<div className="flex items-center gap-2">
						<h3 className="font-medium text-gray-800">{item.name}</h3>
						<span className={`${badgeClass} text-xs px-2 py-1 rounded-full`}>
							{badgeText}
						</span>
					</div>
					<div className="flex items-center gap-2 mt-1">
						<span className="text-red-600 font-semibold">
							₹{Number(item.price ?? 0).toLocaleString()}
						</span>
						{item.oldPrice && item.oldPrice > item.price && (
							<span className="text-gray-400 line-through text-sm">
								₹{Number(item.oldPrice).toLocaleString()}
							</span>
						)}
					</div>
					{item.description && (
						<p className="text-xs text-gray-500 mt-1 line-clamp-1">
							{item.description}
						</p>
					)}
					{item.scheduledDate && (
						<p className="text-xs text-blue-600 mt-1">
							Scheduled: {new Date(item.scheduledDate).toLocaleDateString()}
							{item.scheduledTime && ` at ${item.scheduledTime}`}
						</p>
					)}
				</div>
			</div>
		);
	};

	const QuantityControls = ({ item }) => {
		const itemType = item.itemType ?? item.kind ?? "Product";
		const isCourse = itemType === "Course";
		const isService = itemType === "Service";
		const isConsultation = itemType === "Consultation";

		// Courses, Services, and Consultations typically have quantity of 1
		const hasFixedQuantity = isCourse || isService || isConsultation;

		return (
			<div className="flex items-center gap-4 px-4 pb-4">
				{!hasFixedQuantity && (
					<div className="flex items-center gap-3">
						<button
							onClick={() => handleQuantityChange(item, -1)}
							disabled={isMutating}
							className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<FaMinus className="w-4 h-4" />
						</button>
						<span className="font-medium min-w-[20px] text-center">
							{item.quantity}
						</span>
						<button
							onClick={() => handleQuantityChange(item, 1)}
							disabled={isMutating}
							className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<FaPlus className="w-4 h-4" />
						</button>
					</div>
				)}
				{hasFixedQuantity && (
					<span className="text-sm text-gray-600 italic">
						Quantity: 1 (
						{itemType === "Course" ? "Course enrollment" : itemType})
					</span>
				)}
				<button
					onClick={() => handleRemove(item)}
					disabled={isMutating}
					className="text-gray-500 hover:text-red-500 text-sm ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Remove
				</button>
			</div>
		);
	};

	return (
		<div className="max-w-6xl mx-auto p-4">
			{isMutating && (
				<div className="fixed top-0 left-0 right-0 bg-red-700 text-white text-center py-2 z-50">
					Updating cart...
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Cart Items */}
				<div className="lg:col-span-2">
					<h2 className="text-xl font-semibold mb-6">Shopping Cart</h2>
					{items.map((item) => (
						<div
							key={item.cartItemId ?? item.id ?? item.productId}
							className="mb-4"
						>
							<CartItem item={item} />
							<QuantityControls item={item} />
						</div>
					))}
				</div>

				{/* Checkout Section */}
				<div className="lg:col-span-1">
					<div className="sticky top-4">
						<div className="bg-white p-6 rounded-lg shadow-sm border">
							<div className="mb-6">
								<div className="flex justify-between items-center mb-2">
									<span className="text-gray-600">Subtotal:</span>
									<span className="font-semibold">
										₹{subtotal.toLocaleString()}
									</span>
								</div>
								<div className="flex justify-between items-center mb-4">
									<span className="text-gray-600">Total:</span>
									<span className="text-xl font-bold text-red-600">
										₹{subtotal.toLocaleString()}
									</span>
								</div>
							</div>

							<button
								disabled={isMutating}
								onClick={() => navigate("/cart-page")}
								className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
									!isMutating
										? "bg-red-600 hover:bg-red-700 text-white"
										: "bg-gray-300 text-gray-500 cursor-not-allowed"
								}`}
							>
								{isMutating ? "Processing..." : "Proceed to Checkout"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Cart;
