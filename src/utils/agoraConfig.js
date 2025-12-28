/**
 * Agora Configuration Utilities
 * Centralized configuration for Agora RTC integration
 */

/**
 * Get Agora App ID from environment variables
 * @returns {string} Agora App ID
 */
export const getAgoraAppId = () => {
	return import.meta.env.VITE_AGORA_APP_ID || "demo-app-id";
};

/**
 * Create Agora configuration object
 * @param {string} channelName - The channel name for the session
 * @param {string|null} token - The Agora token (optional)
 * @returns {Object} Agora configuration object
 */
export const createAgoraConfig = (channelName, token = null) => {
	return {
		appId: getAgoraAppId(),
		token,
		channelName,
	};
};

/**
 * Create admin Agora configuration for session hosting
 * @param {string} sessionId - The session ID to use as channel name
 * @returns {Object} Admin Agora configuration object
 */
export const createAdminAgoraConfig = (sessionId) => {
	return {
		appId: getAgoraAppId(),
		channelName: sessionId,
		token: null,
		uid: 1, // Admin gets UID 1
	};
};

/**
 * Create student Agora configuration for session joining
 * @param {string} sessionId - The session ID to use as channel name
 * @param {string|null} token - The student token (optional)
 * @returns {Object} Student Agora configuration object
 */
export const createStudentAgoraConfig = (sessionId, token = null) => {
	return {
		appId: getAgoraAppId(),
		channelName: sessionId,
		token,
		uid: 0, // Let Agora assign UID for students
	};
};

/**
 * Validate Agora configuration
 * @param {Object} config - Agora configuration object
 * @returns {boolean} True if configuration is valid
 */
export const validateAgoraConfig = (config) => {
	return !!(config?.appId && config?.channelName);
};

export default {
	getAgoraAppId,
	createAgoraConfig,
	createAdminAgoraConfig,
	createStudentAgoraConfig,
	validateAgoraConfig,
};
