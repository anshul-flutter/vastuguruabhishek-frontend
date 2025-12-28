import { useEffect } from "react";

const PerformanceMonitor = () => {
	useEffect(() => {
		// Only run in development
		if (import.meta.env.MODE !== "development") return;

		const observer = new PerformanceObserver((list) => {
			list.getEntries().forEach((entry) => {
				// Log Core Web Vitals and other performance metrics
				if (entry.entryType === "navigation") {
					console.log("Navigation timing:", {
						DNS: entry.domainLookupEnd - entry.domainLookupStart,
						TCP: entry.connectEnd - entry.connectStart,
						Request: entry.responseStart - entry.requestStart,
						Response: entry.responseEnd - entry.responseStart,
						DOM:
							entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
						Load: entry.loadEventEnd - entry.loadEventStart,
					});
				}

				if (entry.entryType === "paint") {
					console.log(`${entry.name}:`, entry.startTime);
				}

				if (entry.entryType === "largest-contentful-paint") {
					console.log("LCP:", entry.startTime);
				}

				if (entry.entryType === "first-input") {
					console.log("FID:", entry.processingStart - entry.startTime);
				}

				if (entry.entryType === "layout-shift") {
					console.log("CLS:", entry.value);
				}
			});
		});

		// Observe different performance entry types
		try {
			observer.observe({
				entryTypes: [
					"navigation",
					"paint",
					"largest-contentful-paint",
					"first-input",
					"layout-shift",
				],
			});
		} catch {
			// Fallback for browsers that don't support all entry types
			observer.observe({ entryTypes: ["navigation", "paint"] });
		}

		return () => observer.disconnect();
	}, []);

	return null; // This component doesn't render anything
};

export default PerformanceMonitor;
