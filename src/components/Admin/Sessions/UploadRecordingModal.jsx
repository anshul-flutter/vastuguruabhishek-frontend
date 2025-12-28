import React, { useState, useEffect } from "react";
import { HiX as X, HiUpload as Upload } from "react-icons/hi";
import { useUploadRecordingMutation } from "../../../hooks/useSessionApi";

const UploadRecordingModal = ({ session, isOpen, onClose }) => {
	const [formData, setFormData] = useState({
		recordingUrl: "",
		recordingDuration: "",
		thumbnailUrl: "",
		isPublic: false,
		downloadable: false,
	});

	const uploadRecordingMutation = useUploadRecordingMutation();

	useEffect(() => {
		if (uploadRecordingMutation.isSuccess) {
			onClose();
			setFormData({
				recordingUrl: "",
				recordingDuration: "",
				thumbnailUrl: "",
				isPublic: false,
				downloadable: false,
			});
		}
	}, [uploadRecordingMutation.isSuccess, onClose]);

	const handleSubmit = (e) => {
		e.preventDefault();
		uploadRecordingMutation.mutate({
			sessionId: session._id,
			recordingData: {
				...formData,
				recordingDuration: parseInt(formData.recordingDuration) || 0,
			},
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
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
				<div className="flex justify-between items-center p-6 border-b border-gray-200">
					<h2 className="text-xl font-semibold text-gray-900">
						Upload Recording
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					<div className="text-sm text-gray-600 mb-4">
						<p>
							<strong>Session:</strong> {session.title}
						</p>
						<p>
							<strong>Course:</strong> {session.course?.title}
						</p>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Recording URL *
						</label>
						<input
							type="url"
							name="recordingUrl"
							value={formData.recordingUrl}
							onChange={handleChange}
							required
							placeholder="https://example.com/recording.mp4"
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<p className="text-xs text-gray-500 mt-1">
							Provide the direct URL to the session recording
						</p>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Duration (minutes)
						</label>
						<input
							type="number"
							name="recordingDuration"
							value={formData.recordingDuration}
							onChange={handleChange}
							min="1"
							placeholder="e.g., 60"
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Thumbnail URL (optional)
						</label>
						<input
							type="url"
							name="thumbnailUrl"
							value={formData.thumbnailUrl}
							onChange={handleChange}
							placeholder="https://example.com/thumbnail.jpg"
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="space-y-2">
						<div className="flex items-center space-x-2">
							<input
								type="checkbox"
								name="isPublic"
								checked={formData.isPublic}
								onChange={handleChange}
								className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<label className="text-sm text-gray-700">
								Make recording public (non-enrolled users can view)
							</label>
						</div>

						<div className="flex items-center space-x-2">
							<input
								type="checkbox"
								name="downloadable"
								checked={formData.downloadable}
								onChange={handleChange}
								className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<label className="text-sm text-gray-700">
								Allow students to download recording
							</label>
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
							disabled={uploadRecordingMutation.isLoading}
							className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors disabled:opacity-50"
						>
							<Upload className="w-4 h-4" />
							{uploadRecordingMutation.isLoading
								? "Uploading..."
								: "Upload Recording"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default UploadRecordingModal;
