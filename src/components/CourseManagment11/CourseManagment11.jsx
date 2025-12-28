// Order Tracking Page - View and track customer orders
import { FaCircle } from "react-icons/fa";
import { PiLineVertical } from "react-icons/pi";
import { GoGlobe } from "react-icons/go";

const steps = [
	{ label: "Order Confirmed", date: "03, July 2025" },
	{ label: "Order Shipped", date: "07, July 2025" },
	{ label: "Order Delivered", date: "13, July 2025" },
];

export default function OrderTracking({ order }) {
	// Example order data fallback
	const o = order || {
		customerName: "Swati Joshi",
		addressLines: ["7 Mukhi Rudraksha"],
		orderId: "9845",
		orderDate: "Jul 10, 2025",
		payableAmount: "₹1,299",
		deliveryStatus: "Delivered on Jul 13",
		product: {
			title: "7 Mukhi Rudraksha",
			qty: 10,
			price: "₹1,299",
			img: "/images/SevenMukhiRudraksh.png",
			rating: 4.9,
			reviews: 560,
		},
	};

	return (
		<>
			<div className="bg-white py-4 pl-2 w-full sm:py-5 sm:pl-[10px]">
				<p className="text-[20px] font-semibold leading-normal sm:text-[24px] font-['SF_Pro']">
					View & Track Order
				</p>
			</div>
			<br />
			<div className="flex flex-col gap-4 px-2 sm:px-0">
				{/* Header card */}
				<div className="bg-white rounded-2xl p-3 sm:p-5 shadow-soft border border-gray-100">
					<div className="grid grid-cols-1 gap-4">
						{/* Single column layout for mobile */}
						<div className="space-y-3 text-xs sm:text-sm text-gray-600">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<GoGlobe size={12} className="sm:w-4 sm:h-4 flex-shrink-0" />
									<span className="whitespace-nowrap">Customer Name:</span>
								</div>
								<div className="text-gray-800 text-right font-medium">
									{o.customerName}
								</div>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<GoGlobe size={12} className="sm:w-4 sm:h-4 flex-shrink-0" />
									<span className="whitespace-nowrap">Product:</span>
								</div>
								<div className="text-gray-800 text-right font-medium">
									{o.product.title}
								</div>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<GoGlobe size={12} className="sm:w-4 sm:h-4 flex-shrink-0" />
									<span className="whitespace-nowrap">Order ID:</span>
								</div>
								<div className="text-gray-800 text-right font-medium">
									ORD-{o.orderId}
								</div>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<GoGlobe size={12} className="sm:w-4 sm:h-4 flex-shrink-0" />
									<span className="whitespace-nowrap">Order Date:</span>
								</div>
								<div className="text-gray-800 text-right font-medium">
									{o.orderDate}
								</div>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<GoGlobe size={12} className="sm:w-4 sm:h-4 flex-shrink-0" />
									<span className="whitespace-nowrap">Payable Amount:</span>
								</div>
								<div className="text-gray-800 text-right font-semibold">
									{o.payableAmount}
								</div>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<GoGlobe size={12} className="sm:w-4 sm:h-4 flex-shrink-0" />
									<span className="whitespace-nowrap">Delivery Status:</span>
								</div>
								<div className="text-green-600 font-medium text-right">
									{o.deliveryStatus}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Timeline card */}
				<div className="bg-white border border-[#E1E1E1] rounded-[15px] shadow-[0_0_15px_0_rgba(0,0,0,0.10)] flex flex-col justify-center items-start gap-[20px] sm:gap-[30px] p-3 sm:p-4">
					{/* Header */}
					<div className="flex w-full flex-col items-start gap-[5px]">
						<p className="font-[600] text-[16px] sm:text-[20px] leading-[20px] sm:leading-[26px] font-sans">
							1 Item Delivered
						</p>
						<p className="text-[10px] sm:text-[12px] font-normal leading-[11px] sm:leading-[13px] text-black/70">
							Product delivered on{" "}
							<span className="text-[10px] sm:text-[12px] font-[550] leading-[11px] sm:leading-[13px]">
								July 13, 2025
							</span>
						</p>
					</div>

					{/* Timeline */}
					<div className="w-full relative">
						{steps.map((s, idx) => (
							<div
								key={idx}
								className={`w-full h-[30px] sm:h-[36px] flex justify-start items-center gap-3 ${
									idx > 0 ? "mt-[35px] sm:mt-[50px]" : ""
								}`}
							>
								<FaCircle
									color="#BB0E00"
									size={8}
									className="sm:w-3 sm:h-3 flex-shrink-0"
								/>
								<div className="flex flex-col items-start gap-[1px] sm:gap-[2px]">
									<p className="text-[12px] sm:text-[14px] font-[550] leading-[13px] sm:leading-[15px]">
										{s.label}
									</p>
									<p className="text-[10px] sm:text-[12px] font-normal leading-[12px] sm:leading-[15px] text-black/70">
										{s.date}
									</p>
								</div>
							</div>
						))}

						{/* Vertical connectors */}
						{steps.slice(0, -1).map((_, idx) => (
							<div
								key={idx}
								className={`absolute left-[3.5px] sm:left-[-10px] ${
									idx === 0
										? "top-[25px] sm:top-[30px]"
										: "bottom-[30px] sm:bottom-[40px]"
								}`}
							>
								<PiLineVertical
									size={24}
									color="#BB0E00"
									className="h-[35px] sm:h-[51px] sm:w-8"
								/>
							</div>
						))}
					</div>
				</div>

				{/* Product card */}
				<div className="bg-white rounded-2xl p-3 sm:p-4 shadow-soft border border-gray-100 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center sm:justify-start">
					<img
						src={o.product.img}
						alt={o.product.title}
						className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-lg shadow-sm flex-shrink-0"
					/>

					<div className="flex-1 w-full">
						<div className="flex items-start justify-between gap-2 sm:gap-4">
							<div className="flex-1 text-center sm:text-left">
								<div className="font-semibold text-sm sm:text-base">
									{o.product.title}
								</div>
								<div className="text-xs text-gray-500">ORD-{o.orderId}</div>
								<div className="text-xs text-gray-600 mt-1 sm:mt-2">
									Qty: {o.product.qty}
								</div>

								{/* Price & Rating BELOW Qty */}
								<div className="mt-1 text-sm font-semibold">
									{o.product.price}
								</div>
								<div className="flex items-center justify-center sm:justify-start gap-1 text-xs text-gray-600 mt-1">
									<img
										src="/images/SevenMukhiRudraksh.png"
										alt="star"
										className="w-3 h-3 flex-shrink-0"
									/>
									<span className="whitespace-nowrap">
										{o.product.rating} ({o.product.reviews} reviews)
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Actions */}
				<div className="flex flex-col gap-3">
					<button className="w-full text-white font-medium py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-[#BB0E00] to-[#FA5446] hover:opacity-95 transition text-sm sm:text-base border-0 outline-none">
						Return Product
					</button>

					<div className="rounded-lg p-[1px] bg-gradient-to-r from-[#BB0E00] to-[#FA5446]">
						<button className="w-full bg-white py-2.5 sm:py-3 rounded-lg text-[#BB0E00] font-medium text-sm sm:text-base">
							Cancel Product
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
