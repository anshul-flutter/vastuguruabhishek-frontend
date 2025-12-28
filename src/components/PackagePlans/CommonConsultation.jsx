import React from "react";
import { FaCaretRight, FaShoppingCart, FaEdit, FaTrash } from "react-icons/fa";

// 🔹 Reusable Card Component for Services/Consultations/Packages
function CommonConsultation({
	plan,
	style,
	isAdmin = false,
	onEdit,
	onDelete,
	serviceId,
}) {
	return (
		<div
			className={`p-6 flex flex-col justify-between shadow-lg rounded-bl-2xl rounded-tr-2xl ${style.gradient} flex-1 min-w-[250px] max-w-[320px] relative`}
		>
			{/* Admin Actions */}
			{isAdmin && (
				<div className="absolute top-3 right-3 flex gap-2">
					<button
						onClick={() => onEdit && onEdit(serviceId)}
						className="p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all"
						title="Edit"
					>
						<FaEdit className="text-blue-600" />
					</button>
					<button
						onClick={() => onDelete && onDelete(serviceId)}
						className="p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all"
						title="Delete"
					>
						<FaTrash className="text-red-600" />
					</button>
				</div>
			)}

			<div>
				<h3 className="text-2xl font-bold text-center mb-2">{plan.name}</h3>
				{isAdmin && plan.subCategory && (
					<p className="text-xs text-center mb-1 opacity-70 font-semibold">
						{plan.subCategory}
					</p>
				)}
				<p className="text-sm text-center mb-4 opacity-80">{plan.desc}</p>

				<p className="text-4xl font-extrabold text-center">
					<sup className="text-[15px]">₹ </sup>
					{plan.price.toString().split(".")[0]}
					{plan.price.toString().split(".")[1] && (
						<sup className="text-[15px] font-normal">
							.{plan.price.toString().split(".")[1]}
						</sup>
					)}
				</p>
				<span className="block text-center opacity-50">
					{isAdmin ? "Price" : "Per Month"}
				</span>

				<ul className="mt-4 space-y-2">
					{plan.features.map((feature, i) => (
						<li key={i} className="flex items-start gap-2">
							<FaCaretRight className={`${style.icon} mt-1 flex-shrink-0`} />
							<span className="text-sm">{feature}</span>
						</li>
					))}
				</ul>
			</div>

			{!isAdmin && (
				<button
					className={`mt-6 px-5 py-2 font-semibold rounded-md flex items-center justify-center gap-2 mx-auto ${style.button}`}
				>
					<FaShoppingCart />
					Buy Now
				</button>
			)}
		</div>
	);
}

export default CommonConsultation;
