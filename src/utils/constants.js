// ============================================
// CONFIGURATION CONSTANTS
// ============================================
// These constants are for configuration only.
// All dynamic data (notifications, blogs, courses, chats, etc.)
// should be fetched from the database via API calls.
// ============================================

// DEPRECATED STATIC DATA - Now fetched from DB:
// - ADMIN_NOTIFICATIONS -> use useNotificationsQuery hook
// - notifications -> use useNotificationsQuery hook
// - blogData -> use useBlogsQuery hook
// - courses -> use useCoursesQuery hook
// - courseVideo -> comes from course.courseContent via API
// - chatsData -> use useChatMessagesQuery hook
// - GroupChatsData -> use forum/group chat API (to be implemented)
// - videoData -> use podcast API

export const ADMIN_HIDE_GREETING_PATHS = ["/admin/student-management"];

export const ADMIN_TIMEZONE_OPTIONS = [
	"Asia/Kolkata",
	"Asia/Dubai",
	"Europe/London",
	"UTC",
	"America/New_York",
];

export const ADMIN_LANGUAGE_OPTIONS = [
	"English (India)",
	"English (US)",
	"Hindi",
	"Gujarati",
	"Marathi",
];

export const ADMIN_THEME_OPTIONS = [
	{ label: "System", value: "system" },
	{ label: "Light", value: "light" },
	{ label: "Dark", value: "dark" },
];

export const ADMIN_SETTINGS_DEFAULTS = Object.freeze({
	preferences: {
		timezone: "Asia/Kolkata",
		language: "English (India)",
		theme: "system",
	},
	notifications: {
		productUpdates: true,
		marketing: false,
		security: true,
		weeklySummary: true,
	},
	security: {
		twoFactor: false,
		loginAlerts: true,
		autoSignOutMinutes: 30,
	},
});

export const ADMIN_SECURITY_MIN_TIMEOUT = 5;

export const ROLES = Object.freeze({
	ADMIN: "admin",
	ASTROLOGER: "astrologer",
	STUDENT: "student",
});

export const menuOptions = [
	{ label: "Home", path: "/" },
	{
		label: "Consultation",
		path: "/consultation",
		links: [
			{ label: "Vastu For Office", path: "/vastu-office" },
			{ label: "Vastu For Home", path: "/vastu-home" },
			{ label: "Vastu For Factory/Commercial", path: "/vastu-industrial" },
			{ label: "Numero Consultation", path: "/numero-consultation" },
			{ label: "Astrology Consultation", path: "/astrology-consultation" },
		],
	},
	{
		label: "Courses",
		path: "/courses",
	},
	{ label: "Blogs", path: "/blogs" },
	{ label: "Podcast", path: "/podcast" },
	{
		label: "Books",
		path: "/books",
	},
	{ label: "Contact", path: "/contact" },
];
