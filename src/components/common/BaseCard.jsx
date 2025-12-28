import React from "react";
import PropTypes from "prop-types";

/**
 * BaseCard - A reusable container component for all card types
 * Provides consistent styling and structure across the application
 */
const BaseCard = ({
	children,
	onClick,
	className = "",
	hoverable = true,
	variant = "default",
}) => {
	const baseStyles =
		"bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300";

	const variantStyles = {
		default: "border border-gray-200",
		gradient: "border-0",
		elevated: "border-0 shadow-lg",
	};

	const hoverStyles = hoverable
		? "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
		: "";

	return (
		<div
			onClick={onClick}
			className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
		>
			{children}
		</div>
	);
};

BaseCard.propTypes = {
	children: PropTypes.node.isRequired,
	onClick: PropTypes.func,
	className: PropTypes.string,
	hoverable: PropTypes.bool,
	variant: PropTypes.oneOf(["default", "gradient", "elevated"]),
};

export default BaseCard;
