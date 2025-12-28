import React from "react";
import { createPortal } from "react-dom";

const LoadingOverlay = ({
	message = "Loading...",
	fullscreen = false,
	className = "",
}) => {
	const overlayClasses = fullscreen
		? "fixed inset-0 z-[1000]"
		: "absolute inset-0 z-[100]";

	const overlay = (
		<div
			className={`${overlayClasses} flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm ${className}`.trim()}
			role="status"
			aria-live="polite"
		>
			<span className="h-12 w-12 rounded-full border-[5px] border-white/80 border-t-[#bf1305] animate-spin" />
			{message && (
				<p className="mt-4 text-sm font-medium text-gray-700 text-center">
					{message}
				</p>
			)}
		</div>
	);

	if (fullscreen) {
		return createPortal(overlay, document.body);
	}

	return overlay;
};

export default LoadingOverlay;
