import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaEdit, FaTrash, FaShoppingCart, FaCheck } from "react-icons/fa";
import BaseCard from "../BaseCard";
import ImageWithFallback from "../ImageWithFallback";

/**
 * BookCard - Reusable card component for displaying books
 * Supports both admin (edit/delete) and user (view/add to cart) modes
 * Includes language selection for books with multiple language options
 */
const BookCard = ({
	book,
	onEdit,
	onDelete,
	onViewDetails,
	onAddToCart,
	isDeleting = false,
	isAddingToCart = false,
	isInCart = false,
	isAdmin = false,
}) => {
	const [selectedLanguage, setSelectedLanguage] = useState(
		book.languageOptions?.[0]?.language || "English"
	);

	const truncateText = (text, wordLimit) => {
		if (!text) return "";
		const words = text.split(" ");
		return words.length > wordLimit
			? words.slice(0, wordLimit).join(" ") + "..."
			: text;
	};

	const handleViewDetails = (e) => {
		e.stopPropagation();
		if (onViewDetails) {
			onViewDetails(book);
		}
	};

	const selectedOption = book.languageOptions?.find(
		(opt) => opt.language === selectedLanguage
	);
	const isExternal = !!selectedOption?.buyLink;

	const handleAddToCart = (e) => {
		e.stopPropagation();
		if (isExternal) {
			window.open(selectedOption.buyLink, "_blank");
			return;
		}
		if (onAddToCart) {
			onAddToCart(book, selectedLanguage);
		}
	};

	const handleEdit = (e) => {
		e.stopPropagation();
		if (onEdit) {
			onEdit(book);
		}
	};

	const handleDelete = (e) => {
		e.stopPropagation();
		if (onDelete) {
			onDelete(book._id || book.id);
		}
	};

	const hasLanguageOptions =
		book.languageOptions && book.languageOptions.length > 1;

	return (
		<BaseCard className="flex flex-col h-full">
			{/* Book Image */}
			<div className="relative w-full h-48 bg-gray-100">
				<ImageWithFallback
					src={book.coverImage || book.image}
					alt={book.title}
					className="w-full h-full object-cover"
				/>
			</div>

			{/* Card Content */}
			<div className="p-4 flex-1 flex flex-col justify-between">
				<div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
						{book.title}
					</h3>
					<p className="text-sm text-gray-600 mb-3 line-clamp-3">
						{truncateText(book.description, 15)}
					</p>
				</div>

				{/* Price and Pages */}
				<div className="mt-auto">
					<div className="flex items-center justify-between mb-3">
						<span className="text-xl font-bold text-red-600">
							₹{book.price?.toLocaleString() || book.price}
						</span>
						{book.pages && (
							<span className="text-sm text-gray-500">{book.pages} pages</span>
						)}
					</div>

					{/* Language Selection (only for non-admin users with multiple languages) */}
					{!isAdmin && hasLanguageOptions && (
						<div className="mb-3">
							<label className="block text-xs font-medium text-gray-700 mb-1">
								Select Language:
							</label>
							<select
								value={selectedLanguage}
								onChange={(e) => setSelectedLanguage(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
								onClick={(e) => e.stopPropagation()}
							>
								{book.languageOptions.map((option) => (
									<option
										key={option.language}
										value={option.language}
										disabled={!option.available}
									>
										{option.language}
										{!option.available ? " (Out of Stock)" : ""}
									</option>
								))}
							</select>
						</div>
					)}

					{/* Action Buttons */}
					{isAdmin ? (
						<div className="flex gap-2">
							<button
								onClick={handleEdit}
								className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
							>
								<FaEdit />
								Edit
							</button>
							<button
								onClick={handleDelete}
								disabled={isDeleting}
								className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
							>
								<FaTrash />
								{isDeleting ? "Deleting..." : "Delete"}
							</button>
						</div>
					) : (
						<div className="flex gap-2">
							<button
								onClick={handleViewDetails}
								className="flex-1 px-3 py-2 border-2 border-red-700 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
							>
								View Details
							</button>
							{isInCart && !isExternal ? (
								<button
									onClick={handleViewDetails}
									className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
								>
									<FaCheck />
									In Cart
								</button>
							) : (
								<button
									onClick={handleAddToCart}
									disabled={isAddingToCart && !isExternal}
									className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
										isAddingToCart && !isExternal
											? "bg-amber-700 text-white cursor-wait"
											: "bg-amber-800 text-white hover:bg-amber-900"
									}`}
								>
									{isExternal ? (
										<>
											<FaShoppingCart /> Buy Online
										</>
									) : (
										<>
											<FaShoppingCart />
											{isAddingToCart ? "Adding..." : "Add to Cart"}
										</>
									)}
								</button>
							)}
						</div>
					)}
				</div>
			</div>
		</BaseCard>
	);
};

BookCard.propTypes = {
	book: PropTypes.shape({
		_id: PropTypes.string,
		id: PropTypes.string,
		title: PropTypes.string.isRequired,
		description: PropTypes.string,
		price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		coverImage: PropTypes.string,
		image: PropTypes.string,
		pages: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		languageOptions: PropTypes.arrayOf(
			PropTypes.shape({
				language: PropTypes.string.isRequired,
				available: PropTypes.bool,
				stock: PropTypes.number,
				buyLink: PropTypes.string,
			})
		),
	}).isRequired,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
	onViewDetails: PropTypes.func,
	onAddToCart: PropTypes.func,
	isDeleting: PropTypes.bool,
	isAddingToCart: PropTypes.bool,
	isInCart: PropTypes.bool,
	isAdmin: PropTypes.bool,
};

export default BookCard;
