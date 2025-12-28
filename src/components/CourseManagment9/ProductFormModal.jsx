import { useState, useEffect } from "react";
import {
	useCreateProductMutation,
	useUpdateProductMutation,
} from "../../hooks/useProductsApi";

function ProductFormModal({ product, isOpen, onClose }) {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "Gemstones",
		price: "",
		quantity: "",
		productCode: "",
		images: [],
	});

	const [imageFiles, setImageFiles] = useState([]);
	const [imagePreviews, setImagePreviews] = useState([]);

	const createMutation = useCreateProductMutation({
		onSuccess: () => {
			onClose();
		},
	});

	const updateMutation = useUpdateProductMutation({
		onSuccess: () => {
			onClose();
		},
	});

	useEffect(() => {
		if (product) {
			setFormData({
				title: product.title || "",
				description: product.description || "",
				category: product.category || "Gemstones",
				price: product.price || "",
				quantity: product.quantity || "",
				productCode: product.productCode || "",
				images: product.images || [],
			});

			// Set existing image previews
			if (product.images && product.images.length > 0) {
				const previews = product.images.map((img) => img.url || img);
				setImagePreviews(previews);
			}
		}
	}, [product]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageChange = (e) => {
		const files = Array.from(e.target.files);
		setImageFiles(files);

		// Create preview URLs
		const previews = files.map((file) => URL.createObjectURL(file));
		setImagePreviews(previews);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formDataToSend = new FormData();
		formDataToSend.append("title", formData.title);
		formDataToSend.append("description", formData.description);
		formDataToSend.append("category", formData.category);
		formDataToSend.append("price", formData.price);
		formDataToSend.append("quantity", formData.quantity);
		formDataToSend.append("productCode", formData.productCode);

		// Append new images if any
		imageFiles.forEach((file) => {
			formDataToSend.append("images", file);
		});

		if (product) {
			// Update existing product
			updateMutation.mutate({
				productId: product._id,
				payload: formDataToSend,
			});
		} else {
			// Create new product
			createMutation.mutate(formDataToSend);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-gray-400/40 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
					<h2 className="text-2xl font-bold text-gray-800">
						{product ? "Edit Product" : "Add New Product"}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 transition-colors text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
					>
						×
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{/* Title */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Product Title *
						</label>
						<input
							type="text"
							name="title"
							value={formData.title}
							onChange={handleChange}
							required
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB0E00] focus:border-transparent"
							placeholder="Enter product title"
						/>
					</div>

					{/* Product Code */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Product Code
						</label>
						<input
							type="text"
							name="productCode"
							value={formData.productCode}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB0E00] focus:border-transparent"
							placeholder="e.g., PRD-001"
						/>
					</div>

					{/* Category */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Category *
						</label>
						<select
							name="category"
							value={formData.category}
							onChange={handleChange}
							required
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB0E00] focus:border-transparent"
						>
							<option value="Gemstones">Gemstones</option>
							<option value="Rudraksha">Rudraksha</option>
							<option value="Pooja Items">Pooja Items</option>
							<option value="Spiritual Books">Spiritual Books</option>
							<option value="Color Gemstone">Color Gemstone</option>
							<option value="Other">Other</option>
						</select>
					</div>

					{/* Price and Quantity */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Price (₹) *
							</label>
							<input
								type="number"
								name="price"
								value={formData.price}
								onChange={handleChange}
								required
								min="0"
								step="0.01"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB0E00] focus:border-transparent"
								placeholder="0.00"
							/>
						</div>
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Stock Quantity *
							</label>
							<input
								type="number"
								name="quantity"
								value={formData.quantity}
								onChange={handleChange}
								required
								min="0"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB0E00] focus:border-transparent"
								placeholder="0"
							/>
						</div>
					</div>

					{/* Description */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Description
						</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleChange}
							rows="4"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB0E00] focus:border-transparent"
							placeholder="Enter product description"
						/>
					</div>

					{/* Images */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Product Images
						</label>
						<input
							type="file"
							accept="image/*"
							multiple
							onChange={handleImageChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB0E00] focus:border-transparent"
						/>
						{imagePreviews.length > 0 && (
							<div className="mt-4 grid grid-cols-4 gap-4">
								{imagePreviews.map((preview, index) => (
									<div key={index} className="relative">
										<img
											src={preview}
											alt={`Preview ${index + 1}`}
											className="w-full h-24 object-cover rounded-lg border"
										/>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Buttons */}
					<div className="flex gap-4 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={createMutation.isPending || updateMutation.isPending}
							className="flex-1 px-6 py-3 bg-[#BB0E00] text-white rounded-lg hover:bg-[#A00D00] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{createMutation.isPending || updateMutation.isPending
								? "Saving..."
								: product
								? "Update Product"
								: "Add Product"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default ProductFormModal;
