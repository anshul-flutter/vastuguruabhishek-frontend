// Agora diagnostic utility
import AgoraRTC from "agora-rtc-sdk-ng";

export const testAgoraConnection = async (
	appId,
	channelName = "test-channel"
) => {
	console.log("🔧 Testing Agora connection...");
	console.log("App ID:", appId);
	console.log("Channel:", channelName);

	try {
		// Create a test client
		const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

		console.log("✅ Client created successfully");

		// Try to join with different configurations
		console.log("🔄 Attempting to join channel...");

		// Test 1: Basic join without token
		try {
			await client.join(appId, channelName, null, null);
			console.log("✅ Successfully joined channel without token");
			await client.leave();
			console.log("✅ Successfully left channel");
			return { success: true, requiresToken: false };
		} catch (error) {
			console.log("❌ Failed to join without token:", error.message);
			console.log("❌ Error code:", error.code);

			// Test 2: Check if it's a token requirement
			if (error.code === "CAN_NOT_GET_GATEWAY_SERVER") {
				const errorMsg = error.message || error.toString();

				// Check if error message mentions "static use dynamic key"
				const requiresToken = errorMsg.includes("static use dynamic key");

				// Check if error message mentions "dynamic use static key"
				const rejectsToken = errorMsg.includes("dynamic use static key");

				if (requiresToken) {
					console.log(
						"🔒 TOKEN REQUIRED: Your Agora project requires token authentication"
					);
					console.log(
						"⚙️  Solutions: Enable Primary Certificate in Agora Console and add AGORA_APP_CERTIFICATE to server .env"
					);
					return {
						success: false,
						error: "Token authentication required",
						code: error.code,
						requiresToken: true,
					};
				}

				if (rejectsToken) {
					console.log(
						"🔓 TOKEN NOT ALLOWED: Your Agora project is in Testing Mode (no token required)"
					);
					console.log(
						"⚙️  Your backend is sending a token, but Agora expects no token"
					);
					console.log(
						"💡 Solutions: 1) Enable Primary Certificate in Agora Console OR 2) Remove AGORA_APP_CERTIFICATE from server .env"
					);
					return {
						success: false,
						error: "Project in testing mode - token not required",
						code: error.code,
						requiresToken: false,
					};
				}

				console.log("🔍 This might be an App ID issue");
				return {
					success: false,
					error: error.message,
					code: error.code,
					requiresToken: "unknown",
				};
			}

			if (error.code === "INVALID_VENDOR_KEY") {
				console.log("❌ Invalid App ID - check your VITE_AGORA_APP_ID");
				return {
					success: false,
					error: "Invalid App ID",
					code: error.code,
					requiresToken: false,
				};
			}

			return {
				success: false,
				error: error.message,
				code: error.code,
				requiresToken: "unknown",
			};
		}
	} catch (error) {
		console.log("❌ Failed to create client:", error.message);
		return { success: false, error: error.message, code: error.code };
	}
};

// Test different App ID formats
export const validateAppId = (appId) => {
	console.log("🔍 Validating App ID format...");

	if (!appId) {
		console.log("❌ App ID is empty");
		return false;
	}

	if (typeof appId !== "string") {
		console.log("❌ App ID is not a string");
		return false;
	}

	if (appId.length !== 32) {
		console.log("❌ App ID length is not 32 characters:", appId.length);
		return false;
	}

	const hexPattern = /^[a-f0-9]{32}$/i;
	if (!hexPattern.test(appId)) {
		console.log("❌ App ID is not valid hexadecimal");
		return false;
	}

	console.log("✅ App ID format is valid");
	return true;
};
