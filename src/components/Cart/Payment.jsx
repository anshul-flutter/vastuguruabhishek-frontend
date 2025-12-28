import { useMemo, useState } from "react";
import { FaCreditCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useCartQuery } from "../../hooks/useCartApi";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Payment() {
	const navigate = useNavigate();
	const [selectedMethod, setSelectedMethod] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const [cardDetails, setCardDetails] = useState({
		cardNumber: "",
		cardName: "",
		expiry: "",
		cvv: "",
	});
	const [netBanking, setNetBanking] = useState("");
	const [upiId, setUpiId] = useState("");

	const { data: cartData, isLoading, isError, error, refetch } = useCartQuery();

	const { totalMRP, discount, totalAmount } = useMemo(() => {
		return cartData?.totals ?? { totalMRP: 0, discount: 0, totalAmount: 0 };
	}, [cartData]);

	const handlePayment = async () => {
		// Validate payment method selection
		if (!selectedMethod) {
			toast.error("Please select a payment method");
			return;
		}

		// Validate cart has items
		if (!cartData?.items || cartData.items.length === 0) {
			toast.error("Your cart is empty");
			return;
		}

		// Validate payment details based on selected method
		if (selectedMethod === "card") {
			if (
				!cardDetails.cardNumber ||
				!cardDetails.cardName ||
				!cardDetails.expiry ||
				!cardDetails.cvv
			) {
				toast.error("Please fill in all card details");
				return;
			}
		} else if (selectedMethod === "netbanking" && !netBanking) {
			toast.error("Please select a bank");
			return;
		} else if (selectedMethod === "upi" && !upiId) {
			toast.error("Please enter UPI ID");
			return;
		}

		// Show confirmation alert
		const confirmed = window.confirm(
			`Are you sure you want to proceed with payment of ₹${totalAmount.toLocaleString()}?`
		);

		if (!confirmed) {
			return;
		}

		try {
			setIsProcessing(true);

			// Prepare order items from cart
			const items = cartData.items.map((item) => ({
				itemId: item.itemId || item.productId,
				itemType: item.itemType || item.kind || "Product",
				quantity: item.quantity || 1,
				price: item.price,
			}));

			// Create order with pending payment status
			const orderResponse = await axios.post(
				`${VITE_BACKEND_URL}/orders`,
				{
					items,
					paymentMethod: selectedMethod,
					paymentStatus: "pending", // Set payment status to pending
					clearCart: true, // Clear cart after order creation
				},
				{
					withCredentials: true,
				}
			);

			if (orderResponse.data.success) {
				toast.success("Order placed successfully! Payment is pending.");
				refetch(); // Refresh cart to show it's empty
				navigate("/my-orders"); // Redirect to orders page
			}
		} catch (error) {
			console.error("Payment error:", error);
			const message =
				error.response?.data?.message ||
				error.message ||
				"Failed to process payment";
			toast.error(message);
		} finally {
			setIsProcessing(false);
		}
	};

	if (isLoading) {
		return <p className="text-center mt-10">Loading cart...</p>;
	}

	if (isError) {
		const message =
			error?.response?.data?.message ??
			error?.message ??
			"Failed to fetch cart items.";
		return <p className="text-red-600 text-center mt-10">{message}</p>;
	}

	return (
		<div className="max-w-2xl mx-auto p-6 space-y-6">
			{/* Payment Methods */}
			<div className="bg-white p-4 rounded-2xl shadow space-y-4">
				<h2 className="font-semibold">Choose Payment Method</h2>

				{/* Card Payment */}
				<label
					className={`flex flex-col space-y-2 p-2 rounded-xl cursor-pointer border ${
						selectedMethod === "card" ? "border-[#bb0e00]" : "border-gray-300"
					}`}
				>
					<div className="flex items-center space-x-3">
						<input
							type="radio"
							name="payment"
							checked={selectedMethod === "card"}
							onChange={() => setSelectedMethod("card")}
							className="w-4 h-4 accent-[#bb0e00] cursor-pointer"
						/>
						<span className="flex items-center gap-2 font-medium">
							<FaCreditCard /> Credit or Debit Card
						</span>
					</div>

					{selectedMethod === "card" && (
						<div className="flex flex-col space-y-2 mt-2 ml-6">
							<input
								type="text"
								placeholder="Card Number"
								value={cardDetails.cardNumber}
								onChange={(e) =>
									setCardDetails({ ...cardDetails, cardNumber: e.target.value })
								}
								className="border p-2 rounded-lg w-full"
							/>
							<input
								type="text"
								placeholder="Name on Card"
								value={cardDetails.cardName}
								onChange={(e) =>
									setCardDetails({ ...cardDetails, cardName: e.target.value })
								}
								className="border p-2 rounded-lg w-full"
							/>
							<div className="flex gap-2">
								<input
									type="text"
									placeholder="Expiry MM/YY"
									value={cardDetails.expiry}
									onChange={(e) =>
										setCardDetails({ ...cardDetails, expiry: e.target.value })
									}
									className="border p-2 rounded-lg w-1/2"
								/>
								<input
									type="text"
									placeholder="CVV"
									value={cardDetails.cvv}
									onChange={(e) =>
										setCardDetails({ ...cardDetails, cvv: e.target.value })
									}
									className="border p-2 rounded-lg w-1/2"
								/>
							</div>
						</div>
					)}
				</label>

				{/* Net Banking */}
				<label
					className={`flex flex-col space-y-2 p-2 rounded-xl cursor-pointer border ${
						selectedMethod === "netbanking"
							? "border-[#bb0e00]"
							: "border-gray-300"
					}`}
				>
					<div className="flex items-center space-x-3">
						<input
							type="radio"
							name="payment"
							checked={selectedMethod === "netbanking"}
							onChange={() => setSelectedMethod("netbanking")}
							className="w-4 h-4 accent-[#bb0e00] cursor-pointer"
						/>
						<span className="font-medium">Net Banking</span>
					</div>

					{selectedMethod === "netbanking" && (
						<div className="flex flex-col mt-2 ml-6 space-y-2">
							<select
								value={netBanking}
								onChange={(e) => setNetBanking(e.target.value)}
								className="border p-2 rounded-lg w-1/2"
							>
								<option>Choose Bank</option>
								<option>State Bank of India</option>
								<option>HDFC Bank</option>
								<option>ICICI Bank</option>
								<option>Axis Bank</option>
							</select>
						</div>
					)}
				</label>

				{/* UPI Payment */}
				<label
					className={`flex flex-col space-y-2 p-2 rounded-xl cursor-pointer border ${
						selectedMethod === "upi" ? "border-[#bb0e00]" : "border-gray-300"
					}`}
				>
					<div className="flex items-center space-x-3">
						<input
							type="radio"
							name="payment"
							checked={selectedMethod === "upi"}
							onChange={() => setSelectedMethod("upi")}
							className="w-4 h-4 accent-[#bb0e00] cursor-pointer"
						/>
						<span className="flex items-center gap-1 font-medium">
							Other UPI Apps
						</span>
					</div>

					{selectedMethod === "upi" && (
						<input
							type="text"
							placeholder="Enter UPI ID"
							value={upiId}
							onChange={(e) => setUpiId(e.target.value)}
							className="border p-2 rounded-lg mt-2 ml-6 w-1/2"
						/>
					)}
				</label>

				{/* Confirm Payment Button */}
				<button
					onClick={handlePayment}
					disabled={isProcessing || !selectedMethod}
					className="w-full mt-4 bg-[#ba1f00] text-white py-3 rounded-xl hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isProcessing ? (
						<span className="flex items-center justify-center gap-2">
							<div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
							Processing...
						</span>
					) : (
						`Pay ₹ ${totalAmount.toLocaleString()}`
					)}
				</button>
			</div>

			{/* Payment Summary */}
			<div className="bg-white p-4 rounded-2xl shadow space-y-2">
				<div className="flex justify-between">
					<span>Total MRP</span>
					<span>₹ {totalMRP.toLocaleString()}</span>
				</div>
				<div className="flex justify-between">
					<span>Discount</span>
					<span>₹ {discount.toLocaleString()}</span>
				</div>
				<hr className="border-gray-300" />
				<div className="flex justify-between font-semibold text-lg">
					<span>Total Amount</span>
					<span>₹ {totalAmount.toLocaleString()}</span>
				</div>
				<p className="text-sm text-gray-500 mt-1">Including Tax and GST</p>
			</div>
		</div>
	);
}
