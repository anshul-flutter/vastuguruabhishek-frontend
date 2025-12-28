import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
	useAboutQuery,
	useUpdateAboutMutation,
} from "../../hooks/useContentApi";
import { FaUpload, FaTrash, FaPlus } from "react-icons/fa";

const EditAboutUs = () => {
	const { data: aboutData, isLoading } = useAboutQuery();
	const [imagePreview, setImagePreview] = useState(null);

	const updateAboutMutation = useUpdateAboutMutation();

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			description: aboutData?.description || "",
			services:
				aboutData?.services && aboutData.services.length > 0
					? aboutData.services
					: [""],
			customerCareNumber: aboutData?.customerCareNumber || "",
			contactEmail: aboutData?.contactEmail || "",
			image: null,
		},
		validationSchema: Yup.object({
			description: Yup.string().required("Description is required"),
			services: Yup.array().of(Yup.string().required("Service is required")),
			customerCareNumber: Yup.string().required(
				"Customer care number is required"
			),
			contactEmail: Yup.string()
				.email("Invalid email")
				.required("Contact email is required"),
		}),
		onSubmit: (values) => {
			const formData = new FormData();
			formData.append("description", values.description);
			formData.append("customerCareNumber", values.customerCareNumber);
			formData.append("contactEmail", values.contactEmail);

			values.services.forEach((service, index) => {
				formData.append(`services[${index}]`, service);
			});

			if (values.image) {
				formData.append("image", values.image);
			}

			updateAboutMutation.mutate(formData);
		},
	});

	useEffect(() => {
		if (aboutData?.image) {
			setImagePreview(aboutData.image);
		}
	}, [aboutData]);

	const handleImageChange = (event) => {
		const file = event.currentTarget.files[0];
		if (file) {
			formik.setFieldValue("image", file);
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const addService = () => {
		formik.setFieldValue("services", [...formik.values.services, ""]);
	};

	const removeService = (index) => {
		const newServices = [...formik.values.services];
		newServices.splice(index, 1);
		formik.setFieldValue("services", newServices);
	};

	if (isLoading) return <div className="p-6">Loading...</div>;

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
			<h2 className="text-2xl font-bold mb-6 text-gray-800">Edit About Us</h2>

			<form onSubmit={formik.handleSubmit} className="space-y-6">
				{/* Image Upload */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						About Image
					</label>
					<div className="flex items-center gap-4">
						<div className="w-40 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
							{imagePreview ? (
								<img
									src={imagePreview}
									alt="Preview"
									className="w-full h-full object-cover"
								/>
							) : (
								<span className="text-gray-400 text-sm">No image</span>
							)}
						</div>
						<label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition flex items-center gap-2">
							<FaUpload />
							<span>Upload Image</span>
							<input
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleImageChange}
							/>
						</label>
					</div>
				</div>

				{/* Description */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Description
					</label>
					<textarea
						name="description"
						rows="5"
						className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 outline-none"
						{...formik.getFieldProps("description")}
					/>
					{formik.touched.description && formik.errors.description && (
						<p className="text-red-500 text-sm mt-1">
							{formik.errors.description}
						</p>
					)}
				</div>

				{/* Contact Info */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Customer Care Number
						</label>
						<input
							type="text"
							className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 outline-none"
							{...formik.getFieldProps("customerCareNumber")}
						/>
						{formik.touched.customerCareNumber &&
							formik.errors.customerCareNumber && (
								<p className="text-red-500 text-sm mt-1">
									{formik.errors.customerCareNumber}
								</p>
							)}
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Contact Email
						</label>
						<input
							type="email"
							className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 outline-none"
							{...formik.getFieldProps("contactEmail")}
						/>
						{formik.touched.contactEmail && formik.errors.contactEmail && (
							<p className="text-red-500 text-sm mt-1">
								{formik.errors.contactEmail}
							</p>
						)}
					</div>
				</div>

				{/* Services */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Services
					</label>
					<div className="space-y-3">
						{formik.values.services.map((service, index) => (
							<div key={index} className="flex gap-2">
								<input
									type="text"
									name={`services[${index}]`}
									value={service}
									onChange={formik.handleChange}
									className="flex-1 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 outline-none"
									placeholder="Service name"
								/>
								<button
									type="button"
									onClick={() => removeService(index)}
									className="text-red-500 p-3 hover:bg-red-50 rounded-md transition"
									disabled={formik.values.services.length === 1}
								>
									<FaTrash />
								</button>
							</div>
						))}
					</div>
					<button
						type="button"
						onClick={addService}
						className="mt-3 text-blue-600 flex items-center gap-2 hover:text-blue-800 font-medium"
					>
						<FaPlus /> Add Service
					</button>
					{formik.touched.services &&
						formik.errors.services &&
						typeof formik.errors.services === "string" && (
							<p className="text-red-500 text-sm mt-1">
								{formik.errors.services}
							</p>
						)}
				</div>

				{/* Submit Button */}
				<div className="pt-4">
					<button
						type="submit"
						disabled={updateAboutMutation.isPending}
						className="bg-[#BB0E00] text-white px-8 py-3 rounded-md hover:bg-[#a00c00] transition disabled:opacity-70 font-medium w-full md:w-auto"
					>
						{updateAboutMutation.isPending ? "Saving..." : "Save Changes"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditAboutUs;
