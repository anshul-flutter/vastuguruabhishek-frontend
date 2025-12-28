import { io } from "socket.io-client";

// Remove /api from the backend URL for socket connection
const getSocketUrl = () => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	// Remove /api suffix if it exists
	return backendUrl.replace(/\/api\/?$/, "");
};

const socket = io(getSocketUrl(), {
	withCredentials: true,
	transports: ["websocket", "polling"],
	reconnection: true,
	reconnectionDelay: 1000,
	reconnectionAttempts: 5,
});

// Add connection event listeners for debugging
socket.on("connect", () => {
	console.log("✅ Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
	console.error("❌ Socket connection error:", error.message);
});

socket.on("disconnect", (reason) => {
	console.log("🔌 Socket disconnected:", reason);
});

export default socket;
