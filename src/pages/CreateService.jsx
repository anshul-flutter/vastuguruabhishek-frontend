import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

// Sub-category options based on service type
const subCategoryOptions = {
	consultation: [
		"Astrology Consultation",
		"Vastu Consultation",
		"Numerology Consultation",
		"Spiritual Guidance",
		"Other",
	],
	package: [
		"Astrology Package",
		"Vastu Package",
		"Numerology Package",
		"Numero Vastu Package",
		"Combined Package",
		"Other",
	],
	service: [
		"Vastu Analysis",
		"Birth Chart Reading",
		"Name Correction",
		"Gemstone Consultation",
		"Remedial Solutions",
		"Other",
	],
};

const CreateService = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { serviceType: initialServiceType, editId } = location.state || {};

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		price: "",
		originalPrice: "",
		category: "vastu",
		serviceType: initialServiceType || "service",
		subCategory: "",
		features: [""],
		isActive: true,
	});
	const [image, setImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [showCustomSubCategory, setShowCustomSubCategory] = useState(false);
	const [customSubCategory, setCustomSubCategory] = useState("");

	// Load service data if editing
	useEffect(() => {
		if (editId) {
			setEditMode(true);
			fetchServiceData(editId);
		}
	}, [editId]);

	// Check if subCategory is in predefined list
	useEffect(() => {
		const options = subCategoryOptions[formData.serviceType] || [];
		if (formData.subCategory && !options.includes(formData.subCategory)) {
			setShowCustomSubCategory(true);
			setCustomSubCategory(formData.subCategory);
		}
	}, [formData.subCategory, formData.serviceType]);

	const fetchServiceData = async (id) => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_BACKEND_URL}/services/${id}`,
				{ withCredentials: true }
			);
			const service = response.data.data;
			setFormData({
				title: service.title || "",
				description: service.description || "",
				price: service.price || "",
				originalPrice: service.originalPrice || "",
				category: service.category || "vastu",
				serviceType: service.serviceType || "service",
				subCategory: service.subCategory || "",
				features: service.features || [""],
				isActive: service.isActive !== undefined ? service.isActive : true,
			});
		} catch (error) {
			console.error("Error fetching service:", error);
			toast.error("Failed to load service data");
		}
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	const handleSubCategoryChange = (e) => {
		const value = e.target.value;
		if (value === "Other") {
			setShowCustomSubCategory(true);
			setFormData({ ...formData, subCategory: "" });
		} else {
			setShowCustomSubCategory(false);
			setCustomSubCategory("");
			setFormData({ ...formData, subCategory: value });
		}
	};

	const handleCustomSubCategoryChange = (e) => {
		const value = e.target.value;
		setCustomSubCategory(value);
		setFormData({ ...formData, subCategory: value });
	};

	const handleFeatureChange = (index, value) => {
		const newFeatures = [...formData.features];
		newFeatures[index] = value;
		setFormData({ ...formData, features: newFeatures });
	};

	const addFeature = () => {
		setFormData({ ...formData, features: [...formData.features, ""] });
	};

	const removeFeature = (index) => {
		const newFeatures = formData.features.filter((_, i) => i !== index);
		setFormData({ ...formData, features: newFeatures });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const data = new FormData();
			data.append("title", formData.title);
			data.append("description", formData.description);
			data.append("price", formData.price);
			data.append("originalPrice", formData.originalPrice || formData.price);
			data.append("category", formData.category);
			data.append("serviceType", formData.serviceType);
			if (formData.subCategory) {
				data.append("subCategory", formData.subCategory);
			}
			data.append(
				"features",
				JSON.stringify(formData.features.filter((f) => f.trim()))
			);
			data.append("isActive", formData.isActive);

			// Image is now optional
			if (image) {
				data.append("image", image);
			}

			if (editMode) {
				await axios.put(
					`${import.meta.env.VITE_BACKEND_URL}/services/${editId}`,
					data,
					{
						withCredentials: true,
						headers: { "Content-Type": "multipart/form-data" },
					}
				);
				toast.success("Service updated successfully!");
			} else {
				await axios.post(`${import.meta.env.VITE_BACKEND_URL}/services`, data, {
					withCredentials: true,
					headers: { "Content-Type": "multipart/form-data" },
				});
				toast.success("Service created successfully!");
			}

			// Navigate back to appropriate page based on serviceType
			const backPath =
				formData.serviceType === "consultation"
					? "/admin/consultations"
					: formData.serviceType === "package"
					? "/admin/packages"
					: "/admin/services";
			navigate(backPath);
		} catch (error) {
			console.error("Error saving service:", error);
			toast.error(error.response?.data?.message || "Failed to save service");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">
				{editMode ? "Edit" : "Create New"}{" "}
				{formData.serviceType === "consultation"
					? "Consultation"
					: formData.serviceType === "package"
					? "Package"
					: "Service"}
			</h1>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label className="block text-sm font-medium mb-2">
						Service Type *
					</label>
					<select
						name="serviceType"
						value={formData.serviceType}
						onChange={handleChange}
						required
						disabled={editMode}
						className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
					>
						<option value="consultation">Consultation</option>
						<option value="package">Package</option>
						<option value="service">Standalone Service</option>
					</select>
					{editMode && (
						<p className="text-sm text-gray-500 mt-1">
							Service type cannot be changed when editing
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium mb-2">
						Sub-Category (Optional)
					</label>
					<select
						value={showCustomSubCategory ? "Other" : formData.subCategory || ""}
						onChange={handleSubCategoryChange}
						className="w-full border rounded px-3 py-2"
					>
						<option value="">Select a sub-category</option>
						{subCategoryOptions[formData.serviceType]?.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
					{showCustomSubCategory && (
						<input
							type="text"
							value={customSubCategory}
							onChange={handleCustomSubCategoryChange}
							placeholder="Enter custom sub-category"
							className="w-full border rounded px-3 py-2 mt-2"
						/>
					)}
					<p className="text-sm text-gray-500 mt-1">
						Select from predefined options or choose "Other" to enter a custom
						sub-category
					</p>
				</div>
				<div>
					<label className="block text-sm font-medium mb-2">Title *</label>
					<input
						type="text"
						name="title"
						value={formData.title}
						onChange={handleChange}
						required
						className="w-full border rounded px-3 py-2"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-2">
						Description *
					</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						required
						rows={4}
						className="w-full border rounded px-3 py-2"
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium mb-2">Price *</label>
						<input
							type="number"
							name="price"
							value={formData.price}
							onChange={handleChange}
							required
							min="0"
							className="w-full border rounded px-3 py-2"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">
							Original Price
						</label>
						<input
							type="number"
							name="originalPrice"
							value={formData.originalPrice}
							onChange={handleChange}
							min="0"
							className="w-full border rounded px-3 py-2"
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium mb-2">Category *</label>
					<select
						name="category"
						value={formData.category}
						onChange={handleChange}
						required
						className="w-full border rounded px-3 py-2"
					>
						<option value="vastu">Vastu</option>
						<option value="astrology">Astrology</option>
						<option value="numerology">Numerology</option>
						<option value="spiritual">Spiritual</option>
						<option value="other">Other</option>
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium mb-2">Features</label>
					{formData.features.map((feature, index) => (
						<div key={index} className="flex gap-2 mb-2">
							<input
								type="text"
								value={feature}
								onChange={(e) => handleFeatureChange(index, e.target.value)}
								className="flex-1 border rounded px-3 py-2"
								placeholder="Enter feature"
							/>
							<button
								type="button"
								onClick={() => removeFeature(index)}
								className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
							>
								Remove
							</button>
						</div>
					))}
					<button
						type="button"
						onClick={addFeature}
						className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
					>
						Add Feature
					</button>
				</div>

				<div>
					<label className="block text-sm font-medium mb-2">
						Image (Optional)
					</label>
					<input
						type="file"
						accept="image/*"
						onChange={(e) => setImage(e.target.files[0])}
						className="w-full border rounded px-3 py-2"
					/>
					<p className="text-sm text-gray-500 mt-1">
						Upload an image for the service (optional)
					</p>
				</div>

				<div className="flex items-center">
					<input
						type="checkbox"
						name="isActive"
						checked={formData.isActive}
						onChange={handleChange}
						className="mr-2"
					/>
					<label className="text-sm font-medium">Active</label>
				</div>

				<div className="flex gap-4">
					<button
						type="submit"
						disabled={loading}
						className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
					>
						{loading
							? editMode
								? "Updating..."
								: "Creating..."
							: editMode
							? "Update Service"
							: "Create Service"}
					</button>
					<button
						type="button"
						onClick={() => {
							const backPath =
								formData.serviceType === "consultation"
									? "/admin/consultations"
									: formData.serviceType === "package"
									? "/admin/packages"
									: "/admin/services";
							navigate(backPath);
						}}
						className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export default CreateService;
