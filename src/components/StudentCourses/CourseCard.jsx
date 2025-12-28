import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaCheck } from "react-icons/fa";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/slices/authSlice";
import { ROLES } from "../../utils/constants";
import { useAddToCartMutation, useCartQuery } from "../../hooks/useCartApi";
import { useEnrolledCoursesQuery } from "../../hooks/useEnrolledCoursesApi";
import ImageWithFallback from "../common/ImageWithFallback";

export default function CourseCard({ course }) {
	const navigate = useNavigate();
	const currentUser = useAppSelector(selectCurrentUser);
	const isAdmin =
		currentUser?.role === ROLES.ADMIN || currentUser?.role === ROLES.ASTROLOGER;

	const { mutate: addToCart, isPending } = useAddToCartMutation();
	const { data: cartData } = useCartQuery();
	const { data: enrolledCourses = [] } = useEnrolledCoursesQuery();

	const [isInCart, setIsInCart] = useState(false);
	const [isEnrolled, setIsEnrolled] = useState(false);

	// Check if course is already in cart
	useEffect(() => {
		if (cartData?.items) {
			const inCart = cartData.items.some(
				(item) => item.productId === course._id && item.kind === "Course"
			);
			setIsInCart(inCart);
		}
	}, [cartData, course._id]);

	// Check if user is already enrolled
	useEffect(() => {
		if (enrolledCourses.length > 0) {
			const enrolled = enrolledCourses.some((c) => c._id === course._id);
			setIsEnrolled(enrolled);
		}
	}, [enrolledCourses, course._id]);

	const handleAddToCart = (e) => {
		e.stopPropagation(); // Prevent card navigation

		// Check if user is logged in
		if (!currentUser) {
			navigate("/auth/login");
			return;
		}

		addToCart({
			productId: course._id,
			quantity: 1,
			kind: "Course",
		});
	};

	// Function to truncate description to 10 words
	const truncateDescription = (text, wordLimit) => {
		if (!text) return "";
		const words = text.split(" ");
		return words.length > wordLimit
			? words.slice(0, wordLimit).join(" ") + "..."
			: text;
	};

	// Resolve image URL with backend prefix if course.image is relative
	const imageSrc = useMemo(() => {
		const src = course?.image;
		if (!src) return undefined;
		if (/^https?:\/\//i.test(src)) return src;
		const baseUrl = import.meta.env.VITE_BACKEND_URL;
		if (!baseUrl) return src; // fallback to whatever is provided
		const normalized = src.startsWith("/") ? src.slice(1) : src;
		return `${baseUrl}/${normalized}`;
	}, [course?.image]);

	return (
		<div
			key={course._id}
			className="flex flex-col shadow-lg border border-gray-200 overflow-hidden rounded-2xl bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
		>
			{/* Clickable Image */}
			<div
				className="cursor-pointer overflow-hidden group"
				onClick={() => navigate(`/course/${course._id}`)}
			>
				<ImageWithFallback
					src={imageSrc}
					alt={course.title}
					className="h-[200px] w-full object-cover transition-transform duration-300 group-hover:scale-110"
				/>
			</div>

			{/* Content */}
			<div className="flex flex-col flex-grow p-4">
				<h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
					{course.title}
				</h3>
				<p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
					{truncateDescription(course.description, 10)}
				</p>

				{/* Price Section */}
				<div className="flex items-center gap-3 mb-4">
					<span className="font-bold text-2xl text-gray-900">
						₹{course.price?.toLocaleString()}
					</span>
					{course.originalPrice && course.originalPrice > course.price && (
						<span className="text-gray-400 line-through text-sm">
							₹{course.originalPrice?.toLocaleString()}
						</span>
					)}
					{course.originalPrice && course.originalPrice > course.price && (
						<span className="ml-auto bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
							{Math.round(
								((course.originalPrice - course.price) / course.originalPrice) *
									100
							)}
							% OFF
						</span>
					)}
				</div>

				{/* Action Buttons */}
				<div className="flex items-center gap-2">
					{!isAdmin && (
						<>
							{isEnrolled ? (
								<button
									className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-default text-sm font-medium shadow-sm"
									disabled
								>
									<FaCheck className="w-4 h-4" />
									Enrolled
								</button>
							) : isInCart ? (
								<button
									className="flex-1 bg-orange-500 text-white px-4 py-2.5 rounded-lg cursor-pointer hover:bg-orange-600 transition-colors text-sm font-medium shadow-sm"
									onClick={() => navigate("/cart")}
								>
									Go to Cart
								</button>
							) : (
								<button
									className="flex-1 bg-gradient-to-r from-red-600 to-red-500 px-4 py-2.5 text-white rounded-lg cursor-pointer hover:from-red-700 hover:to-red-600 transition-all flex items-center justify-center gap-2 text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
									onClick={handleAddToCart}
									disabled={isPending}
								>
									{isPending ? (
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
						</>
					)}
					{isAdmin && (
						<button
							className="w-full px-4 py-2.5 text-gray-800 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-all text-sm font-medium"
							onClick={() => navigate(`/course/${course._id}`)}
						>
							View Details
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
