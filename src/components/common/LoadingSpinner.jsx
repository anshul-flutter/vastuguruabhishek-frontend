/**
 * Reusable Loading Spinner Component
 */
function LoadingSpinner({ message = "Loading...", size = "md" }) {
	const sizeClasses = {
		sm: "h-8 w-8",
		md: "h-12 w-12",
		lg: "h-16 w-16",
	};

	return (
		<div className="text-center py-12">
			<div
				className={`animate-spin rounded-full border-b-2 border-red-600 mx-auto mb-4 ${sizeClasses[size]}`}
			></div>
			<p className="text-gray-600">{message}</p>
		</div>
	);
}

export default LoadingSpinner;
