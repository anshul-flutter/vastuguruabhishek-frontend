/**
 * Reusable Button Component with different variants
 */
function Button({
	children,
	variant = "primary",
	size = "md",
	onClick,
	disabled = false,
	type = "button",
	className = "",
	icon,
	...props
}) {
	const baseStyles =
		"font-semibold transition-all duration-300 rounded-lg inline-flex items-center justify-center gap-2";

	const variants = {
		primary: "bg-[#c02c07] text-white hover:bg-[#a02506] disabled:bg-gray-400",
		secondary:
			"bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100",
		outline:
			"border-2 border-[#c02c07] text-[#c02c07] hover:bg-[#c02c07] hover:text-white disabled:border-gray-400 disabled:text-gray-400",
		ghost: "text-[#c02c07] hover:bg-red-50 disabled:text-gray-400",
	};

	const sizes = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-4 py-2 text-base",
		lg: "px-6 py-3 text-lg",
	};

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
			{...props}
		>
			{icon && <span>{icon}</span>}
			{children}
		</button>
	);
}

export default Button;
