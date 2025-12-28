import React, { useState, useEffect, useRef } from "react";

const LazyLoadWrapper = ({
	children,
	threshold = 0.1,
	rootMargin = "50px",
	fallback = null,
	delay = 0,
}) => {
	const [shouldLoad, setShouldLoad] = useState(false);
	const elementRef = useRef();

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					// Add a small delay before loading to smooth out rapid scrolling
					setTimeout(() => {
						setShouldLoad(true);
					}, delay);
					observer.disconnect();
				}
			},
			{ threshold, rootMargin }
		);

		if (elementRef.current) {
			observer.observe(elementRef.current);
		}

		return () => observer.disconnect();
	}, [threshold, rootMargin, delay]);

	return (
		<div ref={elementRef}>
			{shouldLoad
				? children
				: fallback || <div style={{ minHeight: "200px" }} />}
		</div>
	);
};

export default LazyLoadWrapper;
