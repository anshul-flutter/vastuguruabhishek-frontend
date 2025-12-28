import React, { useState, useEffect } from "react";
import { HiX as X } from "react-icons/hi";
import { useUpdateSessionMutation } from "../../../hooks/useSessionApi";

const EditSessionModal = ({ session, isOpen, onClose }) => {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		scheduledDate: "",
		scheduledTime: "",
		duration: 60,
		chatEnabled: true,
	});

	const updateSessionMutation = useUpdateSessionMutation();

	useEffect(() => {
		if (session) {
			setFormData({
				title: session.title || "",
				description: session.description || "",
				scheduledDate: session.scheduledDate
					? new Date(session.scheduledDate).toISOString().split("T")[0]
					: "",
				scheduledTime: session.scheduledTime || "",
				duration: session.duration || 60,
				chatEnabled: session.chatEnabled !== false,
			});
		}
	}, [session]);

	useEffect(() => {
		if (updateSessionMutation.isSuccess) {
			onClose();
		}
	}, [updateSessionMutation.isSuccess, onClose]);

	const handleSubmit = (e) => {
		e.preventDefault();
		updateSessionMutation.mutate({
			sessionId: session._id,
			updates: formData,
		});
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	if (!isOpen || !session) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center p-6 border-b border-gray-200">
					<h2 className="text-xl font-semibold text-gray-900">Edit Session</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-4">
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
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

					<div className="flex items-center space-x-2">
						<input
							type="checkbox"
							name="chatEnabled"
							checked={formData.chatEnabled}
							onChange={handleChange}
							className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						/>
						<label className="text-sm font-medium text-gray-700">
							Enable Chat During Session
						</label>
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
							disabled={updateSessionMutation.isLoading}
							className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors disabled:opacity-50"
						>
							{updateSessionMutation.isLoading
								? "Updating..."
								: "Update Session"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditSessionModal;
