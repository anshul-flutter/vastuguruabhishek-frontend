/**
 * Reusable Card Component
 */
function Card({
	children,
	className = "",
	hover = false,
	padding = "md",
	...props
}) {
	const paddingSizes = {
		none: "p-0",
		sm: "p-3",
		md: "p-4 md:p-6",
		lg: "p-6 md:p-8",
	};

	const hoverClass = hover
		? "hover:shadow-lg transition-shadow duration-300 cursor-pointer"
		: "";

	return (
		<div
			className={`bg-white rounded-lg shadow-md ${paddingSizes[padding]} ${hoverClass} ${className}`}
			{...props}
		>
			{children}
		</div>
	);
}

export default Card;
