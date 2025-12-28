import React, { useState, useMemo } from "react";

// Public fallback path so it can be cached/CDN'd and referenced consistently
const DEFAULT_FALLBACK = "/images/fallback.svg";

/**
 * ImageWithFallback
 * Props: { src, alt, fallback, className, style, ...imgProps }
 * - Renders an <img> that swaps to a fallback when the original fails to load.
 * - Accepts an optional fallback override; defaults to /images/fallback.png.
 */
export default function ImageWithFallback({
	src,
	alt = "",
	fallback = DEFAULT_FALLBACK,
	className,
	style,
	...imgProps
}) {
	const [error, setError] = useState(false);
	const resolvedSrc = useMemo(() => {
		if (!src || error) return fallback;
		return src;
	}, [src, error, fallback]);

	return (
		<img
			src={resolvedSrc}
			alt={alt}
			className={className}
			style={style}
			onError={() => setError(true)}
			{...imgProps}
		/>
	);
}
