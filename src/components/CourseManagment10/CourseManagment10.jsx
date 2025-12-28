import { useParams, useNavigate } from "react-router-dom";
import {
	useProductQuery,
	useDeleteProductMutation,
} from "../../hooks/useProductsApi";
import { RiProgress7Line } from "react-icons/ri";
import { TbAlertCircleFilled, TbHelpSquareFilled } from "react-icons/tb";
import { TiImage } from "react-icons/ti";
import { useState } from "react";

function ProductDetailsPage() {
	const { productId } = useParams();
	const navigate = useNavigate();
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const { data: product, isLoading, error } = useProductQuery(productId);
	const deleteProductMutation = useDeleteProductMutation({
		onSuccess: () => {
			navigate("/admin/product-overview");
		},
	});

	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this product?")) {
			deleteProductMutation.mutate(productId);
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BB0E00]"></div>
			</div>
		);
	}

	if (error || !product) {
		return (
			<div className="flex flex-col justify-center items-center min-h-[400px]">
				<p className="text-red-600 mb-4">
					Product not found or error loading product.
				</p>
				<button
					onClick={() => navigate("/admin/product-overview")}
					className="px-4 py-2 bg-[#BB0E00] text-white rounded-lg"
				>
					Back to Products
				</button>
			</div>
		);
	}

	const productImages = product.images || [];
	const currentImage =
		productImages.length > 0
			? productImages[currentImageIndex]?.url ||
			  productImages[currentImageIndex]
			: "/images/SevenMukhiRudraksh.png";

	return (
		<div className="p-4 sm:p-6">
			{/* Back Button */}
			<button
				onClick={() => navigate("/admin/product-overview")}
				className="mb-4 text-[#BB0E00] hover:underline flex items-center gap-2"
			>
				← Back to Products
			</button>

			{/* Main Content */}
			<div className="flex flex-col items-center gap-6 mt-6 w-full lg:flex-row lg:items-start lg:gap-[90px] lg:mt-10">
				{/* Product Images */}
				<div className="flex flex-col items-center gap-4 w-full max-w-[352px] lg:w-[352px]">
					<div className="rounded-[10px] w-full bg-gray-100">
						<img
							src={currentImage}
							alt={product.title}
							className="w-full max-w-[280px] h-[280px] mx-auto lg:max-w-[352px] lg:h-[351px] object-cover"
						/>
					</div>
					{/* Image Navigation Dots */}
					{productImages.length > 1 && (
						<div className="flex justify-center items-center gap-2 w-full">
							{productImages.map((_, index) => (
								<div
									key={index}
									onClick={() => setCurrentImageIndex(index)}
									className={`rounded-[46px] cursor-pointer transition-all ${
										index === currentImageIndex
											? "bg-[#C50200] w-8 h-2.5 lg:w-[32px] lg:h-[10px]"
											: "bg-[#C0C0C0] w-2.5 h-2.5 lg:w-[10px] lg:h-[10px]"
									}`}
								/>
							))}
						</div>
					)}
				</div>

				{/* Product Info */}
				<div className="flex flex-col items-center gap-6 w-full max-w-[307px] lg:w-[307px] lg:items-start">
					<div className="flex flex-col items-center gap-3 lg:items-start">
						<p className="text-[18px] font-semibold leading-[24px] text-center sm:text-[20px] sm:leading-[26px] sm:text-left font-['SF_Pro']">
							{product.title}
						</p>
						<p className="text-black/70 text-[11px] font-normal leading-[14px] text-center sm:text-[12px] sm:leading-[16px] sm:text-left font-['SF_Pro']">
							Code: {product.productCode || product._id.slice(-8)}
						</p>
						<div className="flex items-center gap-2.5">
							<p className="text-[16px] font-medium text-center sm:text-[18px] sm:text-left font-['SF_Pro']">
								₹{product.price}
							</p>
						</div>
					</div>
					<div className="flex flex-col items-center gap-3 w-full lg:items-start">
						<button
							onClick={() => navigate(`/admin/products/${productId}/edit`)}
							className="w-full h-10 flex justify-center items-center text-white text-[11px] font-semibold leading-[14px] text-center sm:text-[12px] sm:leading-[16px] rounded-[5px] bg-gradient-to-b from-[#BB0E00] to-[#B94400] border border-[#BB0E00] shadow-[inset_0_4px_12.4px_rgba(255,255,255,0.25)]"
						>
							Edit Product
						</button>
						<button
							onClick={handleDelete}
							disabled={deleteProductMutation.isPending}
							className="w-full h-10 flex justify-center items-center text-[#BB0E00] text-[11px] font-semibold leading-[14px] text-center sm:text-[12px] sm:leading-[16px] rounded-[5px] border border-[#BB0E00] shadow-[inset_0_4px_12.4px_rgba(255,255,255,0.25)] disabled:opacity-50"
						>
							{deleteProductMutation.isPending
								? "Deleting..."
								: "Delete Product"}
						</button>
					</div>
				</div>

				{/* Product Meta */}
				<div className="grid grid-cols-1 gap-4 w-full max-w-[370px] sm:grid-cols-2 sm:gap-5 sm:w-[370px] lg:w-[370px]">
					{[
						{
							icon: (
								<TiImage size={18} color="red" className="sm:size-[22px]" />
							),
							label: "Added On",
							value: new Date(product.createdAt).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
							}),
						},
						{
							icon: (
								<TbHelpSquareFilled
									size={18}
									color="red"
									className="sm:size-[22px]"
								/>
							),
							label: "Category",
							value: product.category || "Uncategorized",
						},
						{
							icon: (
								<RiProgress7Line
									size={18}
									color="red"
									className="sm:size-[22px]"
								/>
							),
							label: "Rating",
							value: product.rating?.average
								? `${product.rating.average.toFixed(1)} ⭐`
								: "No ratings",
						},
						{
							icon: (
								<TbAlertCircleFilled
									size={18}
									color="red"
									className="sm:size-[22px]"
								/>
							),
							label: "Stock",
							value: `${product.quantity || 0} Units`,
						},
					].map((item, index) => (
						<div
							key={index}
							className="flex items-center p-2 pr-8 border border-[#E1E1E1] rounded-[15px] bg-[#F8F8F8] shadow-[0_0_15px_rgba(0,0,0,0.1)] w-full max-w-[166px] h-[100px] mx-auto sm:h-[121px]"
						>
							<div className="flex flex-col items-center gap-2 sm:items-start">
								<div className="flex justify-center items-center w-[40px] h-[40px] sm:w-[49px] sm:h-[49px] rounded-[5px] bg-[#FFB3AD]">
									{item.icon}
								</div>
								<p className="text-[11px] font-normal leading-normal text-center sm:text-[13px] sm:text-left font-['SF_Pro']">
									{item.label}
								</p>
								<p className="text-[14px] font-semibold leading-normal text-center sm:text-[16px] sm:text-left font-['SF_Pro']">
									{item.value}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Product Description */}
			<div className="flex flex-col items-start gap-4 mt-8 w-full px-4 sm:mt-[45px] sm:gap-[15px]">
				<div>
					<p className="text-[18px] font-semibold leading-normal sm:text-[20px] font-['SF_Pro']">
						Product Details:
					</p>
				</div>
				<div>
					<p className="text-black/65 text-[14px] font-normal leading-normal sm:text-[16px] font-['SF_Pro']">
						{product.description ||
							"No description available for this product."}
					</p>
				</div>
			</div>

			{/* Footer */}
			<p className="text-center text-[13px] font-medium text-black/60 mt-6 sm:text-[15px] sm:mt-[30px] font-['SF_Pro']">
				© 2025 Vastu Abhishek, All rights reserved.
			</p>
		</div>
	);
}

export default ProductDetailsPage;
