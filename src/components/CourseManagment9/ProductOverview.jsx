import { useNavigate } from "react-router-dom";
import { useProductsQuery } from "../../hooks/useProductsApi";
import { useState } from "react";
import ProductFormModal from "./ProductFormModal";

function ProductOverview() {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);

	const { data: products = [], isLoading, error } = useProductsQuery();

	console.log("Products data:", products);

	const filteredProducts = products.filter((product) =>
		product.title?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleAddProduct = () => {
		setEditingProduct(null);
		setIsModalOpen(true);
	};

	const handleEditProduct = (product, e) => {
		e.stopPropagation();
		setEditingProduct(product);
		setIsModalOpen(true);
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BB0E00]"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<p className="text-red-600">
					Error loading products. Please try again.
				</p>
			</div>
		);
	}

	return (
		<div className="p-4 sm:p-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-800">Product Overview</h1>
					<p className="text-gray-600 mt-1">
						Manage your products and inventory
					</p>
				</div>
				<button
					onClick={handleAddProduct}
					className="bg-[#BB0E00] text-white px-6 py-3 rounded-lg hover:bg-[#A00D00] transition-colors flex items-center gap-2 font-semibold shadow-md"
				>
					<span className="text-xl">+</span>
					Add Product
				</button>
			</div>

			<div className="mb-6">
				<input
					type="text"
					placeholder="Search products by title..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB0E00] focus:border-transparent"
				/>
			</div>

			{filteredProducts.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-gray-500 text-lg">
						{searchTerm
							? "No products found matching your search"
							: "No products available"}
					</p>
					{!searchTerm && (
						<button
							onClick={handleAddProduct}
							className="mt-4 text-[#BB0E00] hover:underline font-semibold"
						>
							Add your first product
						</button>
					)}
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{filteredProducts.map((product) => (
						<div
							key={product._id}
							className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
						>
							<div
								className="relative h-48 bg-gray-100 cursor-pointer"
								onClick={() =>
									navigate(`/admin/product-details/${product._id}`)
								}
							>
								{product.images && product.images.length > 0 ? (
									<img
										src={product.images[0].url || product.images[0]}
										alt={product.title}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-gray-400">
										<span>No Image</span>
									</div>
								)}
								{product.quantity <= 5 && (
									<div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
										Low Stock
									</div>
								)}
							</div>

							<div className="p-4">
								<h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">
									{product.title}
								</h3>
								<p className="text-sm text-gray-500 mb-2">
									Code: {product.productCode || product._id.slice(-8)}
								</p>

								<div className="flex items-center gap-2 mb-3">
									<span className="text-xl font-bold text-[#BB0E00]">
										₹{product.price}
									</span>
								</div>

								<div className="flex justify-between items-center text-sm mb-4">
									<span className="text-gray-600">
										Stock:{" "}
										<span className="font-semibold">
											{product.quantity || 0}
										</span>
									</span>
									<span className="text-gray-600 truncate ml-2">
										{product.category || "Other"}
									</span>
								</div>

								<div className="flex gap-2">
									<button
										className="flex-1 bg-[#BB0E00] text-white py-2 rounded-lg hover:bg-[#A00D00] transition-colors text-sm font-medium"
										onClick={() =>
											navigate(`/admin/product-details/${product._id}`)
										}
									>
										View
									</button>
									<button
										className="flex-1 border border-[#BB0E00] text-[#BB0E00] py-2 rounded-lg hover:bg-[#BB0E00] hover:text-white transition-colors text-sm font-medium"
										onClick={(e) => handleEditProduct(product, e)}
									>
										Edit
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{isModalOpen && (
				<ProductFormModal
					product={editingProduct}
					isOpen={isModalOpen}
					onClose={() => {
						setIsModalOpen(false);
						setEditingProduct(null);
					}}
				/>
			)}
		</div>
	);
}

export default ProductOverview;
