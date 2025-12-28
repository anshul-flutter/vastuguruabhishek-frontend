import React from "react";
import { useNavigate } from "react-router-dom";

const CreatePackage = () => {
	const navigate = useNavigate();

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">
				Create New Package/Consultation
			</h1>
			<p className="mb-4 text-gray-600">
				This page will use the existing Consultation model to create packages.
			</p>
			<p className="text-sm text-gray-500">
				Redirecting to consultation creation page or implement similar form
				here...
			</p>
			<button
				onClick={() => navigate("/admin/consultation-bookings")}
				className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
			>
				Go to Consultations
			</button>
		</div>
	);
};

export default CreatePackage;
