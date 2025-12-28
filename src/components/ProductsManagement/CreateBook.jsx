import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useCreateBookMutation } from "../../hooks/useBooksApi";

const sanitizeCommaSeparated = (value = "") =>
	`${value}`
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);

const validationSchema = Yup.object({
	title: Yup.string().trim().required("Title is required"),
	description: Yup.string().trim(),
	price: Yup.number()
		.typeError("Price must be a number")
		.min(0, "Price must be positive"),
	pages: Yup.number()
		.typeError("Pages must be a number")
		.min(1, "Pages must be at least 1")
		.integer("Pages must be a whole number"),
	highlights: Yup.object({
		whyThisBook: Yup.string().trim(),
		difference: Yup.string().trim(),
		whoCanBuy: Yup.string().trim(),
	}),
	keyFeatures: Yup.array()
		.of(Yup.string().trim())
		.min(1, "At least one key feature is required"),
	targetAudience: Yup.string().trim(),
	languageOptions: Yup.array()
		.min(1, "Add at least one language option")
		.of(
			Yup.object({
				language: Yup.string().trim().required("Language is required"),
				stock: Yup.number()
					.typeError("Stock must be a number")
					.min(0, "Invalid stock value")
					.required("Stock is required"),
				buyLink: Yup.string()
					.trim()
					.url("Invalid buy link")
					.nullable()
					.notRequired(),
				available: Yup.boolean(),
			})
		),
});

const createLanguageOption = () => ({
	language: "",
	stock: 0,
	buyLink: "",
	available: true,
	purchaseMode: "internal", // internal | external
});

