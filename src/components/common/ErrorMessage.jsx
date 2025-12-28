/**
 * Reusable Error Message Component
 */
function ErrorMessage({ message = "Something went wrong", onRetry }) {
	return (
		<div className="text-center py-12 space-y-4">
			<p className="text-red-600 mb-4">{message}</p>
			{onRetry && (
				<button
					onClick={onRetry}
					className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
				>
					Try Again
				</button>
			)}
		</div>
	);
}

export default ErrorMessage;
