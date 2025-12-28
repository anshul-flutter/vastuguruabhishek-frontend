/**
 * Reusable Icon Button Component
 */
function IconButton({
	icon,
	onClick,
	size = 44,
	iconSize = 20,
	className = "",
	ariaLabel,
	...props
}) {
	const IconComponent = icon;

	return (
		<button
			onClick={onClick}
			className={`flex justify-center items-center border border-[#E6E6E6] rounded-full shadow-[0_0_15.6px_0_rgba(0,0,0,0.08)] hover:bg-gray-50 transition-colors ${className}`}
			style={{ width: `${size}px`, height: `${size}px` }}
			aria-label={ariaLabel}
			{...props}
		>
			<IconComponent size={iconSize} />
		</button>
	);
}

export default IconButton;
