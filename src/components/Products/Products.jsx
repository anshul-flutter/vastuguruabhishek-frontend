import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "../common/cards";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/slices/authSlice";
import { ROLES } from "../../utils/constants";
import apiClient from "../../utils/apiClient";
import product1 from "../../assets/product1.png";
import product2 from "../../assets/product2.png";
import product3 from "../../assets/product3.png";
import product4 from "../../assets/product4.png";
import product5 from "../../assets/product5.png";

const categories = [
	{ name: "Gemstones", image: product1 },
	{ name: "Rudraksha", image: product2 },
	{ name: "Pooja Items", image: product3 },
	{ name: "Spiritual Books", image: product4 },
	{ name: "Color Gemstone", image: product5 },
];

const Products = () => {
	const navigate = useNavigate();
	const currentUser = useAppSelector(selectCurrentUser);
	const isAdmin =
		currentUser?.role === ROLES.ASTROLOGER || currentUser?.role === ROLES.ADMIN;

	const [selectedCategory, setSelectedCategory] = useState("All");
	const [searchQuery, setSearchQuery] = useState("");

	// Fetch products from API
	const {
		data: products = [],
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["products"],
		queryFn: async () => {
			const response = await apiClient.get("/products");
			return response.data.data || [];
		},
	});

	// Filter products by category and search
	const filteredProducts = products.filter((product) => {
		const matchesCategory =
			selectedCategory === "All" || product.category === selectedCategory;
		const matchesSearch = product.title
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		return matchesCategory && matchesSearch && product.isActive;
	});

	const handleEdit = (product) => {
		navigate(`/admin/edit-product/${product._id}`);
	};

	const handleDelete = (productId) => {
		if (!window.confirm("Are you sure you want to delete this product?"))
			return;
		// TODO: Implement delete mutation
		console.log("Delete product:", productId);
	};

	return (
		<div className="px-[1rem] py-6">
			{/* Page Title */}
			<h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
				Spiritual Products
			</h1>

			{/* Search Bar */}
			<div className="max-w-2xl mx-auto mb-6">
				<input
					type="text"
					placeholder="Search products..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c02c07]"
				/>
			</div>

			{/* Categories */}
			<div className="flex flex-wrap justify-center gap-4 mb-6">
				<button
					onClick={() => setSelectedCategory("All")}
					className={`px-6 py-2 rounded-xl font-medium transition ${
						selectedCategory === "All"
							? "bg-[#c02c07] text-white"
							: "bg-[#ffe6e3] text-gray-700 hover:bg-[#ffd5bd]"
					}`}
				>
					All Products
				</button>
				{categories.map((cat) => (
					<button
						key={cat.name}
						onClick={() => setSelectedCategory(cat.name)}
						className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition ${
							selectedCategory === cat.name
								? "border-[#c02c07] bg-[#c02c07] text-white"
								: "border-[#FFA4A4] bg-[#ffe6e3] hover:bg-[#ffd5bd]"
						}`}
					>
						<img
							src={cat.image}
							alt={cat.name}
							className="h-8 w-8 object-contain"
						/>
						<span className="text-sm font-medium">{cat.name}</span>
					</button>
				))}
			</div>

			{/* Slider Banner */}
			<div className="bg-[#ffe6e3] rounded-xl flex items-center justify-center mb-8 py-[1rem]">
				<div className="w-[300px] h-[300px] rounded-lg border border-gray-300 relative bg-gradient-to-t from-gray-400 to-gray-200 p-[10px]">
					<img
						src="/images/diamond.webp"
						alt="New Arrival"
						className="rounded-lg object-cover h-full w-full"
					/>
					<div className="absolute w-full flex items-center bottom-0 left-0 h-[80px] bg-black/30 backdrop-blur-[3px] text-white px-4 py-2 rounded-md">
						New Gemstones Arrival! • Get ₹999
					</div>
				</div>
			</div>

			{/* Products Section */}
			<h2 className="text-center text-2xl font-semibold mb-4 text-gray-800">
				{selectedCategory === "All"
					? "All Products"
					: `${selectedCategory} Products`}
			</h2>

			{/* Loading State */}
			{isLoading && (
				<div className="flex justify-center items-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c02c07]"></div>
				</div>
			)}

			{/* Error State */}
			{isError && (
				<div className="text-center py-12">
					<p className="text-red-600 mb-4">
						{error?.response?.data?.message || "Failed to load products"}
					</p>
					<button
						onClick={() => window.location.reload()}
						className="bg-[#c02c07] text-white px-6 py-2 rounded-lg hover:bg-[#a02506]"
					>
						Retry
					</button>
				</div>
			)}

			{/* Products Grid */}
			{!isLoading && !isError && (
				<>
					{filteredProducts.length > 0 ? (
						<div className="flex gap-[1rem] flex-wrap justify-center px-[1rem]">
							{filteredProducts.map((product) => (
								<ProductCard
									key={product._id}
									product={product}
									isAdmin={isAdmin}
									onEdit={handleEdit}
									onDelete={handleDelete}
									layout="horizontal"
								/>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<p className="text-gray-600 text-lg">
								{searchQuery
									? `No products found for "${searchQuery}"`
									: `No products available in ${selectedCategory}`}
							</p>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default Products;
