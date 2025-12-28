// Date formatting utilities for the application

export const formatDate = (dateString) => {
	if (!dateString) return "";

	const date = new Date(dateString);
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(date);
};

export const formatTime = (timeString) => {
	if (!timeString) return "";

	// Handle both time strings like "14:30" and full datetime strings
	if (timeString.includes(":") && !timeString.includes("T")) {
		return timeString; // Already in HH:MM format
	}

	const date = new Date(timeString);
	return new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	}).format(date);
};

export const formatDateTime = (dateString) => {
	if (!dateString) return "";

	const date = new Date(dateString);
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	}).format(date);
};

export const formatDuration = (minutes) => {
	if (!minutes || minutes === 0) return "0 min";

	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	if (hours === 0) {
		return `${remainingMinutes} min`;
	}

	if (remainingMinutes === 0) {
		return `${hours}h`;
	}

	return `${hours}h ${remainingMinutes}m`;
};

export const getRelativeTime = (dateString) => {
	if (!dateString) return "";

	const date = new Date(dateString);
	const now = new Date();
	const diffInSeconds = Math.floor((date - now) / 1000);

	if (diffInSeconds < 0) {
		// Past date
		const absDiff = Math.abs(diffInSeconds);
		if (absDiff < 60) return "Just now";
		if (absDiff < 3600) return `${Math.floor(absDiff / 60)} minutes ago`;
		if (absDiff < 86400) return `${Math.floor(absDiff / 3600)} hours ago`;
		return `${Math.floor(absDiff / 86400)} days ago`;
	} else {
		// Future date
		if (diffInSeconds < 60) return "Starting soon";
		if (diffInSeconds < 3600)
			return `In ${Math.floor(diffInSeconds / 60)} minutes`;
		if (diffInSeconds < 86400)
			return `In ${Math.floor(diffInSeconds / 3600)} hours`;
		return `In ${Math.floor(diffInSeconds / 86400)} days`;
	}
};

export const isToday = (dateString) => {
	if (!dateString) return false;

	const date = new Date(dateString);
	const today = new Date();

	return (
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	);
};

export const isTomorrow = (dateString) => {
	if (!dateString) return false;

	const date = new Date(dateString);
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);

	return (
		date.getDate() === tomorrow.getDate() &&
		date.getMonth() === tomorrow.getMonth() &&
		date.getFullYear() === tomorrow.getFullYear()
	);
};
