import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const BACKEND_URL =
	import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api";

// Helper function to make API calls to our backend
const makeKundliAPICall = async (endpoint, data) => {
	const url = `${BACKEND_URL}/kundli${endpoint}`;
	console.log("Making API call to backend:", url);
	console.log("Request body:", data);

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(data),
	});

	console.log("Response status:", response.status);

	if (!response.ok) {
		const errorData = await response.json();
		console.error("API Error:", errorData);

		// Handle specific error cases
		if (response.status === 429) {
			throw new Error(
				"Rate limit exceeded. Please wait a moment and try again. You have 50 free requests per day."
			);
		}

		throw new Error(errorData.message || `API Error: ${response.statusText}`);
	}

	const result = await response.json();
	console.log("API Response:", result);
	return result;
};

// Hook to generate Kundli with multiple API calls
export const useGenerateKundli = ({ onSuccess, onError } = {}) => {
	return useMutation({
		mutationFn: async (formData) => {
			const {
				name,
				day,
				month,
				year,
				hour,
				minute,
				latitude,
				longitude,
				timezone,
			} = formData;

			// Prepare the request body for the backend API
			const requestBody = {
				day: parseInt(day),
				month: parseInt(month),
				year: parseInt(year),
				hour: parseInt(hour),
				min: parseInt(minute),
				lat: parseFloat(latitude),
				lon: parseFloat(longitude),
				tzone: parseFloat(timezone),
			};

			// Make single API call to our backend which handles all the parallel calls
			const response = await makeKundliAPICall("/generate", requestBody);

			// Handle both old and new response formats
			const lagnaChart = response.data.lagnaChart || response.data.chart; // Backward compatibility
			const navamsaChart = response.data.navamsaChart || null;

			return {
				name,
				birthDetails: formData,
				planets: response.data.planets,
				lagnaChart: lagnaChart, // Lagna/Rasi chart (D1)
				navamsaChart: navamsaChart, // Navamsa chart (D9) - may be null in old responses
				nakshatra: response.data.nakshatra,
				dasha: response.data.dasha,
			};
		},
		onSuccess: (data) => {
			toast.success("Kundli generated successfully!");
			if (onSuccess) onSuccess(data);
		},
		onError: (error) => {
			const message =
				error?.message || "Failed to generate Kundli. Please try again.";
			toast.error(message);
			if (onError) onError(error, message);
		},
	});
};

// Hook to get location coordinates
export const useGetLocation = ({ onSuccess, onError } = {}) => {
	return useMutation({
		mutationFn: async (place) => {
			try {
				// Use nominatim (OpenStreetMap) with proper headers and timeout
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

				const response = await fetch(
					`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
						place
					)}&format=json&limit=1&addressdetails=1`,
					{
						method: "GET",
						headers: {
							"User-Agent": "Vastu-Abhishek-App",
							Accept: "application/json",
						},
						signal: controller.signal,
					}
				);

				clearTimeout(timeoutId);

				if (!response.ok) {
					throw new Error(`Failed to fetch location: ${response.statusText}`);
				}

				const data = await response.json();
				if (!data || data.length === 0) {
					throw new Error(
						"Location not found. Please try a different search term."
					);
				}

				return {
					latitude: data[0].lat,
					longitude: data[0].lon,
					displayName: data[0].display_name,
				};
			} catch (error) {
				if (error.name === "AbortError") {
					throw new Error(
						"Request timeout. Please check your internet connection and try again."
					);
				}
				if (
					error.message.includes("Failed to fetch") ||
					error.message.includes("NetworkError")
				) {
					throw new Error(
						"Network error. Please check your internet connection."
					);
				}
				throw error;
			}
		},
		onSuccess: (data) => {
			if (onSuccess) onSuccess(data);
		},
		onError: (error) => {
			const message = error?.message || "Failed to get location coordinates";
			toast.error(message);
			if (onError) onError(error, message);
		},
	});
};
