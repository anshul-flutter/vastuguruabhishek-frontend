import { Link } from "react-router-dom";

const AdminNotFound = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-white rounded-xl shadow-sm border border-gray-100 p-10">
			<span className="text-6xl font-bold text-[#bb1201] mb-4">404</span>
			<p className="text-2xl font-semibold text-gray-800 mb-2">
				This admin page is missing
			</p>
			<p className="max-w-xl text-gray-600 mb-8">
				The resource you were trying to view doesn&apos;t exist or has been
				moved. Use the link below to return to your dashboard and continue
				managing the platform.
			</p>
			<Link
				to="/admin/dashboard"
				className="px-6 py-3 rounded-lg bg-[#bb1201] text-white font-medium shadow hover:opacity-90 transition"
			>
				Back to Admin Dashboard
			</Link>
		</div>
	);
};

export default AdminNotFound;
