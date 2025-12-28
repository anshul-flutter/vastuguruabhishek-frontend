import React, { useState, useEffect } from "react";
import { HiX as X } from "react-icons/hi";
import {
	useCreateSessionMutation,
	useAdminCoursesQuery,
} from "../../../hooks/useSessionApi";

const CreateSessionModal = ({ isOpen, onClose }) => {
	const [formData, setFormData] = useState({
		courseId: "",
		title: "",
		description: "",
		sessionNumber: 1,
		scheduledDate: "",
		scheduledTime: "",
		duration: 60,
		chatEnabled: true,
	});

	const createSessionMutation = useCreateSessionMutation();
	const { data: courses } = useAdminCoursesQuery();

	// Debug logging
	console.log("Courses available:", courses);
	console.log("Create session mutation:", createSessionMutation);

	useEffect(() => {
		if (createSessionMutation.isSuccess) {
			onClose();
			setFormData({
				courseId: "",
				title: "",
				description: "",
				sessionNumber: 1,
				scheduledDate: "",
				scheduledTime: "",
				duration: 60,
				chatEnabled: true,
			});
		}
	}, [createSessionMutation.isSuccess, onClose]);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Form submitted with data:", formData);
		console.log("Validation check:", {
			courseId: !!formData.courseId,
			title: !!formData.title,
			scheduledDate: !!formData.scheduledDate,
			scheduledTime: !!formData.scheduledTime,
		});
		createSessionMutation.mutate(formData);
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center p-6 border-b border-gray-200">
					<h2 className="text-xl font-semibold text-gray-900">
						Create New Session
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{/* Debug Information */}
					<div className="bg-gray-100 p-3 rounded text-xs">
						<strong>Debug Info:</strong>
						<br />
						Courses available: {courses?.length || 0}
						<br />
						Loading: {createSessionMutation.isLoading ? "Yes" : "No"}
						<br />
						Success: {createSessionMutation.isSuccess ? "Yes" : "No"}
						<br />
						{createSessionMutation.error && (
							<span className="text-red-600">
								Error:{" "}
								{createSessionMutation.error?.response?.data?.message ||
									createSessionMutation.error?.message}
							</span>
						)}
						{createSessionMutation.isSuccess && (
							<span className="text-green-600">
								✅ Session created successfully!
							</span>
						)}
					</div>

					<div className="grid grid-cols-1 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Course *
							</label>
							<select
								name="courseId"
								value={formData.courseId}
								onChange={handleChange}
								required
								className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">Select a course</option>
								{courses?.map((course) => (
									<option key={course._id} value={course._id}>
										{course.title}
									</option>
								))}
							</select>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Session Title *
						</label>
						<input
							type="text"
							name="title"
							value={formData.title}
							onChange={handleChange}
							required
							placeholder="e.g., Introduction to Vedic Astrology"
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Description
						</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleChange}
							rows={3}
							placeholder="Brief description of what will be covered in this session"
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Session Number *
							</label>
							<input
								type="number"
								name="sessionNumber"
								value={formData.sessionNumber}
								onChange={handleChange}
								min="1"
								required
								className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Date *
							</label>
							<input
								type="date"
								name="scheduledDate"
								value={formData.scheduledDate}
								onChange={handleChange}
								required
								min={new Date().toISOString().split("T")[0]}
								className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Time *
							</label>
							<input
								type="time"
								name="scheduledTime"
								value={formData.scheduledTime}
								onChange={handleChange}
								required
								className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Duration (minutes) *
							</label>
							<input
								type="number"
								name="duration"
								value={formData.duration}
								onChange={handleChange}
								min="15"
								max="480"
								required
								className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>

					<div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={createSessionMutation.isLoading}
							className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors disabled:opacity-50"
						>
							{createSessionMutation.isLoading
								? "Creating..."
								: "Create Session"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateSessionModal;
