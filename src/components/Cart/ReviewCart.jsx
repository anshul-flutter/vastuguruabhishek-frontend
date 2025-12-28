import React, { useMemo, useState } from "react";
import {} from "react-router-dom";
import { useInitiatePayUMutation } from "../../hooks/usePaymentApi";
import toast from "react-hot-toast";
import ImageWithFallback from "../common/ImageWithFallback";
import {
	useCartQuery,
	useRemoveCartItemMutation,
} from "../../hooks/useCartApi";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getDisplayImage = (item) => {
	if (item.imageUrl) return item.imageUrl;
	if (item.image) {
		if (item.image.startsWith("http")) return item.image;
		const baseUrl = import.meta.env.VITE_BACKEND_URL;
		if (!baseUrl) return item.image;
		const normalized = item.image.startsWith("/")
			? item.image.slice(1)
			: item.image;
		return `${baseUrl}/${normalized}`;
	}
	return "/images/fallback.svg";
};

export default function ReviewCart() {
	const { data, isLoading, isError, error } = useCartQuery();
	const { mutate: removeCartItem, isPending } = useRemoveCartItemMutation({
		showSuccessToast: true,
	});
	const { mutateAsync: initiatePayU } = useInitiatePayUMutation();
	// no-op

	const [isProcessingOrder, setIsProcessingOrder] = useState(false);

	const items = useMemo(() => data?.items ?? [], [data]);
	const totals = useMemo(
		() => data?.totals ?? { totalMRP: 0, discount: 0, totalAmount: 0 },
		[data]
	);

	const handlePayUCheckout = async () => {
		if (!items || items.length === 0) {
			toast.error("Your cart is empty");
			return;
		}
		try {
			setIsProcessingOrder(true);
			const response = await initiatePayU();

			// Check if this is a free order (no payment gateway needed)
			if (response?.free) {
				toast.success("Free course added successfully!");
				// Redirect to my-orders page with success status
				window.location.href = `/my-orders?payment=success&order=${response.order?._id}`;
				return;
			}

			// Regular paid order - proceed to PayU
			const payload = response;
			if (!payload?.payuUrl || !payload?.params) {
				throw new Error("Invalid payment response");
			}

			// Build and submit a form to PayU
			const form = document.createElement("form");
			form.method = "POST";
			form.action = payload.payuUrl;
			Object.entries(payload.params).forEach(([key, value]) => {
				const input = document.createElement("input");
				input.type = "hidden";
				input.name = key;
				input.value = String(value ?? "");
				form.appendChild(input);
			});
			document.body.appendChild(form);
			form.submit();
		} catch (error) {
			console.error("PayU initiate error:", error);
			const message =
				error.response?.data?.message ||
				error.message ||
				"Failed to start payment. Please try again.";
			toast.error(message);
			setIsProcessingOrder(false);
		}
	};

	if (isLoading) {
		return <p className="text-center mt-4">Loading cart...</p>;
	}

	if (isError) {
		const message =
			error?.response?.data?.message ??
			error?.message ??
			"Failed to fetch cart.";
		return <p className="text-center mt-4 text-red-600">{message}</p>;
	}

	if (!items.length) {
		return (
			<div className="max-w-3xl mx-auto p-4 text-center space-y-4">
				<h2 className="text-2xl font-semibold">Your cart is empty</h2>
				<p className="text-gray-600">
					Add products to review them here before checkout.
				</p>
			</div>
		);
	}

	return (
		<div className="max-w-3xl mx-auto p-4 space-y-4">
			{items.map((item) => (
				<div
					key={item.cartItemId ?? item.id ?? item.productId}
					className="rounded-2xl shadow-md bg-white"
				>
					<div className="flex items-start p-4 gap-4">
						<ImageWithFallback
							src={getDisplayImage(item)}
							alt={item.name}
							className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
						/>
						<div className="flex flex-col justify-between flex-1">
							<div>
								<h2 className="font-semibold text-lg">{item.name}</h2>
								<p className="text-sm text-gray-500">
									{item.description || "No description"}
								</p>
							</div>
							<div className="flex items-center gap-2 mt-2">
								<span className="text-red-600 font-semibold text-lg">
									₹{Number(item.price ?? 0).toLocaleString()}
								</span>
								{item.oldPrice && item.oldPrice !== item.price && (
									<span className="line-through text-gray-400 text-sm">
										₹{Number(item.oldPrice).toLocaleString()}
									</span>
								)}
							</div>
							<div className="text-sm">
								<span>Qty: </span>
								<span>{item.quantity}</span>
							</div>
						</div>
					</div>
					<div className="px-4 pb-4">
						<button
							onClick={() => removeCartItem({ productId: item.productId })}
							disabled={isPending || isProcessingOrder}
							className="w-40 py-2 rounded bg-[#ba3400] text-white font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isPending ? "Removing..." : "Remove"}
						</button>
					</div>
				</div>
			))}

			{/* Totals Section */}
			<div className="rounded-2xl shadow-md bg-white">
				<div className="p-4 text-sm">
					<h3 className="font-semibold text-gray-600 mb-3">Product Details</h3>
					<div className="flex justify-between mb-2">
						<span>Total MRP</span>
						<span>₹ {Number(totals.totalMRP ?? 0).toLocaleString()}</span>
					</div>
					<div className="flex justify-between mb-2">
						<span>Discount on MRP</span>
						<span>₹ {Number(totals.discount ?? 0).toLocaleString()}</span>
					</div>
					<div className="flex justify-between mb-2">
						<span>Shipping Fee</span>
						<span className="pl-2">Free</span>
					</div>
					<hr className="my-2 border-gray-400" />
					<div className="flex justify-between font-semibold">
						<span>Total Amount</span>
						<span>₹ {Number(totals.totalAmount ?? 0).toLocaleString()}</span>
					</div>
					<p className="text-xs text-gray-400 mt-0">Including Tax and GST</p>
				</div>
			</div>

			<div className="flex justify-center mt-4">
				<button
					onClick={handlePayUCheckout}
					disabled={isPending || isProcessingOrder}
					className="bg-[#ba3400] text-white py-2 px-6 rounded text-lg font-medium shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isProcessingOrder ? (
						<span className="flex items-center justify-center gap-2">
							<div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
							Redirecting to PayU...
						</span>
					) : (
						"Proceed to Pay"
					)}
				</button>
			</div>
		</div>
	);
}
