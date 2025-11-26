import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useCreateEventMutation } from "../../hooks/useEventsApi";

const sanitizeArray = (array) =>
	(array ?? [])
		.map((item) => (typeof item === "string" ? item.trim() : ""))
		.filter(Boolean);

const normalizeString = (value) =>
	typeof value === "string" ? value.trim() : "";

const normalizeOptionalString = (value) => {
	const normalized = normalizeString(value);
	return normalized.length ? normalized : "";
};

const optionalUrlSchema = Yup.string()
	.trim()
	.transform((value) => (value === "" ? null : value))
	.url("Enter a valid URL")
	.nullable()
	.notRequired();

const validationSchema = Yup.object({
	title: Yup.string().trim().required("Title is required"),
	description: Yup.string().trim(),
	link: optionalUrlSchema,
	startTime: Yup.date()
		.typeError("Start time is required")
		.required("Start time is required"),
	endTime: Yup.date()
		.typeError("End time is required")
		.required("End time is required")
		.min(Yup.ref("startTime"), "End time must be after the start time"),
	entryAmount: Yup.number()
		.typeError("Entry amount must be a number")
		.min(0, "Entry amount cannot be negative"),
	capacity: Yup.number()
		.nullable()
		.transform((value, originalValue) => (originalValue === "" ? null : value))
		.typeError("Capacity must be a number")
		.min(1, "Capacity must be at least 1"),
	registrationRequired: Yup.boolean(),
	organizer: Yup.object({
		name: Yup.string().trim().required("Organizer name is required"),
		email: Yup.string()
			.trim()
			.email("Enter a valid email")
			.required("Organizer email is required"),
		contact: Yup.string().trim(),
	}),
});

