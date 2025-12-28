import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AgoraRTC from "agora-rtc-sdk-ng";
import toast from "react-hot-toast";
import {
	FaMicrophone,
	FaMicrophoneSlash,
	FaVideo,
	FaVideoSlash,
	FaExpand,
	FaCompress,
	FaDesktop,
	FaUsers,
	FaComments,
	FaTimes,
	FaPhone,
} from "react-icons/fa";
import apiClient from "../utils/apiClient";

/**
 * Live Session Page with Agora WebRTC
 * Features: Video/Audio streaming, Screen sharing, Chat, Participant list
 */
const SessionPageEnhanced = () => {
	const { sessionId } = useParams();
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.auth);
	const isAdmin = user?.role === "admin" || user?.role === "astrologer";

	// Session state
	const [session, setSession] = useState(null);
	const [loading, setLoading] = useState(true);

	// Agora state
	const [isJoined, setIsJoined] = useState(false);
	const joiningRef = useRef(false);
	const hasLeftRef = useRef(false);
	const leavingRef = useRef(false);
	const joinTimeRef = useRef(null);
	const [hostUid, setHostUid] = useState(null);
	const [hostName, setHostName] = useState(null);
	const [isVideoOn, setIsVideoOn] = useState(true);
	const [isAudioOn, setIsAudioOn] = useState(true);
	const [isScreenSharing, setIsScreenSharing] = useState(false);
	const [remoteUsers, setRemoteUsers] = useState([]);

	// UI state
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showParticipants, setShowParticipants] = useState(false);
	const [showChat, setShowChat] = useState(false);
	const [chatMessages, setChatMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	// Only enable session chat when Agora RTM integration is available
	const isRtmEnabled = import.meta.env.VITE_AGORA_RTM_ENABLED === "true";

	// Refs
	const clientRef = useRef(null);
	const localVideoRef = useRef(null);
	const localAudioRef = useRef(null);
	const screenTrackRef = useRef(null);
	const dummyTrackRef = useRef(null); // Store dummy track for cleanup
	const videoContainerRef = useRef(null);
	const mainContainerRef = useRef(null);
	const chatEndRef = useRef(null);
	// Map remote video containers by uid via stable element ids

	// Helper to safely invoke cleanup functions without failing the UI
	const safe = (fn, label) => {
		try {
			if (typeof fn === "function") fn();
		} catch (e) {
			console.warn(label || "cleanup error", e);
		}
	};

	// Auto-scroll chat (only relevant if RTM is enabled)
	useEffect(() => {
		if (isRtmEnabled) {
			chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [chatMessages, isRtmEnabled]);

	// Fetch session
	useEffect(() => {
		const fetchSession = async () => {
			try {
				const response = await apiClient.get(`/sessions/${sessionId}`);
				const s = response.data?.data;

				// Check if session has ended or is not live
				const now = new Date();
				let isEnded = false;
				let endReason = "";

				// Check if session is completed
				if (s.status === "completed") {
					isEnded = true;
					endReason = "This session has already ended.";
				}
				// Check if session was cancelled
				else if (s.status === "cancelled") {
					isEnded = true;
					endReason = "This session has been cancelled.";
				}
				// Check if session ended time has passed
				else if (s.endedAt && new Date(s.endedAt) < now) {
					isEnded = true;
					endReason = "This session has already ended.";
				}
				// Check if session is not yet started and past scheduled time + duration
				else if (s.scheduledDate && s.duration) {
					const scheduledStart = new Date(s.scheduledDate);
					const sessionEndTime = new Date(
						scheduledStart.getTime() + s.duration * 60 * 1000
					);
					if (now > sessionEndTime && s.status !== "live") {
						isEnded = true;
						endReason = "This session has expired and is no longer available.";
					}
				}

				if (isEnded) {
					setSession({ ...s, isEnded: true, endReason });
					setLoading(false);
					return;
				}

				setSession(s);
				// Do not preload custom chat; will use RTM if enabled
				setLoading(false);
			} catch (err) {
				console.error("Error fetching session:", err);
				toast.error("Failed to load session");
				setLoading(false);
			}
		};
		fetchSession();
	}, [sessionId, user?._id, user?.name]);

	// Helper: Idempotent leave API before effects use it
	const leaveSessionApi = React.useCallback(
		async (reason = "button") => {
			if (hasLeftRef.current) return;
			hasLeftRef.current = true;
			try {
				if (!isAdmin) {
					const joinedAt = joinTimeRef.current || Date.now();
					const minutes = Math.max(
						0,
						Math.round((Date.now() - joinedAt) / 60000)
					);
					await apiClient.post(`/sessions/${sessionId}/leave`, {
						attendanceDuration: minutes,
						participationScore: 0,
						reason,
					});
				}
			} catch (e) {
				console.warn("Leave session API failed (", reason, "):", e?.message);
			}
		},
		[isAdmin, sessionId]
	);

	// Join Agora channel
	useEffect(() => {
		if (!session || session.isEnded || isJoined || joiningRef.current) return;

		const joinChannel = async () => {
			try {
				joiningRef.current = true;
				console.log("=== Joining Agora Channel ===");

				// Call join API to get credentials
				const joinResponse = await apiClient.post(
					`/sessions/${sessionId}/join`
				);
				const joinData = joinResponse.data?.data;

				const appId = joinData.appId || import.meta.env.VITE_AGORA_APP_ID;
				const channelName = joinData.channelName;
				const token = joinData.token;
				const serverUid = joinData.uid;
				if (joinData.hostUid) setHostUid(joinData.hostUid);
				if (joinData.hostName) setHostName(joinData.hostName);

				console.log("Join config:", { appId, channelName, hasToken: !!token });

				// Create client (only once)
				clientRef.current = AgoraRTC.createClient({
					mode: "rtc",
					codec: "vp8",
				});

				// Event handlers
				clientRef.current.on("user-published", async (agoraUser, mediaType) => {
					await clientRef.current.subscribe(agoraUser, mediaType);

					// Track user only if they have at least one media track
					const hasMedia =
						agoraUser.hasAudio ||
						agoraUser.hasVideo ||
						agoraUser.audioTrack ||
						agoraUser.videoTrack;
					if (hasMedia) {
						setRemoteUsers((prev) => {
							const filtered = prev.filter((u) => u.uid !== agoraUser.uid);
							return [...filtered, agoraUser];
						});
					}

					if (mediaType === "audio") {
						agoraUser.audioTrack?.play();
					}

					if (mediaType === "video" && agoraUser.videoTrack) {
						// Attempt to play into the container by id in case ref callback didn't re-run
						setTimeout(() => {
							const el = document.getElementById(
								`remote-video-${agoraUser.uid}`
							);
							if (el) {
								try {
									agoraUser.videoTrack.play(el);
								} catch (e) {
									console.warn("Play remote video failed:", e);
								}
							}
						}, 0);
					}
				});

				// Connection state monitoring
				clientRef.current.on(
					"connection-state-change",
					(curState, prevState) => {
						console.log(`🔗 Connection: ${prevState} → ${curState}`);

						const intentional = hasLeftRef.current || leavingRef.current;
						if (curState === "DISCONNECTED") {
							if (intentional) {
								console.log("ℹ️ Disconnected after intentional leave");
								return;
							}
							console.warn("⚠️ Disconnected from Agora");
							toast.error("Connection lost. Please rejoin the session.");
						} else if (curState === "RECONNECTING") {
							if (intentional) return;
							console.warn("⚠️ Reconnecting to Agora...");
							toast.info("Reconnecting...");
						} else if (
							curState === "CONNECTED" &&
							prevState === "RECONNECTING"
						) {
							if (intentional) return;
							console.log("✅ Reconnected to Agora");
							toast.success("Reconnected successfully!");
						}
					}
				);

				// Keep tiles when users turn off camera; show placeholder instead of removing
				clientRef.current.on("user-unpublished", (agoraUser) => {
					setRemoteUsers((prev) => {
						const others = prev.filter((u) => u.uid !== agoraUser.uid);
						return [...others, agoraUser];
					});
				});

				clientRef.current.on("user-left", (agoraUser) => {
					setRemoteUsers((prev) => prev.filter((u) => u.uid !== agoraUser.uid));
					addSystemMessage(`User ${agoraUser.uid} left the session`);
				});

				// Join channel using server-provided deterministic uid
				await clientRef.current.join(
					appId,
					channelName,
					token || null,
					serverUid || null
				);
				console.log("✅ Joined Agora channel successfully");

				setIsJoined(true);
				joinTimeRef.current = Date.now();
				toast.success("Joined session!");
				addSystemMessage(`${user?.name || "You"} joined the session`);

				// Session chat disabled (no custom Socket.IO). Integrate Agora RTM if needed.

				// Pre-populate existing remote users (e.g., host already in the room), force subscribe attempts
				try {
					const existing = clientRef.current.remoteUsers || [];
					if (existing.length) {
						const added = [];
						for (const u of existing) {
							try {
								// Try subscribe to both; ignore errors if not published
								await clientRef.current.subscribe(u, "audio").catch(() => {});
								await clientRef.current.subscribe(u, "video").catch(() => {});
								if (u.audioTrack) u.audioTrack.play();
								if (u.videoTrack) {
									added.push(u);
									setTimeout(() => {
										const el = document.getElementById(`remote-video-${u.uid}`);
										if (el)
											safe(
												() => u.videoTrack.play(el),
												"Play existing remote video"
											);
									}, 0);
								} else if (u.audioTrack) {
									added.push(u);
								}
							} catch (subErr) {
								console.warn("Subscribe existing user failed:", subErr);
							}
						}
						if (added.length) setRemoteUsers(added);
					}
				} catch (preErr) {
					console.warn("Pre-populate remote users failed", preErr);
				}

				// Create and publish local tracks
				try {
					localVideoRef.current = await AgoraRTC.createCameraVideoTrack();

					// Play local video
					if (videoContainerRef.current) {
						localVideoRef.current.play(videoContainerRef.current);
					}

					// Check client still exists before publishing
					if (
						clientRef.current &&
						clientRef.current.connectionState === "CONNECTED"
					) {
						await clientRef.current.publish(localVideoRef.current);
						console.log("✅ Video published");
					} else {
						console.warn("⚠️ Client not connected, skipping video publish");
						localVideoRef.current.close();
						localVideoRef.current = null;
						setIsVideoOn(false);
					}
				} catch (err) {
					console.error("❌ Video failed:", err.message);
					if (localVideoRef.current) {
						try {
							localVideoRef.current.close();
						} catch {
							// Ignore close errors
						}
						localVideoRef.current = null;
					}
					setIsVideoOn(false);
				}

				try {
					localAudioRef.current = await AgoraRTC.createMicrophoneAudioTrack();

					// Check client still exists before publishing
					if (
						clientRef.current &&
						clientRef.current.connectionState === "CONNECTED"
					) {
						await clientRef.current.publish(localAudioRef.current);
						console.log("✅ Audio published");
					} else {
						console.warn("⚠️ Client not connected, skipping audio publish");
						localAudioRef.current.close();
						localAudioRef.current = null;
						setIsAudioOn(false);
					}
				} catch (err) {
					console.error("❌ Audio failed:", err.message);
					if (localAudioRef.current) {
						try {
							localAudioRef.current.close();
						} catch {
							// Ignore close errors
						}
						localAudioRef.current = null;
					}
					setIsAudioOn(false);
				}

				// If both failed, publish dummy track for visibility
				if (!localVideoRef.current && !localAudioRef.current) {
					console.log("⚠️ Both tracks failed - publishing dummy track");

					try {
						// Check client still exists before creating dummy track
						if (
							!clientRef.current ||
							clientRef.current.connectionState !== "CONNECTED"
						) {
							console.warn("⚠️ Client not connected, skipping dummy track");
							toast.error("Could not join session - connection lost");
							return;
						}

						// Create 1x1 black canvas (minimal bandwidth)
						const canvas = document.createElement("canvas");
						canvas.width = 1;
						canvas.height = 1;
						const ctx = canvas.getContext("2d");
						ctx.fillStyle = "black";
						ctx.fillRect(0, 0, 1, 1);

						const canvasStream = canvas.captureStream(1);
						const videoTracks = canvasStream.getVideoTracks();

						if (videoTracks.length === 0) {
							throw new Error("No video tracks in canvas stream");
						}

						dummyTrackRef.current = AgoraRTC.createCustomVideoTrack({
							mediaStreamTrack: videoTracks[0],
						});

						await clientRef.current.publish(dummyTrackRef.current);
						console.log("✅ Dummy track published");

						toast.info(
							"Camera/mic unavailable - you are visible but without video/audio"
						);
					} catch (dummyErr) {
						console.error("❌ Dummy track failed:", dummyErr.message);
						toast.error("Could not join session - please check permissions");
					}
				} else {
					console.log("✅ Track(s) published successfully");
					toast.success("You are now live!");
				}
			} catch (err) {
				console.error("Error joining channel:", err);
				if (!isJoined) {
					toast.error(err.response?.data?.message || "Failed to join session");
				}
			} finally {
				joiningRef.current = false;
			}
		};

		joinChannel();

		// Cleanup on unmount: mirror leave flow to avoid dangling camera/mic
		const containerEl = videoContainerRef.current;
		return () => {
			// Skip cleanup if already left or joining was cancelled
			if (hasLeftRef.current || !clientRef.current) {
				console.log("⏭️ Cleanup skipped (already left or not joined)");
				return;
			}

			console.log("=== Cleanup: Leaving Agora ===");
			hasLeftRef.current = true;
			leavingRef.current = true;

			if (clientRef.current) {
				try {
					const toUnpublish = [];
					if (localVideoRef.current) toUnpublish.push(localVideoRef.current);
					if (localAudioRef.current) toUnpublish.push(localAudioRef.current);
					if (screenTrackRef.current) toUnpublish.push(screenTrackRef.current);
					if (dummyTrackRef.current) toUnpublish.push(dummyTrackRef.current);

					if (
						toUnpublish.length &&
						clientRef.current.connectionState === "CONNECTED"
					) {
						clientRef.current
							.unpublish(toUnpublish)
							.then(() => console.log("✅ Tracks unpublished"))
							.catch((e) => console.warn("⚠️ Unpublish on cleanup failed", e));
					}
				} catch (e) {
					console.warn("⚠️ Error during unpublish on cleanup", e);
				}

				// Close and stop all tracks
				safe(() => {
					if (localVideoRef.current) {
						localVideoRef.current.stop();
						localVideoRef.current.close();
						console.log("✅ Video track closed");
					}
				}, "Local video cleanup error");

				safe(() => {
					if (localAudioRef.current) {
						localAudioRef.current.stop();
						localAudioRef.current.close();
						console.log("✅ Audio track closed");
					}
				}, "Local audio cleanup error");

				safe(() => {
					if (screenTrackRef.current) {
						screenTrackRef.current.stop();
						screenTrackRef.current.close();
						console.log("✅ Screen track closed");
					}
				}, "Screen track cleanup error");

				safe(() => {
					if (dummyTrackRef.current) {
						dummyTrackRef.current.stop();
						dummyTrackRef.current.close();
						console.log("✅ Dummy track closed");
					}
				}, "Dummy track cleanup error");

				localVideoRef.current = null;
				localAudioRef.current = null;
				screenTrackRef.current = null;
				dummyTrackRef.current = null;

				if (containerEl) {
					containerEl.innerHTML = "";
				}

				// Leave the channel
				if (clientRef.current.connectionState !== "DISCONNECTED") {
					clientRef.current
						.leave()
						.then(() => console.log("✅ Left Agora channel"))
						.catch((e) => console.warn("⚠️ Leave on cleanup error", e));
				}

				clientRef.current.removeAllListeners();
				clientRef.current = null;
			}

			// Best-effort: auto-record leave on unmount/route change for students
			if (!isAdmin && !hasLeftRef.current) {
				void leaveSessionApi("unmount");
			}

			// No session chat listeners to cleanup
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [!!session, sessionId]);

	// Ensure remote video tracks are attached if available after state updates
	useEffect(() => {
		remoteUsers.forEach((u) => {
			if (u.videoTrack) {
				const el = document.getElementById(`remote-video-${u.uid}`);
				if (el) {
					try {
						u.videoTrack.play(el);
					} catch (e) {
						console.warn("Attach remote video in effect failed:", e);
					}
				}
			}
		});
	}, [remoteUsers]);

	// Add system message helper
	const addSystemMessage = (text) => {
		setChatMessages((prev) => [
			...prev,
			{
				id: Date.now(),
				type: "system",
				text,
				timestamp: new Date(),
			},
		]);
	};

	// Toggle video
	const toggleVideo = async () => {
		if (isVideoOn && localVideoRef.current) {
			// Turn OFF video
			try {
				await clientRef.current.unpublish(localVideoRef.current);
				localVideoRef.current.stop();
				localVideoRef.current.close();
				localVideoRef.current = null;
				setIsVideoOn(false);
			} catch (err) {
				console.error("❌ Video disable failed:", err);
			}
		} else {
			// Turn ON video
			try {
				localVideoRef.current = await AgoraRTC.createCameraVideoTrack();

				// Remove dummy track if it exists
				if (dummyTrackRef.current) {
					try {
						await clientRef.current.unpublish(dummyTrackRef.current);
						dummyTrackRef.current.stop();
						dummyTrackRef.current.close();
						dummyTrackRef.current = null;
					} catch (e) {
						console.warn("Error removing dummy track:", e);
					}
				}

				if (videoContainerRef.current) {
					localVideoRef.current.play(videoContainerRef.current);
				}

				await clientRef.current.publish(localVideoRef.current);
				setIsVideoOn(true);
				toast.success("Camera turned on");
			} catch (err) {
				console.error("❌ Video enable failed:", err.message);
				toast.error("Camera permission denied");
				localVideoRef.current = null;
				setIsVideoOn(false);
			}
		}
	};

	// Toggle audio
	const toggleAudio = async () => {
		if (isAudioOn && localAudioRef.current) {
			// Turn OFF audio
			try {
				await clientRef.current.unpublish(localAudioRef.current);
				localAudioRef.current.stop();
				localAudioRef.current.close();
				localAudioRef.current = null;
				setIsAudioOn(false);
			} catch (err) {
				console.error("❌ Audio disable failed:", err);
			}
		} else {
			// Turn ON audio
			try {
				localAudioRef.current = await AgoraRTC.createMicrophoneAudioTrack();

				// Remove dummy track if it exists
				if (dummyTrackRef.current) {
					try {
						await clientRef.current.unpublish(dummyTrackRef.current);
						dummyTrackRef.current.stop();
						dummyTrackRef.current.close();
						dummyTrackRef.current = null;
					} catch (e) {
						console.warn("Error removing dummy track:", e);
					}
				}

				await clientRef.current.publish(localAudioRef.current);
				setIsAudioOn(true);
				toast.success("Microphone turned on");
			} catch (err) {
				console.error("❌ Audio enable failed:", err.message);
				toast.error("Microphone permission denied");
				localAudioRef.current = null;
				setIsAudioOn(false);
			}
		}
	};

	// Toggle screen sharing (Admin only)
	const toggleScreenShare = async () => {
		if (!isAdmin) return;

		try {
			if (!isScreenSharing) {
				// Start screen sharing
				screenTrackRef.current = await AgoraRTC.createScreenVideoTrack();

				// Unpublish camera
				if (localVideoRef.current) {
					await clientRef.current.unpublish(localVideoRef.current);
					localVideoRef.current.stop();
				}

				// Publish screen
				await clientRef.current.publish(screenTrackRef.current);

				// Play screen in container
				if (videoContainerRef.current) {
					screenTrackRef.current.play(videoContainerRef.current);
				}

				setIsScreenSharing(true);
				toast.success("Screen sharing started");
			} else {
				// Stop screen sharing
				if (screenTrackRef.current) {
					await clientRef.current.unpublish(screenTrackRef.current);
					screenTrackRef.current.stop();
					screenTrackRef.current.close();
					screenTrackRef.current = null;
				}

				// Resume camera
				if (localVideoRef.current) {
					await clientRef.current.publish(localVideoRef.current);
					localVideoRef.current.play(videoContainerRef.current);
				}

				setIsScreenSharing(false);
				toast.success("Screen sharing stopped");
			}
		} catch (err) {
			console.error("Screen share error:", err);
			toast.error("Failed to toggle screen sharing");
		}
	};

	// Toggle fullscreen
	const toggleFullscreen = () => {
		if (!document.fullscreenElement) {
			mainContainerRef.current?.requestFullscreen();
			setIsFullscreen(true);
		} else {
			document.exitFullscreen();
			setIsFullscreen(false);
		}
	};

	// leaveSessionApi defined above

	// Attempt to record leave on tab close/hard navigate
	useEffect(() => {
		if (!isJoined) return;

		const beforeUnloadHandler = () => {
			try {
				if (!isAdmin && !hasLeftRef.current && navigator.sendBeacon) {
					const joinedAt = joinTimeRef.current || Date.now();
					const minutes = Math.max(
						0,
						Math.round((Date.now() - joinedAt) / 60000)
					);
					const url = `${
						import.meta.env.VITE_BACKEND_URL
					}/sessions/${sessionId}/leave`;
					const data = JSON.stringify({
						attendanceDuration: minutes,
						participationScore: 0,
						reason: "beforeunload",
					});
					const blob = new Blob([data], { type: "application/json" });
					navigator.sendBeacon(url, blob);
					hasLeftRef.current = true;
				}
			} catch {
				// ignore
			}
		};

		window.addEventListener("beforeunload", beforeUnloadHandler);
		return () =>
			window.removeEventListener("beforeunload", beforeUnloadHandler);
	}, [isJoined, isAdmin, sessionId]);

	// Session chat handlers removed (no custom chat)

	// Send chat message (disabled without Agora RTM)
	const sendMessage = (e) => {
		e.preventDefault();
		if (!newMessage.trim()) return;
		toast.error("Chat is unavailable in this session.");
	};

	// Leave session
	const leaveSession = async () => {
		try {
			leavingRef.current = true;
			hasLeftRef.current = true;
			if (clientRef.current) {
				// Unpublish local tracks first
				try {
					const toUnpublish = [];
					if (localVideoRef.current) toUnpublish.push(localVideoRef.current);
					if (localAudioRef.current) toUnpublish.push(localAudioRef.current);
					if (screenTrackRef.current) toUnpublish.push(screenTrackRef.current);
					if (toUnpublish.length) {
						await clientRef.current.unpublish(toUnpublish);
					}
				} catch (e) {
					console.warn("Unpublish on leave failed:", e);
				}

				// Stop and close tracks
				if (localVideoRef.current) {
					try {
						localVideoRef.current.stop();
					} catch (e) {
						console.warn("stop local video failed", e);
					}
					try {
						localVideoRef.current.close();
					} catch (e) {
						console.warn("close local video failed", e);
					}
					localVideoRef.current = null;
				}
				if (localAudioRef.current) {
					try {
						localAudioRef.current.stop();
					} catch (e) {
						console.warn("stop local audio failed", e);
					}
					try {
						localAudioRef.current.close();
					} catch (e) {
						console.warn("close local audio failed", e);
					}
					localAudioRef.current = null;
				}
				if (screenTrackRef.current) {
					try {
						screenTrackRef.current.stop();
					} catch (e) {
						console.warn("stop screen track failed", e);
					}
					try {
						screenTrackRef.current.close();
					} catch (e) {
						console.warn("close screen track failed", e);
					}
					screenTrackRef.current = null;
				}

				// Clear local video container
				if (videoContainerRef.current) {
					videoContainerRef.current.innerHTML = "";
				}

				// Leave channel and cleanup listeners
				try {
					await clientRef.current.leave();
				} catch (e) {
					console.warn("Leave error:", e);
				}
				clientRef.current.removeAllListeners();
				clientRef.current = null;
			}

			// Record attendance (idempotent)
			await leaveSessionApi("button");

			toast.success("Left session");
			navigate(-1);
		} catch (err) {
			console.error("Error leaving:", err);
			navigate(-1);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<p className="text-white">Loading session...</p>
				</div>
			</div>
		);
	}

	if (!session) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<div className="text-center">
					<h3 className="text-xl text-white mb-4">Session not found</h3>
					<button
						onClick={() => navigate(-1)}
						className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
					>
						Go Back
					</button>
				</div>
			</div>
		);
	}

	// Show ended session message
	if (session.isEnded) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
				<div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center border border-gray-700">
					<div className="mb-6">
						<div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
							<FaPhone className="text-white text-3xl rotate-135" />
						</div>
						<h3 className="text-2xl font-bold text-white mb-2">
							{session.status === "cancelled"
								? "Session Cancelled"
								: "Session Ended"}
						</h3>
						<p className="text-gray-400 mb-4">
							{session.endReason ||
								"This session has already ended and is no longer available."}
						</p>
					</div>

					<div className="bg-gray-700 rounded-lg p-4 mb-6 text-left">
						<h4 className="text-white font-semibold mb-2">{session.title}</h4>
						<p className="text-gray-400 text-sm mb-1">
							{session.course?.title}
						</p>
						{session.status === "completed" && (
							<p className="text-green-400 text-sm">Status: Completed</p>
						)}
						{session.endedAt && (
							<p className="text-gray-400 text-sm">
								Ended: {new Date(session.endedAt).toLocaleString()}
							</p>
						)}
					</div>

					<div className="flex flex-col gap-2">
						{session.recording?.isRecorded &&
							session.recording?.recordingUrl && (
								<a
									href={session.recording.recordingUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
								>
									Watch Recording
								</a>
							)}
						<button
							onClick={() => navigate("/my-sessions")}
							className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
						>
							View My Sessions
						</button>
						<button
							onClick={() => navigate(-1)}
							className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
						>
							Go Back
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			ref={mainContainerRef}
			className="min-h-screen bg-gray-900 flex flex-col"
		>
			{/* Header */}
			<div className="bg-gray-800 border-b border-gray-700 p-4">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div>
						<h1 className="text-xl font-semibold text-white">
							{session.title}
						</h1>
						<p className="text-gray-400 text-sm">
							{session.course?.title}
							{isAdmin && <span className="ml-2 text-red-400">(HOST)</span>}
						</p>
					</div>
					<div className="flex items-center gap-3">
						<button
							onClick={() => setShowParticipants(!showParticipants)}
							className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
						>
							<FaUsers />
							<span>{remoteUsers.length + (isAdmin ? 1 : 0)}</span>
						</button>
						{isRtmEnabled && (
							<button
								onClick={() => setShowChat(!showChat)}
								className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
							>
								<FaComments />
							</button>
						)}
						<button
							onClick={leaveSession}
							className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
						>
							<FaPhone className="rotate-135" />
							Leave
						</button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex">
				{/* Video Grid */}
				<div className="flex-1 p-4">
					{!isJoined ? (
						<div className="flex items-center justify-center h-full">
							<div className="text-center text-white">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
								<p>Connecting...</p>
							</div>
						</div>
					) : (
						<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{/* Local Video (Everyone) */}
							{
								<div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
									<div ref={videoContainerRef} className="w-full h-full" />
									<div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
										You {isAdmin && <span className="ml-1">(Host)</span>}
										{isScreenSharing && (
											<span className="ml-2 text-green-400">
												• Screen Sharing
											</span>
										)}
									</div>
									{!isVideoOn && !isScreenSharing && (
										<div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
											<FaVideoSlash className="text-white text-4xl" />
										</div>
									)}
									<button
										onClick={toggleFullscreen}
										className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-70"
									>
										{isFullscreen ? <FaCompress /> : <FaExpand />}
									</button>
								</div>
							}

							{/* Remote Videos */}
							{remoteUsers.map((agoraUser) => (
								<div
									key={agoraUser.uid}
									className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video"
								>
									<div
										id={`remote-video-${agoraUser.uid}`}
										className="w-full h-full"
									/>
									{!agoraUser.videoTrack && (
										<div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
											<FaVideoSlash className="text-white text-3xl" />
										</div>
									)}
									<div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
										{hostUid && agoraUser.uid === hostUid
											? hostName || "Host"
											: `User ${agoraUser.uid}`}
									</div>
								</div>
							))}

							{/* Waiting message */}
							{remoteUsers.length === 0 && !isAdmin && (
								<div className="col-span-full bg-gray-800 rounded-lg p-12 text-center">
									<p className="text-gray-400">Waiting for host...</p>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Participants Sidebar */}
				{showParticipants && (
					<div className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-white font-semibold">
								Participants ({remoteUsers.length + (isAdmin ? 1 : 0)})
							</h3>
							<button
								onClick={() => setShowParticipants(false)}
								className="text-gray-400 hover:text-white"
							>
								<FaTimes />
							</button>
						</div>
						<div className="space-y-2">
							{/* Host */}
							{isAdmin && (
								<div className="bg-gray-700 p-3 rounded-lg flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
											{user?.name?.charAt(0) || "H"}
										</div>
										<div>
											<p className="text-white text-sm font-medium">You</p>
											<p className="text-gray-400 text-xs">Host</p>
										</div>
									</div>
									<div className="flex gap-1">
										{!isAudioOn && (
											<FaMicrophoneSlash className="text-red-400" size={14} />
										)}
										{!isVideoOn && (
											<FaVideoSlash className="text-red-400" size={14} />
										)}
									</div>
								</div>
							)}
							{/* Remote users */}
							{remoteUsers.map((agoraUser) => (
								<div
									key={agoraUser.uid}
									className="bg-gray-700 p-3 rounded-lg flex items-center justify-between"
								>
									<div className="flex items-center gap-2">
										<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
											{agoraUser.uid.toString().charAt(0)}
										</div>
										<div>
											<p className="text-white text-sm">
												{hostUid && agoraUser.uid === hostUid
													? hostName || "Host"
													: `User ${agoraUser.uid}`}
											</p>
											<p className="text-gray-400 text-xs">
												{hostUid && agoraUser.uid === hostUid
													? "Host"
													: "Participant"}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Chat Sidebar */}
				{isRtmEnabled && showChat && (
					<div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
						<div className="p-4 border-b border-gray-700 flex items-center justify-between">
							<h3 className="text-white font-semibold">Chat</h3>
							<button
								onClick={() => setShowChat(false)}
								className="text-gray-400 hover:text-white"
							>
								<FaTimes />
							</button>
						</div>
						<div className="flex-1 overflow-y-auto p-4 space-y-3">
							{chatMessages.map((msg) => (
								<div key={msg.id}>
									{msg.type === "system" ? (
										<div className="text-center text-xs text-gray-400 italic">
											{msg.text}
										</div>
									) : (
										<div
											className={`${
												msg.sender === user?.name
													? "ml-auto bg-blue-600"
													: "bg-gray-700"
											} max-w-[80%] p-3 rounded-lg`}
										>
											<p className="text-xs text-gray-300 mb-1">
												{msg.sender}
												{msg.isAdmin && (
													<span className="ml-1 text-red-400">(Host)</span>
												)}
											</p>
											<p className="text-white text-sm">{msg.text}</p>
											<p className="text-xs text-gray-400 mt-1">
												{msg.timestamp.toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</p>
										</div>
									)}
								</div>
							))}
							<div ref={chatEndRef} />
						</div>
						<form
							onSubmit={sendMessage}
							className="p-4 border-t border-gray-700"
						>
							<div className="flex gap-2">
								<input
									type="text"
									value={newMessage}
									onChange={(e) => setNewMessage(e.target.value)}
									placeholder="Type a message..."
									className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<button
									type="submit"
									className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
								>
									Send
								</button>
							</div>
						</form>
					</div>
				)}
			</div>

			{/* Controls (mic/cam for all; screen share host-only) */}
			{isJoined && (
				<div className="bg-gray-800 border-t border-gray-700 p-4">
					<div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
						<button
							onClick={toggleVideo}
							className={`p-4 rounded-full ${
								isVideoOn ? "bg-blue-500" : "bg-red-500"
							} text-white hover:opacity-90 flex items-center gap-2`}
							title={isVideoOn ? "Turn off camera" : "Turn on camera"}
						>
							{isVideoOn ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
						</button>
						<button
							onClick={toggleAudio}
							className={`p-4 rounded-full ${
								isAudioOn ? "bg-blue-500" : "bg-red-500"
							} text-white hover:opacity-90`}
							title={isAudioOn ? "Mute microphone" : "Unmute microphone"}
						>
							{isAudioOn ? (
								<FaMicrophone size={20} />
							) : (
								<FaMicrophoneSlash size={20} />
							)}
						</button>
						{isAdmin && (
							<button
								onClick={toggleScreenShare}
								className={`p-4 rounded-full ${
									isScreenSharing ? "bg-green-500" : "bg-gray-600"
								} text-white hover:opacity-90`}
								title={isScreenSharing ? "Stop screen sharing" : "Share screen"}
							>
								<FaDesktop size={20} />
							</button>
						)}
						<button
							onClick={toggleFullscreen}
							className="p-4 rounded-full bg-gray-600 text-white hover:opacity-90"
							title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
						>
							{isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default SessionPageEnhanced;
