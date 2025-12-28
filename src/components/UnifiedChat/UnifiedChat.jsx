import React, { useState, useEffect, useRef, useMemo } from "react";
import { IoMdSend } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { MdChat } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";
import socket from "../../utils/socket.js";
import { useAdminUsersQuery } from "../../hooks/useAdminApi";
import { useChatMessagesQuery } from "../../hooks/useChatApi";
import { useEnrolledCoursesQuery } from "../../hooks/useEnrolledCoursesApi";
import { useCoursesQuery } from "../../hooks/useCoursesApi";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import toast from "react-hot-toast";

const UnifiedChat = ({
	currentUserId,
	currentUserName,
	currentUserRole,
	astrologers: propAstrologers = [],
}) => {
	// UI State
	const [activeSection, setActiveSection] = useState("chat"); // 'chat' or 'forum'
	const [showSidebar, setShowSidebar] = useState(false);
	const [newMessage, setNewMessage] = useState("");
	const messagesEndRef = useRef(null);

	// Chat State
	const [activeStudentId, setActiveStudentId] = useState(null);
	const [activeAstrologerId, setActiveAstrologerId] = useState(null);

	// Forum State
	const [activeCourseId, setActiveCourseId] = useState(null);
	const [forumMessages, setForumMessages] = useState([]);

	// Fetch students (for astrologer)
	const { data: studentsData, isLoading: isStudentsLoading } =
		useAdminUsersQuery({
			select: (data) => data.students ?? [],
			enabled: currentUserRole === "astrologer" || currentUserRole === "admin",
		});

	const students = useMemo(() => studentsData ?? [], [studentsData]);

	// Fetch courses based on role
	// Admin/Astrologer: All courses
	// Student: Only enrolled courses
	const { data: allCourses = [], isLoading: allCoursesLoading } =
		useCoursesQuery({
			enabled: currentUserRole === "astrologer" || currentUserRole === "admin",
		});

	const { data: enrolledCourses = [], isLoading: enrolledCoursesLoading } =
		useEnrolledCoursesQuery({
			enabled: currentUserRole === "student",
		});

	// Determine which courses to display
	const displayCourses =
		currentUserRole === "astrologer" || currentUserRole === "admin"
			? allCourses
			: enrolledCourses;

	const coursesLoading =
		currentUserRole === "astrologer" || currentUserRole === "admin"
			? allCoursesLoading
			: enrolledCoursesLoading;

	// Initialize active astrologer (for student)
	useEffect(() => {
		if (
			currentUserRole === "student" &&
			propAstrologers.length > 0 &&
			!activeAstrologerId
		) {
			setActiveAstrologerId(propAstrologers[0]?._id);
		}
	}, [propAstrologers, activeAstrologerId, currentUserRole]);

	// Initialize active student (for astrologer)
	useEffect(() => {
		console.log("🔍 Checking students for astrologer/admin:", {
			currentUserRole,
			studentsCount: students.length,
			activeStudentId,
			firstStudent: students[0]?._id ?? students[0]?.id,
		});

		if (
			(currentUserRole === "astrologer" || currentUserRole === "admin") &&
			students.length > 0 &&
			!activeStudentId
		) {
			const firstStudentId = students[0]?._id ?? students[0]?.id;
			console.log("✅ Setting active student:", firstStudentId);
			setActiveStudentId(firstStudentId);
		}
	}, [students, activeStudentId, currentUserRole]);

	// Initialize active course
	useEffect(() => {
		if (displayCourses.length > 0 && !activeCourseId) {
			setActiveCourseId(displayCourses[0]._id);
		}
	}, [displayCourses, activeCourseId]);

	// ==================== DIRECT CHAT ====================

	// Fetch direct chat messages
	const targetUserId =
		currentUserRole === "student"
			? activeAstrologerId // Student selects astrologer from sidebar
			: activeStudentId; // Astrologer selects from sidebar

	const { data: fetchedMessages = [] } = useChatMessagesQuery(
		{ userId: currentUserId, targetUserId },
		{ enabled: Boolean(currentUserId && targetUserId) }
	);

	const [chatMessages, setChatMessages] = useState([]);

	// Reset and update chat messages when fetched messages change (including when switching chats)
	useEffect(() => {
		console.log("💬 Updating chat messages:", {
			count: fetchedMessages.length,
			targetUserId,
		});
		// Only reset messages when switching to a different chat (targetUserId changes)
		// or when initial load happens
		setChatMessages(fetchedMessages);
	}, [fetchedMessages, targetUserId]);

	// Join chat room
	useEffect(() => {
		if (!currentUserId || !targetUserId) {
			console.log("⚠️ Cannot join chat: missing userId or targetUserId", {
				currentUserId,
				targetUserId,
				currentUserRole,
				hasActiveStudentId: !!activeStudentId,
				hasActiveAstrologerId: !!activeAstrologerId,
			});
			return;
		}
		console.log("🔵 Joining chat room:", {
			currentUserId,
			targetUserId,
			currentUserRole,
			roomWillBe: `room-${currentUserId}-${targetUserId}`,
		});
		socket.emit("joinChat", {
			userId: currentUserId,
			targetUserId: targetUserId,
		});

		// Clear any existing error listeners
		socket.off("messageError");
		socket.off("messageSaved");

		// Listen for message errors
		socket.on("messageError", (error) => {
			console.error("❌ Message error received:", error);
			toast.error(error.error || "Failed to send message");
		});

		// Listen for message save confirmations
		socket.on("messageSaved", ({ tempId, savedMessage }) => {
			console.log("✅ Message saved confirmation:", { tempId, savedMessage });
			// Update the pending message to mark it as saved
			setChatMessages((prev) =>
				prev.map((msg) =>
					msg.id === tempId ? { ...msg, isPending: false } : msg
				)
			);
		});
	}, [
		currentUserId,
		targetUserId,
		currentUserRole,
		activeStudentId,
		activeAstrologerId,
	]);

	// Listen for incoming direct messages
	useEffect(() => {
		// Don't set up listener if currentUserId is not available yet
		if (!currentUserId) return;

		const messageListener = (msg) => {
			console.log("📥 Received message:", msg);

			// Skip if this message is from the current user (avoid duplicate with optimistic update)
			if (msg.senderId === currentUserId) {
				console.log("⏭️ Skipping own message (already shown optimistically)");
				return;
			}

			// Only add message if it's for the currently active chat
			const isForCurrentChat =
				(currentUserRole === "student" &&
					msg.senderId === activeAstrologerId) ||
				((currentUserRole === "astrologer" || currentUserRole === "admin") &&
					msg.senderId === activeStudentId);

			if (!isForCurrentChat) {
				console.log("⏭️ Message not for current chat, skipping");
				return;
			}

			setChatMessages((prev) => [
				...prev,
				{
					id: Date.now(),
					sender: "them",
					text: msg.message,
					time: new Date(msg.timestamp).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					}),
				},
			]);
		};

		socket.on("receiveMessage", messageListener);
		return () => {
			socket.off("receiveMessage", messageListener);
		};
	}, [currentUserId, activeAstrologerId, activeStudentId, currentUserRole]);

	// Send direct message
	const handleSendChatMessage = () => {
		if (!newMessage.trim() || !currentUserId || !targetUserId) {
			console.log("⚠️ Cannot send message:", {
				hasMessage: !!newMessage.trim(),
				currentUserId,
				targetUserId,
			});
			return;
		}

		const messageToSend = newMessage.trim();
		const tempId = Date.now();

		console.log("📤 Sending message:", {
			name: currentUserName,
			userId: currentUserId,
			targetUserId: targetUserId,
			message: messageToSend,
			tempId,
		});

		// Optimistic update - show message immediately
		const optimisticMessage = {
			id: tempId,
			sender: "me",
			text: messageToSend,
			time: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			isPending: true, // Mark as pending until confirmed
		};

		setChatMessages((prev) => [...prev, optimisticMessage]);
		setNewMessage(""); // Clear input immediately

		// Send via socket with tempId for tracking
		socket.emit("sendMessage", {
			name: currentUserName,
			userId: currentUserId,
			targetUserId: targetUserId,
			message: messageToSend,
			tempId: tempId,
		});

		// DON'T refetch here - socket broadcast will handle it for other users
		// Current user already sees the message via optimistic update
	};

	// ==================== FORUM CHAT ====================

	// Fetch forum messages
	const { data: forumData, isLoading: forumMessagesLoading } = useQuery({
		queryKey: ["forum-messages", activeCourseId],
		queryFn: async () => {
			if (!activeCourseId) return { messages: [] };
			const response = await apiClient.get(
				`/forums/${activeCourseId}/messages`
			);
			return response.data;
		},
		enabled: !!activeCourseId && activeSection === "forum",
	});

	useEffect(() => {
		setForumMessages(forumData?.messages || []);
	}, [forumData]);

	// Join forum room
	useEffect(() => {
		if (!activeCourseId || activeSection !== "forum") {
			console.log("⚠️ Cannot join forum:", {
				activeCourseId,
				activeSection,
			});
			return;
		}
		console.log("🔵 Joining forum room:", {
			userId: currentUserId,
			courseId: activeCourseId,
		});
		socket.emit("joinForum", {
			userId: currentUserId,
			courseId: activeCourseId,
		});

		// Clear any existing error listeners and add new one
		socket.off("messageError");
		socket.off("forumMessageSaved");

		socket.on("messageError", (error) => {
			console.error("❌ Forum message error:", error);
			toast.error(error.error || "Failed to send forum message");
		});

		// Listen for forum message save confirmations
		socket.on("forumMessageSaved", ({ tempId, savedMessage }) => {
			console.log("✅ Forum message saved confirmation:", {
				tempId,
				savedMessage,
			});
			// Update the pending message to mark it as saved
			setForumMessages((prev) =>
				prev.map((msg) =>
					msg._id === tempId ? { ...msg, isPending: false } : msg
				)
			);
		});
	}, [activeCourseId, currentUserId, activeSection]);

	// Listen for incoming forum messages
	useEffect(() => {
		// Don't set up listener if currentUserId is not available yet
		if (!currentUserId) return;

		const forumMessageListener = (msg) => {
			console.log("📥 Received forum message:", msg);

			// Skip if this message is from the current user (avoid duplicate with optimistic update)
			if (msg.userId === currentUserId) {
				console.log(
					"⏭️ Skipping own forum message (already shown optimistically)"
				);
				return;
			}

			// Only add message if we're currently viewing the forum
			if (activeSection !== "forum") {
				console.log("⏭️ Not in forum section, skipping message");
				return;
			}

			setForumMessages((prev) => [
				...prev,
				{
					_id: Date.now(),
					sender: {
						_id: msg.userId,
						name: msg.name,
					},
					message: msg.message,
					createdAt: msg.timestamp,
				},
			]);
		};

		socket.on("receiveForumMessage", forumMessageListener);
		return () => {
			socket.off("receiveForumMessage", forumMessageListener);
		};
	}, [currentUserId, activeSection]);

	// Send forum message
	const handleSendForumMessage = () => {
		if (!newMessage.trim()) {
			console.log("⚠️ Cannot send forum message: empty message");
			return;
		}

		const messageToSend = newMessage.trim();
		const tempId = Date.now();

		console.log("📤 Sending forum message:", {
			name: currentUserName,
			userId: currentUserId,
			courseId: activeCourseId,
			message: messageToSend,
			tempId,
		});

		// Optimistic update - show message immediately
		const optimisticMessage = {
			_id: tempId,
			sender: {
				_id: currentUserId,
				name: currentUserName,
			},
			message: messageToSend,
			createdAt: new Date(),
			isPending: true, // Mark as pending until confirmed
		};

		setForumMessages((prev) => [...prev, optimisticMessage]);
		setNewMessage(""); // Clear input immediately

		// ONLY emit via socket - this will save to DB and broadcast to all users
		// Don't use API call to avoid duplicate messages
		socket.emit("sendForumMessage", {
			name: currentUserName,
			userId: currentUserId,
			courseId: activeCourseId,
			message: messageToSend,
			tempId: tempId,
		});

		// Removed API call to prevent duplicates:
		// sendForumMessageMutation.mutate({ message: messageToSend });
	};

	// ==================== AUTO SCROLL ====================
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [chatMessages, forumMessages]);

	// ==================== RENDER ====================

	const activeStudent = useMemo(
		() => students.find((s) => (s._id ?? s.id) === activeStudentId),
		[students, activeStudentId]
	);

	const activeAstrologer = useMemo(
		() => propAstrologers.find((a) => a._id === activeAstrologerId),
		[propAstrologers, activeAstrologerId]
	);

	const activeCourse = useMemo(
		() => displayCourses.find((c) => c._id === activeCourseId),
		[displayCourses, activeCourseId]
	);

	const currentMessages =
		activeSection === "chat" ? chatMessages : forumMessages;
	const isLoading =
		activeSection === "chat"
			? isStudentsLoading
			: coursesLoading || forumMessagesLoading;

	return (
		<div className="flex mx-[1.5rem] h-[calc(100vh-4rem)]">
			{/* ==================== SIDEBAR ==================== */}
			<div
				className={`fixed min-[600px]:static max-[600px]:h-screen top-[13%] left-0 bg-[#f4f4f4] border-r border-gray-300 transition-transform duration-300 z-50 ${
					showSidebar ? "translate-x-0" : "-translate-x-full"
				} min-[600px]:translate-x-0 w-[300px] overflow-y-auto`}
			>
				{/* Section Tabs */}
				<div className="flex border-b border-gray-300 bg-white sticky top-0 z-10">
					<button
						onClick={() => setActiveSection("chat")}
						className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-semibold transition-colors ${
							activeSection === "chat"
								? "bg-[#d20000] text-white"
								: "text-gray-600 hover:bg-gray-100"
						}`}
					>
						<MdChat size={20} />
						<span>Chat</span>
					</button>
					<button
						onClick={() => setActiveSection("forum")}
						className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-semibold transition-colors ${
							activeSection === "forum"
								? "bg-[#d20000] text-white"
								: "text-gray-600 hover:bg-gray-100"
						}`}
					>
						<HiUserGroup size={20} />
						<span>Forums</span>
					</button>
				</div>

				{/* Close button for mobile */}
				<div className="flex justify-between items-center p-3 min-[600px]:hidden">
					<h2 className="font-semibold text-[1.15rem] text-gray-800">
						{activeSection === "chat" ? "Direct Chat" : "Course Forums"}
					</h2>
					<RxCross2
						className="cursor-pointer"
						onClick={() => setShowSidebar(false)}
					/>
				</div>

				{/* ========== CHAT LIST (for astrologer) ========== */}
				{activeSection === "chat" &&
					(currentUserRole === "astrologer" || currentUserRole === "admin") && (
						<div>
							<h3 className="my-[1rem] px-3 font-semibold text-gray-700">
								Students
							</h3>
							{isStudentsLoading && (
								<p className="p-2 text-sm text-gray-500">Loading students…</p>
							)}
							{!isStudentsLoading && students.length === 0 && (
								<p className="p-2 text-sm text-gray-500">
									No students available.
								</p>
							)}
							{students.map((student) => {
								const studentKey = student._id ?? student.id;
								return (
									<div
										key={studentKey}
										onClick={() => {
											setActiveStudentId(studentKey);
											setShowSidebar(false);
										}}
										className={`flex flex-col border-b border-gray-300 p-3 cursor-pointer hover:bg-white transition-colors ${
											studentKey === activeStudentId ? "bg-white" : ""
										}`}
									>
										<div className="font-medium">{student.name}</div>
										<div className="text-xs text-gray-500">{student.email}</div>
									</div>
								);
							})}
						</div>
					)}

				{/* ========== CHAT LIST (for student) ========== */}
				{activeSection === "chat" && currentUserRole === "student" && (
					<div>
						<h3 className="my-[1rem] px-3 font-semibold text-gray-700">
							Astrologers
						</h3>
						{propAstrologers.length === 0 && (
							<p className="p-2 text-sm text-gray-500">
								No astrologers available.
							</p>
						)}
						{propAstrologers.map((astrologer) => (
							<div
								key={astrologer._id}
								onClick={() => {
									setActiveAstrologerId(astrologer._id);
									setShowSidebar(false);
								}}
								className={`flex flex-col border-b border-gray-300 p-3 cursor-pointer hover:bg-white transition-colors ${
									astrologer._id === activeAstrologerId ? "bg-white" : ""
								}`}
							>
								<div className="font-medium">{astrologer.name}</div>
								<div className="text-xs text-gray-500">{astrologer.email}</div>
								<div className="text-xs text-blue-600 capitalize mt-1">
									{astrologer.role}
								</div>
							</div>
						))}
					</div>
				)}

				{/* ========== FORUMS LIST ========== */}
				{activeSection === "forum" && (
					<div>
						<h3 className="my-[1rem] px-3 font-semibold text-gray-700">
							{currentUserRole === "astrologer" || currentUserRole === "admin"
								? "All Course Forums"
								: "Your Courses"}
						</h3>
						{coursesLoading && (
							<p className="p-2 text-sm text-gray-500">Loading courses…</p>
						)}
						{!coursesLoading && displayCourses.length === 0 && (
							<p className="p-2 text-sm text-gray-500">
								{currentUserRole === "astrologer" || currentUserRole === "admin"
									? "No courses available yet."
									: "You are not enrolled in any courses yet."}
							</p>
						)}
						{displayCourses.map((course) => (
							<div
								key={course._id}
								onClick={() => {
									setActiveCourseId(course._id);
									setShowSidebar(false);
								}}
								className={`flex items-start gap-3 border-b border-gray-300 p-3 cursor-pointer hover:bg-white transition-colors ${
									course._id === activeCourseId ? "bg-white" : ""
								}`}
							>
								<img
									src={course.image || "/images/course.png"}
									alt=""
									className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
								/>
								<div className="flex-1 min-w-0">
									<div className="font-medium truncate">{course.title}</div>
									<div className="text-xs text-gray-500 line-clamp-2">
										{course.description}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* ==================== CHAT WINDOW ==================== */}
			<div className="flex flex-col flex-1 h-full">
				{/* Mobile menu toggle */}
				<span className="w-fit my-[1rem] min-[600px]:hidden border text-gray-700 p-[8px] rounded-full shadow-lg cursor-pointer">
					<MdChat size={22} onClick={() => setShowSidebar(true)} />
				</span>

				{/* Chat header */}
				<div className="hidden min-[600px]:block px-4 py-3 border-b border-gray-300 bg-white flex-shrink-0">
					<h2 className="font-semibold text-lg">
						{activeSection === "chat"
							? currentUserRole === "student"
								? activeAstrologer?.name || "Select an astrologer"
								: activeStudent?.name || "Select a student"
							: activeCourse?.title || "Select a course"}
					</h2>
				</div>

				{isLoading ? (
					<div className="flex items-center justify-center flex-1">
						<p className="text-gray-500">Loading messages...</p>
					</div>
				) : (
					<>
						{/* Messages */}
						<div className="overflow-y-auto flex-1 p-[1rem] thin-scrollbar bg-gray-50">
							{currentMessages.length === 0 ? (
								<div className="flex items-center justify-center h-full text-gray-400">
									<p>No messages yet. Start the conversation!</p>
								</div>
							) : (
								currentMessages.map((msg) => {
									const isMyMessage =
										activeSection === "chat"
											? msg.sender === "me"
											: msg.sender._id === currentUserId;

									return (
										<div key={msg.id || msg._id}>
											<div
												className={`flex mb-1 ${
													isMyMessage ? "justify-end" : "justify-start"
												}`}
											>
												<div
													className={`max-w-[60%] px-4 py-2 rounded-2xl min-shadow ${
														isMyMessage
															? "bg-[#d20000] text-white"
															: "bg-white border border-gray-200 text-black"
													}`}
												>
													{!isMyMessage &&
														activeSection === "forum" &&
														msg.sender?.name && (
															<div className="text-[11px] font-semibold mb-[2px] opacity-80">
																{msg.sender.name}
															</div>
														)}
													{activeSection === "chat" ? msg.text : msg.message}
												</div>
											</div>
											<div
												className={`text-[10px] mx-[1rem] opacity-60 ${
													isMyMessage ? "text-right" : "text-left"
												}`}
											>
												{activeSection === "chat"
													? msg.time
													: new Date(msg.createdAt).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
													  })}
											</div>
										</div>
									);
								})
							)}
							<div ref={messagesEndRef} />
						</div>

						{/* Input Area */}
						<div className="flex gap-3 p-3 border-t border-gray-300 bg-white flex-shrink-0">
							<input
								type="text"
								placeholder={
									activeSection === "chat"
										? "Write your message..."
										: "Write to the group..."
								}
								value={newMessage}
								onChange={(e) => setNewMessage(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										activeSection === "chat"
											? handleSendChatMessage()
											: handleSendForumMessage();
									}
								}}
								className="flex-1 px-4 py-2 border border-gray-300 bg-[#f9f9f9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d20000]"
							/>
							<button
								onClick={
									activeSection === "chat"
										? handleSendChatMessage
										: handleSendForumMessage
								}
								className="bg-[#d20000] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#a00000] transition-colors"
							>
								<IoMdSend size={22} />
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default UnifiedChat;