function CreateBook() {
	const navigate = useNavigate();
	const [coverPreview, setCoverPreview] = useState(null);
	const [coverFile, setCoverFile] = useState(null);

	const createBookMutation = useCreateBookMutation({
		onSuccess: () => {
			setCoverPreview(null);
			setCoverFile(null);
			formik.resetForm();
			navigate("/admin/books");
		},
	});

	const formik = useFormik({
		initialValues: {
			title: "",
			description: "",
			price: "",
			pages: "",
			highlights: { whyThisBook: "", difference: "", whoCanBuy: "" },
			keyFeatures: [""],
			targetAudience: "",
			languageOptions: [createLanguageOption()],
		},
		validationSchema,
		onSubmit: (values) => {
			const payload = {
				title: values.title.trim(),
				description: values.description.trim(),
				price:
					values.price === "" || values.price === null
						? 0
						: Number(values.price) || 0,
				pages:
					values.pages === "" || values.pages === null
						? undefined
						: Number(values.pages) || undefined,
				highlights: {
					whyThisBook: values.highlights.whyThisBook.trim(),
					difference: values.highlights.difference.trim(),
					whoCanBuy: values.highlights.whoCanBuy.trim(),
				},
				keyFeatures: values.keyFeatures
					.map((feature) => feature.trim())
					.filter(Boolean)
					.map((feature) => ({ feature })),
				targetAudience: sanitizeCommaSeparated(values.targetAudience),
				languageOptions: values.languageOptions.map((option) => ({
					language: option.language.trim(),
					stock:
						option.purchaseMode === "external" ? 0 : Number(option.stock) || 0,
					buyLink:
						option.purchaseMode === "external"
							? option.buyLink
								? option.buyLink.trim()
								: ""
							: "",
					available: Boolean(option.available),
				})),
			};

			const formData = new FormData();
			formData.append("payload", JSON.stringify(payload));
			if (coverFile) {
				formData.append("file", coverFile);
			}

			createBookMutation.mutate(formData);
		},
	});

	const handleCoverImageChange = (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		setCoverFile(file);
		setCoverPreview(URL.createObjectURL(file));
	};

	const handleAddKeyFeature = () => {
		formik.setFieldValue("keyFeatures", [...formik.values.keyFeatures, ""]);
	};

	const handleRemoveKeyFeature = (index) => {
		const updated = [...formik.values.keyFeatures];
		updated.splice(index, 1);
		formik.setFieldValue("keyFeatures", updated.length ? updated : [""]);
	};

	const handleAddLanguageOption = () => {
		formik.setFieldValue("languageOptions", [
			...formik.values.languageOptions,
			createLanguageOption(),
		]);
	};

	const handleRemoveLanguageOption = (index) => {
		const updated = [...formik.values.languageOptions];
		updated.splice(index, 1);
		formik.setFieldValue(
			"languageOptions",
			updated.length ? updated : [createLanguageOption()]
		);
	};

	return (
		<div className="w-full p-6 max-w-4xl mx-auto">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold text-gray-800">Add New Book</h1>
				<button
					type="button"
					onClick={() => navigate("/admin/books")}
					className="text-sm font-medium text-[#BB0E00] hover:underline"
				>
					Back to list
				</button>
			</div>

			<div className="bg-white rounded-xl shadow-lg p-6">
				<form
					onSubmit={formik.handleSubmit}
					className="flex flex-col gap-4"
					encType="multipart/form-data"
				>
					<div className="border-2 border-dashed border-[#BB0E00] flex justify-center py-6 rounded-lg">
						<div className="w-full max-w-[130px] flex flex-col items-center gap-3">
							<input
								id="coverInput"
								type="file"
								accept="image/*"
								name="file"
								onChange={handleCoverImageChange}
								className="hidden"
							/>
							{coverPreview ? (
								<img
									src={coverPreview}
									alt="Cover preview"
									className="w-16 h-16 rounded-lg object-cover"
								/>
							) : (
								<button
									type="button"
									onClick={() => document.getElementById("coverInput")?.click()}
									className="border border-[#BB0E00] w-16 h-16 rounded-lg text-[#BB0E00] font-bold hover:bg-[#FFF2F0]"
								>
									+
								</button>
							)}
							<p className="text-[#BB0E00] font-medium text-center text-sm">
								Add Cover
							</p>
						</div>
					</div>

					<input
						type="text"
						name="title"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.title}
						placeholder="Book Title"
						className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-[#BB0E00] outline-none"
					/>
					{formik.touched.title && formik.errors.title && (
						<p className="text-red-500 text-sm">{formik.errors.title}</p>
					)}

					<textarea
						name="description"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.description}
						placeholder="Book Description"
						className="border border-gray-300 rounded-md p-3 w-full resize-none focus:ring-2 focus:ring-[#BB0E00] outline-none"
						rows={3}
					/>

					<input
						type="number"
						name="price"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.price}
						placeholder="Price"
						className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-[#BB0E00] outline-none"
						min={0}
						step={0.01}
					/>
					{formik.touched.price && formik.errors.price && (
						<p className="text-red-500 text-sm">{formik.errors.price}</p>
					)}

					<input
						type="number"
						name="pages"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.pages}
						placeholder="Number of Pages"
						className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-[#BB0E00] outline-none"
						min={1}
						step={1}
					/>
					{formik.touched.pages && formik.errors.pages && (
						<p className="text-red-500 text-sm">{formik.errors.pages}</p>
					)}

					<h3 className="font-medium mt-4 text-[#BB0E00]">Highlights</h3>
					{["whyThisBook", "difference", "whoCanBuy"].map((field) => (
						<input
							key={field}
							type="text"
							name={`highlights.${field}`}
							value={formik.values.highlights[field]}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							placeholder={field}
							className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#BB0E00] outline-none"
						/>
					))}

					<div className="flex items-center justify-between mt-4">
						<h3 className="font-medium text-[#BB0E00]">Key Features</h3>
						<button
							type="button"
							onClick={handleAddKeyFeature}
							className="text-sm text-[#BB0E00] hover:underline"
						>
							+ Add Feature
						</button>
					</div>
					{formik.values.keyFeatures.map((feature, index) => (
						<div key={index} className="flex gap-2 items-center">
							<input
								type="text"
								value={feature}
								onChange={(event) =>
									formik.setFieldValue(
										`keyFeatures[${index}]`,
										event.target.value
									)
								}
								onBlur={formik.handleBlur}
								placeholder="Feature"
								className="border border-gray-300 rounded-md p-2 flex-1 focus:ring-2 focus:ring-[#BB0E00] outline-none"
							/>
							<button
								type="button"
								onClick={() => handleRemoveKeyFeature(index)}
								className="text-sm text-red-500 hover:underline"
							>
								Remove
							</button>
						</div>
					))}
					{formik.touched.keyFeatures &&
						typeof formik.errors.keyFeatures === "string" && (
							<p className="text-red-500 text-sm">
								{formik.errors.keyFeatures}
							</p>
						)}

					<h3 className="font-medium mt-4 text-[#BB0E00]">Target Audience</h3>
					<input
						type="text"
						name="targetAudience"
						value={formik.values.targetAudience}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						placeholder="Homeowners, Entrepreneurs, etc."
						className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#BB0E00] outline-none"
					/>

					<div className="flex items-center justify-between mt-4">
						<h3 className="font-medium text-[#BB0E00]">Language Options</h3>
						<button
							type="button"
							onClick={handleAddLanguageOption}
							className="text-sm text-[#BB0E00] hover:underline"
						>
							+ Add Language
						</button>
					</div>
					{formik.values.languageOptions.map((lang, index) => {
						const languageOptionError = Array.isArray(
							formik.errors.languageOptions
						)
							? formik.errors.languageOptions[index]
							: null;

						return (
							<div
								key={index}
								className="flex flex-col gap-2 p-3 border border-gray-200 rounded-md"
							>
								<div className="flex flex-col sm:flex-row gap-2">
									<input
										type="text"
										value={lang.language}
										onChange={(event) => {
											const updated = [...formik.values.languageOptions];
											updated[index] = {
												...updated[index],
												language: event.target.value,
											};
											formik.setFieldValue("languageOptions", updated);
										}}
										onBlur={formik.handleBlur}
										placeholder="Language"
										className="border border-gray-300 rounded-md p-2 flex-1 focus:ring-2 focus:ring-[#BB0E00] outline-none"
									/>
								</div>

								<div className="flex items-center gap-4 my-2">
									<label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
										<input
											type="radio"
											name={`purchaseMode-${index}`}
											checked={lang.purchaseMode === "internal"}
											onChange={() => {
												const updated = [...formik.values.languageOptions];
												updated[index] = {
													...updated[index],
													purchaseMode: "internal",
													buyLink: "", // Clear buy link when switching to internal
												};
												formik.setFieldValue("languageOptions", updated);
											}}
											className="text-[#BB0E00] focus:ring-[#BB0E00]"
										/>
										Sell on Website
									</label>
									<label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
										<input
											type="radio"
											name={`purchaseMode-${index}`}
											checked={lang.purchaseMode === "external"}
											onChange={() => {
												const updated = [...formik.values.languageOptions];
												updated[index] = {
													...updated[index],
													purchaseMode: "external",
													stock: 0, // Clear stock when switching to external
												};
												formik.setFieldValue("languageOptions", updated);
											}}
											className="text-[#BB0E00] focus:ring-[#BB0E00]"
										/>
										External Link
									</label>
								</div>

								<div className="flex flex-col sm:flex-row gap-2">
									{lang.purchaseMode === "internal" ? (
										<input
											type="number"
											value={lang.stock}
											min={0}
											onChange={(event) => {
												const updated = [...formik.values.languageOptions];
												updated[index] = {
													...updated[index],
													stock: Number(event.target.value),
												};
												formik.setFieldValue("languageOptions", updated);
											}}
											onBlur={formik.handleBlur}
											placeholder="Stock"
											className="border border-gray-300 rounded-md p-2 w-full sm:w-28 focus:ring-2 focus:ring-[#BB0E00] outline-none"
										/>
									) : (
										<input
											type="text"
											value={lang.buyLink}
											onChange={(event) => {
												const updated = [...formik.values.languageOptions];
												updated[index] = {
													...updated[index],
													buyLink: event.target.value,
												};
												formik.setFieldValue("languageOptions", updated);
											}}
											onBlur={formik.handleBlur}
											placeholder="Buy Link (e.g., Amazon URL)"
											className="border border-gray-300 rounded-md p-2 flex-1 focus:ring-2 focus:ring-[#BB0E00] outline-none"
										/>
									)}
								</div>

								<div className="flex items-center justify-between">
									<label className="flex items-center gap-2 text-sm text-gray-600">
										<input
											type="checkbox"
											checked={lang.available}
											onChange={(event) => {
												const updated = [...formik.values.languageOptions];
												updated[index] = {
													...updated[index],
													available: event.target.checked,
												};
												formik.setFieldValue("languageOptions", updated);
											}}
										/>
										Available for purchase
									</label>
									<button
										type="button"
										onClick={() => handleRemoveLanguageOption(index)}
										className="text-xs text-red-500 hover:underline"
									>
										Remove
									</button>
								</div>
								{languageOptionError &&
									typeof languageOptionError === "object" && (
										<p className="text-red-500 text-xs">
											{languageOptionError.language ||
												languageOptionError.stock ||
												languageOptionError.buyLink}
										</p>
									)}
							</div>
						);
					})}
					{typeof formik.errors.languageOptions === "string" && (
						<p className="text-red-500 text-sm">
							{formik.errors.languageOptions}
						</p>
					)}

					<div className="mt-6 flex justify-center">
						<button
							type="submit"
							disabled={createBookMutation.isPending}
							className="bg-[#BB0E00] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#B94400] transition disabled:opacity-60"
						>
							{createBookMutation.isPending ? "Adding..." : "Add Book"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CreateBook;
