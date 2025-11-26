import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiX, FiImage } from "react-icons/fi";
import {
	useAdminBannersQuery,
	useCreateBannerMutation,
	useUpdateBannerMutation,
	useDeleteBannerMutation,
} from "../../hooks/useBannersApi";

const AdminBanners = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingBanner, setEditingBanner] = useState(null);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		buttonText: "Learn More",
		link: "",
		background: "#bb1401",
		image: null,
		isFullImageBanner: true,
	});
	const [imagePreview, setImagePreview] = useState(null);

	// Function to get button text color based on background
	const getButtonTextColor = (background) => {
		// For gradients, use a dark color that provides good contrast on white button
		if (background && background.includes("gradient")) {
			// Check the gradient colors to determine the best contrast
			if (background.includes("#667eea") || background.includes("#764ba2")) {
				return "#4c51bf"; // Indigo for blue-purple gradient
			}
			if (background.includes("#f093fb") || background.includes("#f5576c")) {
				return "#d53f8c"; // Pink for pink gradient
			}
			if (background.includes("#4facfe") || background.includes("#00f2fe")) {
				return "#3182ce"; // Blue for cyan gradient
			}
			if (background.includes("#43e97b") || background.includes("#38f9d7")) {
				return "#38a169"; // Green for green gradient
			}
			// Default for unknown gradients
			return "#2d3748";
		}
		// If it's a solid color, use it
		if (background && background.startsWith("#")) {
			return background;
		}
		// Default fallback
		return "#bb1401";
	};
	const { data: banners = [], isLoading, error } = useAdminBannersQuery();
	const createBannerMutation = useCreateBannerMutation();
	const updateBannerMutation = useUpdateBannerMutation();
	const deleteBannerMutation = useDeleteBannerMutation();

	const resetForm = () => {
		setFormData({
			title: "",
			description: "",
			buttonText: "Learn More",
			link: "",
			background: "#bb1401",
			image: null,
			isFullImageBanner: true,
		});
		setImagePreview(null);
		setEditingBanner(null);
	};

	const openModal = (banner = null) => {
		if (banner) {
			setEditingBanner(banner);
			setFormData({
				title: banner.title,
				description: banner.description,
				buttonText: banner.buttonText || "Learn More",
				link: banner.link || "",
				background: banner.background || "#bb1401",
				image: null,
				isFullImageBanner: banner.isFullImageBanner || false,
			});
			setImagePreview(banner.image);
		} else {
			resetForm();
		}
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		resetForm();
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFormData((prev) => ({
				...prev,
				image: file,
			}));

			// Create preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.title.trim() || !formData.description.trim()) {
			return;
		}

		// Validate image is required for new banners
		if (!editingBanner && !formData.image) {
			alert("Please upload a banner image");
			return;
		}

		try {
			if (editingBanner) {
				await updateBannerMutation.mutateAsync({
					id: editingBanner._id,
					bannerData: formData,
				});
			} else {
				await createBannerMutation.mutateAsync(formData);
			}
			closeModal();
		} catch (error) {
			console.error("Error submitting banner:", error);
		}
	};

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this banner?")) {
			try {
				await deleteBannerMutation.mutateAsync(id);
			} catch (error) {
				console.error("Error deleting banner:", error);
			}
		}
	};

	if (isLoading) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading banners...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<div className="text-center text-red-600">
					<p>Error loading banners: {error.message}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full h-full overflow-y-auto scrollbar-thin">
			<div className="p-6">
				{/* Header */}
				<div className="flex justify-between items-center mb-6">
					<div>
						<h1 className="text-2xl font-bold text-gray-800">
							Banner Management
						</h1>
						<p className="text-gray-600">Manage home page banners</p>
					</div>
					<button
						onClick={() => openModal()}
						className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center gap-2"
					>
						<FiPlus className="w-4 h-4" />
						Add Banner
					</button>
				</div>

				{/* Banners Grid */}
				{banners.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-gray-400 mb-4">
							<FiImage className="w-16 h-16 mx-auto" />
						</div>
						<h3 className="text-lg font-medium text-gray-500 mb-2">
							No banners found
						</h3>
						<p className="text-gray-400 mb-4">
							Create your first banner to get started
						</p>
						<button
							onClick={() => openModal()}
							className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200"
						>
							Create Banner
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{banners.map((banner) => (
							<div
								key={banner._id}
								className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
							>
								{/* Banner Preview */}
								{banner.isFullImageBanner ? (
									<div className="h-48 relative overflow-hidden bg-gray-100">
										{banner.image ? (
											<>
												<img
													src={banner.image}
													alt="Banner"
													className="w-full h-full object-cover"
												/>
												<div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
													Full Image
												</div>
											</>
										) : (
											<div className="w-full h-full flex items-center justify-center text-gray-400">
												<FiImage className="w-12 h-12" />
											</div>
										)}
									</div>
								) : (
									<div
										className="h-48 p-4 text-white relative overflow-hidden"
										style={{
											background: banner.background,
										}}
									>
										<div className="relative z-10">
											<h3 className="text-lg font-semibold mb-2 line-clamp-2">
												{banner.title}
											</h3>
											<p className="text-sm opacity-90 mb-3 line-clamp-2">
												{banner.description}
											</p>
											<button
												className="bg-white px-3 py-1 rounded text-xs font-medium"
												style={{
													color: getButtonTextColor(banner.background),
												}}
											>
												{banner.buttonText}
											</button>
										</div>
										{banner.image && (
											<img
												src={banner.image}
												alt="Banner"
												className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-24 h-24 rounded-full object-cover opacity-80"
											/>
										)}
									</div>
								)}

								{/* Actions */}
								<div className="p-4 bg-gray-50 flex justify-between items-center">
									<div className="text-xs text-gray-500">
										Created: {new Date(banner.createdAt).toLocaleDateString()}
									</div>
									<div className="flex gap-2">
										<button
											onClick={() => openModal(banner)}
											className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
											title="Edit banner"
										>
											<FiEdit2 className="w-4 h-4" />
										</button>
										<button
											onClick={() => handleDelete(banner._id)}
											className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
											title="Delete banner"
											disabled={deleteBannerMutation.isPending}
										>
											<FiTrash2 className="w-4 h-4" />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-xl font-bold text-gray-800">
									{editingBanner ? "Edit Banner" : "Add New Banner"}
								</h2>
								<button
									onClick={closeModal}
									className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
								>
									<FiX className="w-5 h-5" />
								</button>
							</div>

							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Title *
									</label>
									<input
										type="text"
										name="title"
										value={formData.title}
										onChange={handleInputChange}
										className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
										placeholder="Enter banner title"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Description *
									</label>
									<textarea
										name="description"
										value={formData.description}
										onChange={handleInputChange}
										rows={3}
										className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
										placeholder="Enter banner description"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Button Text
									</label>
									<input
										type="text"
										name="buttonText"
										value={formData.buttonText}
										onChange={handleInputChange}
										className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
										placeholder="Learn More"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Link (Optional)
									</label>
									<input
										type="url"
										name="link"
										value={formData.link}
										onChange={handleInputChange}
										className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
										placeholder="https://example.com"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Background Color
									</label>
									<input
										type="color"
										name="background"
										value={formData.background}
										onChange={handleInputChange}
										className="w-full h-12 p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Banner Image *
									</label>
									<input
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
										required={!editingBanner}
									/>
									{imagePreview && (
										<div className="mt-2">
											<img
												src={imagePreview}
												alt="Preview"
												className="w-32 h-32 object-cover rounded-lg"
											/>
										</div>
									)}
								</div>

								<div>
									<label className="flex items-center gap-2 cursor-pointer">
										<input
											type="checkbox"
											name="isFullImageBanner"
											checked={formData.isFullImageBanner}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													isFullImageBanner: e.target.checked,
												}))
											}
											className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
										/>
										<span className="text-sm font-medium text-gray-700">
											Show as Full Image Banner
										</span>
									</label>
									<p className="text-xs text-gray-500 mt-1 ml-6">
										Enable this to display only the banner image without text
										content
									</p>
								</div>

								{/* Banner Preview */}
								<div className="border rounded-lg p-4">
									<h4 className="text-sm font-medium text-gray-700 mb-2">
										Preview:
									</h4>
									{formData.isFullImageBanner ? (
										<div className="h-32 relative overflow-hidden rounded-lg bg-gray-100">
											{imagePreview ? (
												<img
													src={imagePreview}
													alt="Preview"
													className="w-full h-full object-cover"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center text-gray-400">
													<div className="text-center">
														<FiImage className="w-12 h-12 mx-auto mb-2" />
														<p className="text-sm">
															Upload image for full banner
														</p>
													</div>
												</div>
											)}
										</div>
									) : (
										<div
											className="h-32 p-4 text-white relative overflow-hidden rounded-lg"
											style={{
												background: formData.background,
											}}
										>
											<div className="relative z-10">
												<h3 className="text-lg font-semibold mb-1 line-clamp-1">
													{formData.title || "Banner Title"}
												</h3>
												<p className="text-sm opacity-90 mb-2 line-clamp-1">
													{formData.description || "Banner description"}
												</p>
												<button
													className="bg-white px-3 py-1 rounded text-xs font-medium"
													style={{
														color: getButtonTextColor(formData.background),
													}}
												>
													{formData.buttonText || "Learn More"}
												</button>
											</div>
											{imagePreview && (
												<img
													src={imagePreview}
													alt="Preview"
													className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-16 h-16 rounded-full object-cover opacity-80"
												/>
											)}
										</div>
									)}
								</div>

								<div className="flex gap-3 pt-4">
									<button
										type="button"
										onClick={closeModal}
										className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={
											createBannerMutation.isPending ||
											updateBannerMutation.isPending
										}
										className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50"
									>
										{createBannerMutation.isPending ||
										updateBannerMutation.isPending
											? "Saving..."
											: editingBanner
											? "Update Banner"
											: "Create Banner"}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminBanners;