function CreateEvent() {
	const navigate = useNavigate();
	const [thumbnailPreview, setThumbnailPreview] = useState(null);
	const [thumbnailFile, setThumbnailFile] = useState(null);

	const createEventMutation = useCreateEventMutation({
		onSuccess: () => {
			formik.resetForm();
			setThumbnailPreview(null);
			setThumbnailFile(null);
			navigate("/admin/events");
		},
	});

	const formik = useFormik({
		initialValues: {
			title: "",
			description: "",
			link: "",
			startTime: "",
			endTime: "",
			entryAmount: "",
			capacity: "",
			registrationRequired: true,
			organizer: { name: "", email: "", contact: "" },
			topics: [""],
			resources: [""],
			requirements: [""],
		},
		validationSchema,
		validate: (values) => {
			const errors = {};
			return errors;
		},
		onSubmit: (values) => {
			const payload = {
				title: normalizeString(values.title),
				description: normalizeString(values.description),
				link: normalizeOptionalString(values.link),
				startTime: values.startTime,
				endTime: values.endTime,
				entryAmount: values.entryAmount ? Number(values.entryAmount) : 0,
				capacity: values.capacity ? Number(values.capacity) : null,
				registrationRequired: values.registrationRequired,
				organizer: {
					name: normalizeString(values.organizer.name),
					email: normalizeString(values.organizer.email),
					contact: normalizeOptionalString(values.organizer.contact),
				},
				topics: sanitizeArray(values.topics),
				resources: sanitizeArray(values.resources),
				requirements: sanitizeArray(values.requirements),
			};

			const formData = new FormData();
			formData.append("payload", JSON.stringify(payload));

			if (thumbnailFile) {
				formData.append("thumbnail", thumbnailFile);
			}

			createEventMutation.mutate(formData);
		},
	});

	const handleThumbnailChange = (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		setThumbnailPreview(URL.createObjectURL(file));
		setThumbnailFile(file);
	};

	const handleArrayChange = (field, index, value) => {
		const updated = [...formik.values[field]];
		updated[index] = value;
		formik.setFieldValue(field, updated);
	};

	const appendArrayItem = (field) => {
		formik.setFieldValue(field, [...formik.values[field], ""]);
	};

	const handleBooleanToggle = (field, value) => {
		formik.setFieldValue(field, value);
	};

	return (
		<div className="w-full p-6 max-w-4xl mx-auto">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold text-gray-800">Create Event</h1>
				<button
					type="button"
					onClick={() => navigate("/admin/events")}
					className="text-sm font-medium text-[#BB0E00] hover:underline"
				>
					Back to list
				</button>
			</div>

			<div className="bg-white rounded-xl shadow-lg p-6">
				<form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
					<div className="border-2 border-dashed border-[#BB0E00] flex justify-center py-6 rounded-lg">
						<div className="w-full max-w-[130px] flex flex-col items-center gap-3">
							<input
								id="thumbnailInput"
								type="file"
								accept="image/*"
								onChange={handleThumbnailChange}
								className="hidden"
							/>
							{thumbnailPreview ? (
								<img
									src={thumbnailPreview}
									alt="Event thumbnail"
									className="w-16 h-16 rounded-lg object-cover"
								/>
							) : (
								<button
									type="button"
									onClick={() =>
										document.getElementById("thumbnailInput")?.click()
									}
									className="border border-[#BB0E00] w-16 h-16 rounded-lg text-[#BB0E00] font-bold hover:bg-[#FFF2F0]"
								>
									+
								</button>
							)}
							<p className="text-[#BB0E00] font-medium text-center text-sm">
								Add Thumbnail
							</p>
						</div>
					</div>

					<input
						type="text"
						name="title"
						value={formik.values.title}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						placeholder="Event Title"
						className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-[#BB0E00] outline-none"
					/>
					{formik.touched.title && formik.errors.title && (
						<p className="text-red-500 text-sm">{formik.errors.title}</p>
					)}

					<textarea
						name="description"
						value={formik.values.description}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						placeholder="Event Description"
						className="border border-gray-300 rounded-md p-3 w-full resize-none focus:ring-2 focus:ring-[#BB0E00] outline-none"
						rows={3}
					/>

					<input
						type="url"
						name="link"
						value={formik.values.link}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						placeholder="Event Link (Optional)"
						className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-[#BB0E00] outline-none"
					/>
					{formik.touched.link && formik.errors.link && (
						<p className="text-red-500 text-sm">{formik.errors.link}</p>
					)}

					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<input
								type="datetime-local"
								name="startTime"
								value={formik.values.startTime}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#BB0E00] outline-none"
							/>
							{formik.touched.startTime && formik.errors.startTime && (
								<p className="text-red-500 text-sm">
									{formik.errors.startTime}
								</p>
							)}
						</div>
						<div className="flex-1">
							<input
								type="datetime-local"
								name="endTime"
								value={formik.values.endTime}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#BB0E00] outline-none"
							/>
							{formik.touched.endTime && formik.errors.endTime && (
								<p className="text-red-500 text-sm">{formik.errors.endTime}</p>
							)}
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<input
								type="number"
								name="entryAmount"
								value={formik.values.entryAmount}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								placeholder="Entry Amount"
								className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#BB0E00] outline-none"
							/>
							{formik.touched.entryAmount && formik.errors.entryAmount && (
								<p className="text-red-500 text-sm">
									{formik.errors.entryAmount}
								</p>
							)}
						</div>
						<div className="flex-1">
							<input
								type="number"
								name="capacity"
								value={formik.values.capacity}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								placeholder="Capacity"
								className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#BB0E00] outline-none"
							/>
							{formik.touched.capacity && formik.errors.capacity && (
								<p className="text-red-500 text-sm">{formik.errors.capacity}</p>
							)}
						</div>
					</div>

					<label className="flex items-center gap-2">
						<input
							type="checkbox"
							name="registrationRequired"
							checked={formik.values.registrationRequired}
							onChange={(event) =>
								handleBooleanToggle(
									"registrationRequired",
									event.target.checked
								)
							}
							className="accent-[#BB0E00]"
						/>
						Registration Required
					</label>

					{["topics", "resources", "requirements"].map((field) => (
						<div key={field} className="flex flex-col gap-2 mt-4">
							<div className="flex items-center justify-between">
								<p className="font-medium text-[#BB0E00]">
									{field.charAt(0).toUpperCase() + field.slice(1)}
								</p>
								<button
									type="button"
									onClick={() => appendArrayItem(field)}
									className="text-sm text-[#BB0E00] hover:underline"
								>
									+ Add {field.slice(0, -1)}
								</button>
							</div>
							{formik.values[field].map((item, index) => (
								<input
									key={index}
									type="text"
									value={item}
									onChange={(event) =>
										handleArrayChange(field, index, event.target.value)
									}
									onBlur={formik.handleBlur}
									placeholder={`Add ${field.slice(0, -1)}`}
									className="border border-gray-300 rounded-md p-2 flex-1 focus:ring-2 focus:ring-[#BB0E00] outline-none"
								/>
							))}
						</div>
					))}

					<div className="flex flex-col gap-2 mt-4">
						<p className="font-medium text-[#BB0E00]">Organizer Info</p>
						<input
							type="text"
							name="organizer.name"
							value={formik.values.organizer.name}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							placeholder="Organizer Name"
							className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#BB0E00] outline-none"
						/>
						{formik.touched.organizer?.name &&
							formik.errors.organizer?.name && (
								<p className="text-red-500 text-sm">
									{formik.errors.organizer.name}
								</p>
							)}
						<input
							type="email"
							name="organizer.email"
							value={formik.values.organizer.email}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							placeholder="Organizer Email"
							className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#BB0E00] outline-none"
						/>
						{formik.touched.organizer?.email &&
							formik.errors.organizer?.email && (
								<p className="text-red-500 text-sm">
									{formik.errors.organizer.email}
								</p>
							)}
						<input
							type="text"
							name="organizer.contact"
							value={formik.values.organizer.contact}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							placeholder="Organizer Contact"
							className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#BB0E00] outline-none"
						/>
					</div>

					<div className="mt-6 flex justify-center">
						<button
							type="submit"
							disabled={createEventMutation.isPending}
							className="bg-[#BB0E00] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#B94400] transition disabled:opacity-60"
						>
							{createEventMutation.isPending ? "Creating..." : "Create Event"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CreateEvent;
