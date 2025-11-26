import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillPatchCheckFill, BsPatchCheck } from "react-icons/bs";
import { IoIosStar } from "react-icons/io";
import { PiStudentFill } from "react-icons/pi";
import { FaShoppingCart, FaCheck } from "react-icons/fa";
import { useAddToCartMutation, useCartQuery } from "../../hooks/useCartApi";
import { useEnrolledCoursesQuery } from "../../hooks/useEnrolledCoursesApi";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/slices/authSlice";

const ReviewCard = ({ crsDetails, disableActions = false }) => {
	const navigate = useNavigate();
	const currentUser = useAppSelector(selectCurrentUser);
	const actionDisabled = Boolean(disableActions);
	const { mutate: addToCart, isPending } = useAddToCartMutation();
	const { data: cartData } = useCartQuery();
	const { data: enrolledCourses = [] } = useEnrolledCoursesQuery();

	const [isInCart, setIsInCart] = useState(false);
	const [isEnrolled, setIsEnrolled] = useState(false);

	// Check if course is already in cart
	useEffect(() => {
		if (cartData?.items && crsDetails?._id) {
			const inCart = cartData.items.some(
				(item) => item.productId === crsDetails._id && item.kind === "Course"
			);
			setIsInCart(inCart);
		}
	}, [cartData, crsDetails]);

	// Check if user is already enrolled
	useEffect(() => {
		if (enrolledCourses.length > 0 && crsDetails?._id) {
			const enrolled = enrolledCourses.some((c) => c._id === crsDetails._id);
			setIsEnrolled(enrolled);
		}
	}, [enrolledCourses, crsDetails]);

	const handleAddToCart = () => {
		// Check if user is logged in
		if (!currentUser) {
			navigate("/auth/login");
			return;
		}

		addToCart({
			productId: crsDetails._id,
			quantity: 1,
			kind: "Course",
		});
	};

	const handleBuyCourse = () => {
		// Check if user is logged in
		if (!currentUser) {
			navigate("/auth/login");
			return;
		}

		if (isEnrolled) {
			// Navigate to the course
			navigate(`/course/${crsDetails._id}`);
		} else if (isInCart) {
			// Navigate to cart for checkout
			navigate("/cart");
		} else {
			// Add to cart and navigate to checkout
			addToCart(
				{
					productId: crsDetails._id,
					quantity: 1,
					kind: "Course",
				},
				{
					onSuccess: () => {
						navigate("/cart-page");
					},
				}
			);
		}
	};

	return (
		<div className="w-[430px] bg-white p-[.75rem] rounded-xl min-shadow">
			<img
				src={crsDetails.image}
				alt=""
				className="object-cover h-[200px] object-center w-full"
			/>
			<div className="text-black my-[1rem]">
				<h3 className="text-[1.25rem] font-semibold">{crsDetails.title}</h3>
				<p className="leading-tight">{crsDetails.description}</p>
				<p className="text-sm text-black/70">
					Created By: {crsDetails.createdBy?.name || "Admin"}
				</p>
			</div>
			<div className="flex gap-[.5rem] overflow-hidden rounded-xl  pr-[5px] border-2 border-gray-300 text-gray-700">
				<div className="flex-1 flex flex-col items-center justify-center text-white bg-[#BB0E00]">
					<BsPatchCheck size={22} /> <span className="text-sm">Premium</span>{" "}
				</div>

				<div className="flex-1 text-sm p-[5px]">
					Master advanced skills with expert guidance.
				</div>
				<div className="flex flex-col items-center p-[5px]">
					<span>{crsDetails.rating}</span>
					<span className="flex items-center">
						{[...Array(Math.floor(crsDetails.rating))].map((_, i) => (
							<IoIosStar key={i} className="text-yellow-400 inline" />
						))}
					</span>
					<span className="text-sm">Ratings</span>
				</div>
				<div className="flex flex-col items-center p-[5px]">
					<span className="">
						<PiStudentFill size={22} />{" "}
					</span>
					<span>{crsDetails.learners}</span>
					<span className="text-sm leading-tight">Learners</span>
				</div>
			</div>
			<button
				className={`mt-[1rem] w-full rounded-md py-[8px] text-white transition ${
					actionDisabled
						? "bg-gray-300 cursor-not-allowed"
						: isEnrolled
						? "bg-green-600 hover:bg-green-700 cursor-pointer"
						: isInCart
						? "bg-orange-500 hover:bg-orange-600 cursor-pointer"
						: isPending
						? "bg-gray-400 cursor-wait"
						: "bg-[#BB0E00] hover:opacity-90 cursor-pointer"
				}`}
				type="button"
				disabled={actionDisabled || isPending}
				onClick={handleBuyCourse}
			>
				{actionDisabled ? (
					"Unavailable for Admins"
				) : isEnrolled ? (
					<span className="flex items-center justify-center gap-2">
						<FaCheck /> Enrolled
					</span>
				) : isInCart ? (
					"Go to Cart & Checkout"
				) : isPending ? (
					"Processing..."
				) : (
					"Buy Course Now"
				)}
			</button>
			<button
				className={`w-full rounded-md font-semibold border-2 py-[6px] mt-[10px] transition ${
					actionDisabled
						? "border-gray-300 text-gray-400 cursor-not-allowed"
						: isEnrolled
						? "border-green-600 text-green-600 bg-green-50 cursor-not-allowed"
						: isInCart
						? "border-orange-500 text-orange-500 bg-orange-50 cursor-pointer hover:bg-orange-100"
						: isPending
						? "border-gray-300 text-gray-400 cursor-wait"
						: "border-[#BB0E00] text-[#BB0E00] hover:bg-[#BB0E00] hover:text-white cursor-pointer"
				}`}
				type="button"
				disabled={actionDisabled || isEnrolled || isPending}
				onClick={isInCart ? () => navigate("/cart") : handleAddToCart}
			>
				{actionDisabled ? (
					"Admin Access Only"
				) : isEnrolled ? (
					<span className="flex items-center justify-center gap-2">
						<FaCheck /> Already Enrolled
					</span>
				) : isInCart ? (
					"View Cart"
				) : isPending ? (
					<span className="flex items-center justify-center gap-2">
						<div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
						Adding...
					</span>
				) : (
					<span className="flex items-center justify-center gap-2">
						<FaShoppingCart /> Add to Cart
					</span>
				)}
			</button>
			{actionDisabled && (
				<p className="mt-3 text-xs text-center text-amber-600">
					Purchase actions are limited to student accounts.
				</p>
			)}
			{isInCart && !isEnrolled && !actionDisabled && (
				<p className="mt-3 text-xs text-center text-orange-600">
					This course is in your cart. Complete checkout to enroll.
				</p>
			)}
		</div>
	);
};

export default ReviewCard;
