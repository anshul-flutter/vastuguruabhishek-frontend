/**
 * Extract YouTube video ID from various URL formats
 * @param {string} url - YouTube URL (watch, embed, short, etc.)
 * @returns {string|null} - Video ID or null if not found
 */
export const getYouTubeId = (url) => {
	if (!url) return null;
	const regExp =
		/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	const match = url.match(regExp);
	return match && match[7].length === 11 ? match[7] : null;
};

/**
 * Convert YouTube URL to embed URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - Embed URL or original URL if not YouTube
 */
export const getYouTubeEmbedUrl = (url) => {
	if (!url) return null;
	const videoId = getYouTubeId(url);
	return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

/**
 * Get YouTube thumbnail URL
 * @param {string} url - YouTube URL
 * @param {string} quality - Thumbnail quality ('maxresdefault', 'hqdefault', 'mqdefault', 'sddefault')
 * @returns {string|null} - Thumbnail URL or null if no video ID
 */
export const getYouTubeThumbnail = (url, quality = "maxresdefault") => {
	if (!url) return null;
	const videoId = getYouTubeId(url);
	return videoId
		? `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
		: null;
};
