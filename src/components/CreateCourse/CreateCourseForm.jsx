import React, { useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import {
	useCourseQuery,
	useCreateCourseMutation,
	useUpdateCourseMutation,
} from "../../hooks/useCoursesApi";

const sanitizeStringArray = (array) =>
	(array ?? [])
		.map((item) => (typeof item === "string" ? item.trim() : ""))
		.filter(Boolean);

const toInputValue = (value) =>
	value === undefined || value === null ? "" : String(value);

const ensureStringArray = (value) => {
	if (!Array.isArray(value) || value.length === 0) {
		return [""];
	}
	return value.map((item) => (typeof item === "string" ? item : ""));
};

const buildInitialValues = (course) => {
	const safeCourse = course ?? {};
	return {
		// Basic info
		title: safeCourse.title ?? "",
		description: safeCourse.description ?? "",
		detailedDescription: ensureStringArray(
			safeCourse.detailedDescription ?? [""]
		),
		price: toInputValue(safeCourse.price),
		originalPrice: toInputValue(safeCourse.originalPrice),
		image: null,
		createdBy:
			(safeCourse.createdBy && typeof safeCourse.createdBy === "object"
				? safeCourse.createdBy.name
				: safeCourse.createdBy) ?? "",
		lastUpdated: safeCourse.lastUpdated ?? "",
		courseStart: safeCourse.courseStart
			? new Date(safeCourse.courseStart).toISOString().split("T")[0]
			: "",
		duration: toInputValue(safeCourse.duration),
		lessons: toInputValue(safeCourse.lessons),
		progress: toInputValue(safeCourse.progress),
		includedInPlans: Boolean(safeCourse.includedInPlans),
		premium: Boolean(safeCourse.premium),

		// Arrays
		languages: ensureStringArray(safeCourse.languages ?? [""]),
		subtitles: ensureStringArray(safeCourse.subtitles ?? [""]),
		whatYouWillLearn: ensureStringArray(safeCourse.whatYouWillLearn ?? [""]),
		relatedTopics: ensureStringArray(safeCourse.relatedTopics ?? [""]),
		courseIncludes: ensureStringArray(safeCourse.courseIncludes ?? [""]),
		requirements: ensureStringArray(safeCourse.requirements ?? [""]),

		// Course Content
		courseContent:
			Array.isArray(safeCourse.courseContent) && safeCourse.courseContent.length
				? safeCourse.courseContent.map((content) => ({
						title: content?.title ?? "",
						preview: Boolean(content?.preview),
						videoUrl: content?.videoUrl ?? content?.video ?? "",
				  }))
				: [createCourseContent()],

		// Preview for images
		imagePreview: safeCourse.image ?? null,
	};
};

const normalizeNumberInput = (value) =>
	value === "" || value === undefined || value === null ? null : Number(value);

const optionalNumberSchema = (label, { max } = {}) => {
	let schema = Yup.number()
		.transform((_value, originalValue) => normalizeNumberInput(originalValue))
		.typeError(`${label} must be a number`)
		.min(0, `${label} can't be negative`)
		.nullable();

	if (typeof max === "number") {
		// Validation Error for Course Content
		schema = schema.max(max, `${label} can't be greater than ${max}`);
	}

	return schema;
};

const courseContentTemplate = { title: "", preview: false, videoUrl: "" };
const createCourseContent = () => ({ ...courseContentTemplate });

const formatErrorMessage = (error) => {
	if (!error) return "";
	if (typeof error === "string") return error;
	if (Array.isArray(error)) {
		return formatErrorMessage(error.find(Boolean));
	}
	if (typeof error === "object") {
		return formatErrorMessage(Object.values(error).find(Boolean));
	}
	return String(error);
};

const validationSchema = Yup.object({
	title: Yup.string().trim().required("Course title is required"),
	description: Yup.string().trim().required("Description is required"),
	detailedDescription: Yup.array()
		.of(Yup.string().trim())
		.test(
			"has-detailed-description",
			"Detailed description is required",
			(value) => (value ?? []).some((item) => item && item.trim())
		),
	price: Yup.number()
		.transform((_value, originalValue) => normalizeNumberInput(originalValue))
		.typeError("Price must be a number")
		.min(0, "Price can't be negative")
		.required("Price is required"),
	originalPrice: optionalNumberSchema("Original price"),
	duration: optionalNumberSchema("Duration"),
	lessons: optionalNumberSchema("Lessons"),
	progress: optionalNumberSchema("Progress", { max: 100 }),
	languages: Yup.array().of(Yup.string().trim()),
	subtitles: Yup.array().of(Yup.string().trim()),
	whatYouWillLearn: Yup.array().of(Yup.string().trim()),
	relatedTopics: Yup.array().of(Yup.string().trim()),
	courseIncludes: Yup.array().of(Yup.string().trim()),
	requirements: Yup.array().of(Yup.string().trim()),
	courseContent: Yup.array()
		.of(
			Yup.object({
				title: Yup.string().trim().required("Content title is required"),
				preview: Yup.boolean(),
				videoUrl: Yup.string().url("Must be a valid URL").nullable(),
			})
		)
		.min(1, "Add at least one course content section"),
});

const toNumber = (value) => {
	if (value === undefined || value === null || value === "") return undefined;
	const parsed = Number(value);
	return Number.isNaN(parsed) ? undefined : parsed;
};

export default function CreateCourseForm() {
	const [formError, setFormError] = useState("");
	const navigate = useNavigate();
	const { courseId } = useParams();
	const isEditMode = Boolean(courseId);

	const {
		data: courseData,
		isLoading: isCourseLoading,
		isError: isCourseError,
		error: courseError,
	} = useCourseQuery(courseId, { enabled: isEditMode });

	const initialValues = useMemo(
		() => buildInitialValues(isEditMode ? courseData : undefined),
		[courseData, isEditMode]
	);

	const createCourseMutation = useCreateCourseMutation({
		onSuccess: () => {
			setFormError("");
			formik.resetForm();
			navigate("/admin/courses");
		},
		onError: (error, message) => {
			const detailedMessage =
				error?.response?.data?.error ||
				error?.response?.data?.message ||
				message;
			setFormError(formatErrorMessage(detailedMessage));
		},
	});

	const updateCourseMutation = useUpdateCourseMutation({
		onSuccess: () => {
			setFormError("");
			navigate("/admin/courses");
		},
		onError: (error, message) => {
			const detailedMessage =
				error?.response?.data?.error ||
				error?.response?.data?.message ||
				message;
			setFormError(formatErrorMessage(detailedMessage));
		},
	});

	const formik = useFormik({
		initialValues,
		enableReinitialize: true,
		validationSchema,
		onSubmit: async (values) => {
			setFormError("");
			const payload = {
				title: values.title.trim(),
				description: values.description.trim(),
				detailedDescription: sanitizeStringArray(values.detailedDescription),
				price: toNumber(values.price) ?? 0,
				originalPrice: toNumber(values.originalPrice),
				createdBy: values.createdBy.trim(),
				lastUpdated: values.lastUpdated.trim(),
				courseStart: values.courseStart,
				duration: toNumber(values.duration),
				lessons: toNumber(values.lessons),
				progress: toNumber(values.progress),
				includedInPlans: values.includedInPlans,
				premium: values.premium,
				languages: sanitizeStringArray(values.languages),
				subtitles: sanitizeStringArray(values.subtitles),
				whatYouWillLearn: sanitizeStringArray(values.whatYouWillLearn),
				relatedTopics: sanitizeStringArray(values.relatedTopics),
				courseIncludes: sanitizeStringArray(values.courseIncludes),
				requirements: sanitizeStringArray(values.requirements),
				courseContent: (values.courseContent ?? []).map((content) => ({
					title: content.title.trim(),
					preview: content.preview,
					video: content.videoUrl?.trim() || "", // Map videoUrl to 'video' for DB compatibility
				})),
			};

			const formData = new FormData();
			formData.append("payload", JSON.stringify(payload));

			if (values.image) {
				formData.append("image", values.image);
			}

			if (isEditMode) {
				updateCourseMutation.mutate({ courseId, payload: formData });
			} else {
				createCourseMutation.mutate(formData);
			}
		},
	});

	const isSubmitting = isEditMode
		? updateCourseMutation.isPending
		: createCourseMutation.isPending;
	const submitLabel = isEditMode ? "Save Changes" : "Create Course";
	const submitLoadingLabel = isEditMode ? "Saving..." : "Creating...";

	if (isEditMode && isCourseLoading) {
		return <p className="text-center mt-10">Loading course details...</p>;
	}

	if (isEditMode && isCourseError) {
		const message =
			courseError?.response?.data?.message ??
			courseError?.message ??
			"Failed to load course.";
		return <p className="text-center mt-10 text-red-600">{message}</p>;
	}

	const addField = (field) => {
		formik.setFieldValue(field, [...formik.values[field], ""]);
	};

	const removeField = (field, index) => {
		const newArr = [...formik.values[field]];
		newArr.splice(index, 1);
		formik.setFieldValue(field, newArr.length ? newArr : [""]);
	};

	const addCourseContent = () => {
		formik.setFieldValue("courseContent", [
			...formik.values.courseContent,
			createCourseContent(),
		]);
		formik.setFieldTouched("courseContent", true, true);
	};

	const removeCourseContent = (index) => {
		const arr = [...formik.values.courseContent];
		arr.splice(index, 1);
		formik.setFieldValue(
			"courseContent",
			arr.length ? arr : [createCourseContent()]
		);
		formik.setFieldTouched("courseContent", true, true);
	};

	const getFieldError = (field) => {
		const meta = formik.getFieldMeta(field);
		if (!meta.error) return null;
		if (!(meta.touched || formik.submitCount > 0)) return null;
		return formatErrorMessage(meta.error);
	};

	return (
		<form
			onSubmit={formik.handleSubmit}
			className="max-w-5xl mx-auto flex flex-col bg-white p-8 rounded-xl shadow-lg my-10 space-y-6"
			encType="multipart/form-data"
		>
			<h2 className="font-bold text-2xl text-[#BB0E00] mb-4 border-b-2 border-[#BB0E00] pb-2">
				{isEditMode ? "Edit Course" : "Course Details"}
			</h2>

			{/* Course Image */}
			<div className="mb-4">
				<h3 className="font-semibold text-[#BB0E00] mb-2">Course Image</h3>
				<label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#BB0E00] rounded-xl cursor-pointer hover:bg-[#ffe5e0] transition-colors">
					{formik.values.imagePreview ? (
						<img
							src={formik.values.imagePreview}
							alt="Preview"
							className="w-full h-full object-cover rounded-xl"
						/>
					) : (
						<span className="text-gray-500 text-center">
							Click to upload or drag & drop image here
						</span>
					)}
					<input
						type="file"
						accept="image/*"
						onChange={(e) => {
							if (e.target.files && e.target.files[0]) {
								const file = e.target.files[0];
								formik.setFieldValue("image", file);
								formik.setFieldValue("imagePreview", URL.createObjectURL(file));
							}
						}}
						className="hidden"
					/>
				</label>
			</div>

			{/* Basic Inputs */}
			<input
				type="text"
				name="title"
				placeholder="Course Title"
				value={formik.values.title}
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				className="border border-gray-300 rounded-md p-3 mb-3 focus:ring-2 focus:ring-[#BB0E00] outline-none"
			/>
			{getFieldError("title") && (
				<p className="text-red-500 text-sm -mt-2 mb-2">
					{getFieldError("title")}
				</p>
			)}
			<textarea
				name="description"
				placeholder="Short Description"
				value={formik.values.description}
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				className="resize-none border border-gray-300 rounded-md p-3 mb-3 focus:ring-2 focus:ring-[#BB0E00] outline-none"
			/>
			{getFieldError("description") && (
				<p className="text-red-500 text-sm -mt-2 mb-2">
					{getFieldError("description")}
				</p>
			)}
			<textarea
				name="detailedDescription[0]"
				placeholder="Detailed Description"
				value={formik.values.detailedDescription[0]}
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				className="resize-none border border-gray-300 rounded-md p-3 mb-3 focus:ring-2 focus:ring-[#BB0E00] outline-none"
			/>
			{getFieldError("detailedDescription[0]") && (
				<p className="text-red-500 text-sm -mt-2 mb-2">
					{getFieldError("detailedDescription[0]")}
				</p>
			)}
			<input
				type="text"
				name="createdBy"
				placeholder="Created By"
				value={formik.values.createdBy}
				onChange={formik.handleChange}
				className="border border-gray-300 rounded-md p-3 mb-3 focus:ring-2 focus:ring-[#BB0E00] outline-none"
			/>
			<input
				type="text"
				name="lastUpdated"
				placeholder="Last Updated"
				value={formik.values.lastUpdated}
				onChange={formik.handleChange}
				className="border border-gray-300 rounded-md p-3 mb-3 focus:ring-2 focus:ring-[#BB0E00] outline-none"
			/>

			<div className="mb-3">
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Course Start Date
				</label>
				<input
					type="date"
					name="courseStart"
					value={formik.values.courseStart}
					onChange={formik.handleChange}
					className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#BB0E00] outline-none"
				/>
			</div>

			{/* Numbers */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<input
					type="number"
					name="price"
					placeholder="Price"
					value={formik.values.price}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#BB0E00] outline-none"
				/>
				{getFieldError("price") && (
					<p className="text-red-500 text-sm -mt-2">{getFieldError("price")}</p>
				)}
				<input
					type="number"
					name="originalPrice"
					placeholder="Original Price"
					value={formik.values.originalPrice}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#BB0E00] outline-none"
				/>
				{getFieldError("originalPrice") && (
					<p className="text-red-500 text-sm -mt-2">
						{getFieldError("originalPrice")}
					</p>
				)}
				<input
					type="number"
					name="duration"
					placeholder="Duration (hrs)"
					value={formik.values.duration}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#BB0E00] outline-none"
				/>
				{getFieldError("duration") && (
					<p className="text-red-500 text-sm -mt-2">
						{getFieldError("duration")}
					</p>
				)}
				<input
					type="number"
					name="lessons"
					placeholder="No. of Lessons"
					value={formik.values.lessons}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#BB0E00] outline-none"
				/>
				{getFieldError("lessons") && (
					<p className="text-red-500 text-sm -mt-2">
						{getFieldError("lessons")}
					</p>
				)}
			</div>

			{/* Boolean Fields */}
			<div className="flex gap-6 items-center">
				<label className="flex items-center gap-2">
					<input
						type="checkbox"
						name="includedInPlans"
						checked={formik.values.includedInPlans}
						onChange={formik.handleChange}
						className="accent-[#BB0E00]"
					/>
					Included in Plans
				</label>
				<label className="flex items-center gap-2">
					<input
						type="checkbox"
						name="premium"
						checked={formik.values.premium}
						onChange={formik.handleChange}
						className="accent-[#BB0E00]"
					/>
					Premium
				</label>
			</div>

			{/* Arrays */}
			{[
				"languages",
				"subtitles",
				"whatYouWillLearn",
				"relatedTopics",
				"courseIncludes",
				"requirements",
			].map((field) => (
				<div key={field}>
					<h3 className="font-semibold text-[#BB0E00] mb-2">
						{field.charAt(0).toUpperCase() + field.slice(1)}
					</h3>
					{formik.values[field].map((item, i) => (
						<div key={i} className="flex gap-2 mb-2">
							<input
								type="text"
								name={`${field}[${i}]`}
								value={item}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								className="border border-gray-300 rounded-md p-2 flex-1 focus:ring-2 focus:ring-[#BB0E00] outline-none"
							/>
							<button
								type="button"
								onClick={() => removeField(field, i)}
								className="text-red-500 font-bold text-lg"
							>
								✕
							</button>
						</div>
					))}
					<button
						type="button"
						onClick={() => addField(field)}
						className="border border-[#BB0E00] text-[#BB0E00] px-3 py-1 rounded-md hover:bg-[#BB0E00] hover:text-white transition"
					>
						+ Add {field.charAt(0).toUpperCase() + field.slice(1)}
					</button>
				</div>
			))}

			{/* Course Content */}
			<h3 className="font-semibold text-[#BB0E00] mt-6 mb-2">Course Content</h3>
			{formik.values.courseContent.map((content, i) => (
				<div key={i} className="border border-gray-300 rounded-md p-4 mb-4">
					<input
						type="text"
						name={`courseContent[${i}].title`}
						placeholder="Content Title"
						value={content.title}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						className="border border-gray-300 rounded-md p-2 w-full mb-2 focus:ring-2 focus:ring-[#BB0E00] outline-none"
					/>
					{getFieldError(`courseContent[${i}].title`) && (
						<p className="text-red-500 text-sm -mt-1 mb-2">
							{getFieldError(`courseContent[${i}].title`)}
						</p>
					)}

					<label className="flex items-center gap-2 mb-2">
						<input
							type="checkbox"
							name={`courseContent[${i}].preview`}
							checked={content.preview}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							className="accent-[#BB0E00]"
						/>
						Preview Available
					</label>

					{/* Video URL Input */}
					<div className="mb-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Video URL (YouTube, Vimeo, or direct link)
						</label>
						<input
							type="text"
							name={`courseContent[${i}].videoUrl`}
							placeholder="https://www.youtube.com/watch?v=..."
							value={content.videoUrl || ""}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#BB0E00] outline-none"
						/>
						{getFieldError(`courseContent[${i}].videoUrl`) && (
							<p className="text-red-500 text-sm mt-1">
								{getFieldError(`courseContent[${i}].videoUrl`)}
							</p>
						)}
						{content.videoUrl && (
							<p className="text-xs text-gray-500 mt-1">✓ Video URL added</p>
						)}
					</div>

					<button
						type="button"
						onClick={() => removeCourseContent(i)}
						className="text-red-500 font-bold text-lg mt-2"
					>
						Remove
					</button>
				</div>
			))}
			{getFieldError("courseContent") && (
				<p className="text-red-500 text-sm -mt-2 mb-2">
					{getFieldError("courseContent")}
				</p>
			)}
			<button
				type="button"
				onClick={addCourseContent}
				className="border border-[#BB0E00] text-[#BB0E00] px-3 py-1 rounded-md hover:bg-[#BB0E00] hover:text-white transition mb-4"
			>
				+ Add Course Content
			</button>

			{/* Submit */}
			{formError && (
				<p className="text-red-600 text-center text-sm">{formError}</p>
			)}

			<button
				type="submit"
				disabled={isSubmitting}
				className="bg-[#BB0E00] text-white w-[220px] mx-auto px-4 py-3 rounded-md mt-6 font-semibold hover:bg-[#B94400] transition disabled:opacity-60"
			>
				{isSubmitting ? submitLoadingLabel : submitLabel}
			</button>
		</form>
	);
}
