import React, { useCallback } from "react";
import toast from "react-hot-toast";
import { useAddToCartMutation } from "../../hooks/useCartApi";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/slices/authSlice";
import { ROLES } from "../../utils/constants";

export default function BookCard({ book, onClick }) {
	const truncateDescription = (text, wordLimit) => {
		if (!text) return "";
		const words = text.split(" ");
		return words.length > wordLimit
			? words.slice(0, wordLimit).join(" ") + "..."
			: text;
	};

	const { mutate: addToCart, isPending } = useAddToCartMutation();
	const currentUser = useAppSelector(selectCurrentUser);
	const isAdmin =
		currentUser?.role === ROLES.ADMIN || currentUser?.role === ROLES.ASTROLOGER;

	const handleAddToCart = useCallback(() => {
		if (isAdmin) {
			toast.error("Admin accounts cannot add products to the cart.");
			return;
		}

		// Check for external link if single option
		if (book.languageOptions?.length === 1 && book.languageOptions[0].buyLink) {
			window.open(book.languageOptions[0].buyLink, "_blank");
			return;
		}

		// If multiple options, redirect to details
		if (book.languageOptions?.length > 1) {
			onClick(); // Navigate to details
			return;
		}

		const productId = book._id ?? book.id;
		if (!productId) {
			toast.error("Missing book identifier. Please try again later.");
			return;
		}

		addToCart({
			productId,
			quantity: 1,
			kind: book.kind ?? "Book",
		});
	}, [addToCart, book, isAdmin, onClick]);

	const isExternal =
		book.languageOptions?.length === 1 && !!book.languageOptions[0].buyLink;
	const hasMultipleOptions = (book.languageOptions?.length ?? 0) > 1;

	return (
		<div className="flex flex-col justify-between p-2 bg-white shadow-lg rounded-md">
			<div
				onClick={onClick}
				className="cursor-pointer transition-shadow duration-300 text-center w-[300px]"
			>
				<img
					src={book.image}
					alt={book.title}
					className="h-40 object-cover mx-auto rounded mb-4"
				/>
				<h3 className="font-semibold text-gray-900 mb-1 text-sm">
					{book.title}
				</h3>
				<p className="text-xs text-gray-500 mb-2">
					{truncateDescription(book.description, 10)}
				</p>
				<p className="text-sm font-semibold text-gray-900">{book.price}</p>
			</div>
			<div className="flex gap-[1rem]">
				<button className="flex-1 border-2 py-[5px] border-red-700 rounded-md text-red-700 text-sm cursor-pointer">
					View Details
				</button>
				<button
					onClick={handleAddToCart}
					disabled={(!isExternal && isPending) || isAdmin}
					className={`flex-1 py-[5px] rounded-md cursor-pointer bg-amber-800 text-white transition-opacity ${
						(!isExternal && isPending) || isAdmin
							? "opacity-60 cursor-not-allowed"
							: "hover:opacity-90"
					}`}
				>
					{isAdmin
						? "Admin Only"
						: isExternal
						? "Buy Online"
						: hasMultipleOptions
						? "View Options"
						: isPending
						? "Adding..."
						: "Add to Cart"}
				</button>
			</div>
		</div>
	);
}
