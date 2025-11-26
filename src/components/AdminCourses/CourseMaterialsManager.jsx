import React, { useState } from "react";
import {
	FaFilePdf,
	FaFileWord,
	FaVideo,
	FaTrash,
	FaPlus,
	FaExternalLinkAlt,
} from "react-icons/fa";
import {
	useAddCourseMaterialMutation,
	useRemoveCourseMaterialMutation,
} from "../../hooks/useCoursesApi";

const CourseMaterialsManager = ({ courseId, materials = [] }) => {
	const [isAdding, setIsAdding] = useState(false);
	const [inputType, setInputType] = useState("file"); // 'file' or 'url'
	const [formData, setFormData] = useState({
		title: "",
		type: "pdf", // pdf, doc, video
		file: null,
		url: "",
	});

	const addMutation = useAddCourseMaterialMutation();
	const removeMutation = useRemoveCourseMaterialMutation();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleFileChange = (e) => {
		setFormData((prev) => ({
			...prev,
			file: e.target.files[0],
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.title) return;
		if (inputType === "file" && !formData.file) return;
		if (inputType === "url" && !formData.url) return;

		const data = new FormData();
		data.append("title", formData.title);
		data.append("type", formData.type);
		data.append("isPublic", "false"); // Always private

		if (inputType === "file" && formData.file) {
			data.append("file", formData.file);
		} else if (inputType === "url" && formData.url) {
			data.append("url", formData.url);
		}

		try {
			await addMutation.mutateAsync({ courseId, formData: data });
			setIsAdding(false);
			setFormData({
				title: "",
				type: "pdf",
				file: null,
				url: "",
			});
			setInputType("file");
		} catch (error) {
			console.error("Failed to add material", error);
		}
	};

	const handleRemove = async (materialId) => {
		if (window.confirm("Are you sure you want to delete this material?")) {
			try {
				await removeMutation.mutateAsync({ courseId, materialId });
			} catch (error) {
				console.error("Failed to remove material", error);
			}
		}
	};

	const getIcon = (type) => {
		switch (type) {
			case "pdf":
				return <FaFilePdf className="text-red-500" />;
			case "doc":
				return <FaFileWord className="text-blue-500" />;
			case "video":
				return <FaVideo className="text-purple-500" />;
			default:
				return <FaFilePdf className="text-gray-500" />;
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md mt-6">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-xl font-semibold text-gray-800">
					Course Materials
				</h3>
				<button
					onClick={() => setIsAdding(!isAdding)}
					className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
				>
					<FaPlus /> {isAdding ? "Cancel" : "Add Material"}
				</button>
			</div>

			{isAdding && (
				<form
					onSubmit={handleSubmit}
					className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Title
							</label>
							<input
								type="text"
								name="title"
								value={formData.title}
								onChange={handleInputChange}
								required
								className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
								placeholder="e.g., Course Syllabus"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Type
							</label>
							<select
								name="type"
								value={formData.type}
								onChange={handleInputChange}
								className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
							>
								<option value="pdf">PDF Document</option>
								<option value="video">Video File</option>
							</select>
						</div>
						<div className="md:col-span-2">
							<div className="flex gap-4 mb-2">
								<label className="flex items-center gap-2 cursor-pointer">
									<input
										type="radio"
										name="inputType"
										checked={inputType === "file"}
										onChange={() => setInputType("file")}
										className="text-indigo-600 focus:ring-indigo-500"
									/>
									<span className="text-sm font-medium text-gray-700">
										Upload File
									</span>
								</label>
								<label className="flex items-center gap-2 cursor-pointer">
									<input
										type="radio"
										name="inputType"
										checked={inputType === "url"}
										onChange={() => setInputType("url")}
										className="text-indigo-600 focus:ring-indigo-500"
									/>
									<span className="text-sm font-medium text-gray-700">
										External URL
									</span>
								</label>
							</div>

							{inputType === "file" ? (
								<>
									<input
										type="file"
										onChange={handleFileChange}
										accept={
											formData.type === "video"
												? "video/*"
												: ".pdf,.doc,.docx,.txt"
										}
										required={inputType === "file"}
										className="w-full p-2 border border-gray-300 rounded-md bg-white"
									/>
									<p className="text-xs text-gray-500 mt-1">
										Supported formats:{" "}
										{formData.type === "video"
											? "MP4, WebM, etc."
											: "PDF, DOC, DOCX, TXT"}
										. Max size: 50MB.
									</p>
								</>
							) : (
								<input
									type="url"
									name="url"
									value={formData.url}
									onChange={handleInputChange}
									required={inputType === "url"}
									placeholder="https://example.com/resource"
									className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
								/>
							)}
						</div>
					</div>
					<div className="mt-4 flex justify-end">
						<button
							type="submit"
							disabled={addMutation.isPending}
							className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
						>
							{addMutation.isPending ? "Saving..." : "Add Material"}
						</button>
					</div>
				</form>
			)}

			<div className="space-y-3">
				{materials.length === 0 ? (
					<p className="text-gray-500 text-center py-4">
						No materials added yet.
					</p>
				) : (
					materials.map((material) => (
						<div
							key={material._id}
							className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
						>
							<div className="flex items-center gap-3 overflow-hidden">
								<div className="text-2xl flex-shrink-0">
									{getIcon(material.type)}
								</div>
								<div className="min-w-0">
									<h4 className="font-medium text-gray-900 truncate">
										{material.title}
									</h4>
									<div className="flex items-center gap-2 text-xs text-gray-500">
										<span className="uppercase">{material.type}</span>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2 flex-shrink-0">
								<a
									href={material.url}
									target="_blank"
									rel="noopener noreferrer"
									className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
									title="View Material"
								>
									<FaExternalLinkAlt />
								</a>
								<button
									onClick={() => handleRemove(material._id)}
									disabled={removeMutation.isPending}
									className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
									title="Delete Material"
								>
									<FaTrash />
								</button>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default CourseMaterialsManager;
