import { useEffect, useMemo, useState } from "react";
import {
	useDeleteEventMutation,
	useEventsQuery,
	useUpdateEventMutation,
} from "../../hooks/useEventsApi";

const EventsList = () => {
	// Filters
	const [search, setSearch] = useState("");
	const [onlyUpcoming, setOnlyUpcoming] = useState(false);

	// Data
	const { data: events = [], isLoading } = useEventsQuery({
		params: {
			upcoming: onlyUpcoming ? "true" : undefined,
		},
	});

	// Mutations
	const updateEventMutation = useUpdateEventMutation({
		onSuccess: () => {
			setIsModalOpen(false);
			setSelectedEvent(null);
		},
	});
	const deleteEventMutation = useDeleteEventMutation();

	// Local edit state
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [thumbnailPreview, setThumbnailPreview] = useState(null);
	const [thumbnailFile, setThumbnailFile] = useState(null);

	const handleEditClick = (event) => {
		setSelectedEvent(JSON.parse(JSON.stringify(event)));
		setThumbnailPreview(event?.thumbnail || null);
		setThumbnailFile(null);
		setIsModalOpen(true);
	};

	const handleDelete = (id) => {
		if (!id) return;
		if (!confirm("Are you sure you want to delete this event?")) return;
		deleteEventMutation.mutate(id);
	};

	const handleInputChange = (e) => {
		const { name, value, type } = e.target;
		const parsedValue = type === "number" ? Number(value) : value;
		setSelectedEvent((prev) => ({
			...prev,
			[name]: parsedValue,
		}));
	};

	const handleNestedChange = (parent, key, value) => {
		setSelectedEvent((prev) => ({
			...prev,
			[parent]: { ...prev?.[parent], [key]: value },
		}));
	};

	const handleSave = () => {
		if (!selectedEvent?._id) return;

		const payload = {
			title: selectedEvent.title,
			description: selectedEvent.description,
			link: selectedEvent.link,
			startTime: selectedEvent.startTime,
			endTime: selectedEvent.endTime,
			entryAmount: Number(selectedEvent.entryAmount) || 0,
			capacity:
				selectedEvent.capacity === "" || selectedEvent.capacity === null
					? null
					: Number(selectedEvent.capacity),
			registrationRequired:
				typeof selectedEvent.registrationRequired === "boolean"
					? selectedEvent.registrationRequired
					: true,
			organizer: selectedEvent.organizer ?? {},
			topics: selectedEvent.topics ?? [],
			resources: selectedEvent.resources ?? [],
			requirements: selectedEvent.requirements ?? [],
		};

		const formData = new FormData();
		formData.append("payload", JSON.stringify(payload));
		if (thumbnailFile) {
			formData.append("thumbnail", thumbnailFile);
		}

		updateEventMutation.mutate({
			eventId: selectedEvent._id,
			payload: formData,
		});
	};

	const handleThumbnailChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setThumbnailFile(file);
		setThumbnailPreview(URL.createObjectURL(file));
	};

	useEffect(() => {
		if (!isModalOpen) {
			setThumbnailFile(null);
			setThumbnailPreview(null);
		}
	}, [isModalOpen]);

	// Client-side search filter
	const filtered = useMemo(() => {
		if (!search.trim()) return events;
		const q = search.trim().toLowerCase();
		return events.filter((e) => {
			const hay = [
				e.title,
				e.description,
				e.location,
				...(e.topics || []),
				e.organizer?.name,
			]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();
			return hay.includes(q);
		});
	}, [events, search]);

	return (
		<>
			{/* Filters */}
			<div className="bg-white border border-gray-200 rounded-lg p-3 mb-4 flex flex-wrap gap-3 items-center">
				<input
					type="text"
					placeholder="Search title, description, topic, organizer..."
					className="border rounded px-3 py-2 text-sm flex-1 min-w-[220px]"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<label className="text-sm flex items-center gap-2">
					<input
						type="checkbox"
						checked={onlyUpcoming}
						onChange={(e) => setOnlyUpcoming(e.target.checked)}
					/>
					Upcoming only
				</label>
			</div>

			{isLoading ? (
				<p className="text-gray-500">Loading events...</p>
			) : filtered.length === 0 ? (
				<p className="text-gray-500">No events found.</p>
			) : (
				<div className="space-y-4 max-h-[500px] overflow-y-auto hide-scrollbar">
					{filtered.map((event) => {
						const timeRange = `${new Date(
							event.startTime
						).toLocaleString()} - ${new Date(event.endTime).toLocaleString()}`;
						return (
							<div
								key={event._id}
								className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
							>
								<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
									<div className="flex items-start gap-3">
										{event.thumbnail ? (
											<img
												src={event.thumbnail}
												alt={event.title}
												className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
											/>
										) : null}
										<div>
											<h3 className="text-lg font-semibold text-gray-800">
												{event.title}
											</h3>
											<p className="text-sm text-gray-600 mt-1 line-clamp-2">
												{event.description}
											</p>
											<div className="text-xs text-gray-500 mt-2 flex flex-wrap gap-3">
												<span>📅 {timeRange}</span>
												{typeof event.entryAmount === "number" && (
													<span>🎟️ ₹{event.entryAmount}</span>
												)}
												{event.capacity && (
													<span>👥 Cap: {event.capacity}</span>
												)}
												{Array.isArray(event.topics) &&
													event.topics.length > 0 && (
														<span>🏷️ {event.topics.join(", ")}</span>
													)}
											</div>
										</div>
									</div>

									<div className="mt-2 sm:mt-0 flex items-center gap-2">
										<button
											onClick={() => handleEditClick(event)}
											className="px-3 py-1.5 text-white text-xs rounded-md font-medium bg-gradient-to-r from-red-700 to-red-500 cursor-pointer transition-all duration-200"
										>
											Edit
										</button>
										<button
											className="border px-3 py-1.5 rounded-md cursor-pointer border-red-700 text-red-700 text-xs"
											onClick={() => handleDelete(event._id)}
										>
											Delete
										</button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Modal */}
			{isModalOpen && selectedEvent && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-50">
					<div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
						<h2 className="text-lg font-semibold mb-4">Edit Event</h2>

						<div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
							{/* Thumbnail editor */}
							<div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center gap-4">
								<input
									id="editThumbnailInput"
									type="file"
									accept="image/*"
									onChange={handleThumbnailChange}
									className="hidden"
								/>
								{thumbnailPreview || selectedEvent.thumbnail ? (
									<img
										src={thumbnailPreview || selectedEvent.thumbnail}
										alt="Event thumbnail"
										className="w-20 h-20 rounded-lg object-cover"
									/>
								) : (
									<div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-2xl">
										+
									</div>
								)}
								<button
									type="button"
									onClick={() =>
										document.getElementById("editThumbnailInput")?.click()
									}
									className="px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
								>
									{thumbnailPreview ? "Change Thumbnail" : "Add Thumbnail"}
								</button>
							</div>
							<input
								type="text"
								name="title"
								value={selectedEvent.title}
								onChange={handleInputChange}
								className="w-full border rounded p-2 text-sm"
								placeholder="Event Title"
							/>
							<textarea
								name="description"
								value={selectedEvent.description}
								onChange={handleInputChange}
								className="w-full border rounded p-2 text-sm"
								placeholder="Event Description"
							/>
							<input
								type="url"
								name="link"
								value={selectedEvent.link || ""}
								onChange={handleInputChange}
								className="w-full border rounded p-2 text-sm"
								placeholder="Event Link (Optional)"
							/>
							<input
								type="datetime-local"
								name="startTime"
								value={selectedEvent.startTime?.slice(0, 16) || ""}
								onChange={handleInputChange}
								className="w-full border rounded p-2 text-sm"
							/>
							<input
								type="datetime-local"
								name="endTime"
								value={selectedEvent.endTime?.slice(0, 16) || ""}
								onChange={handleInputChange}
								className="w-full border rounded p-2 text-sm"
							/>
							<input
								type="number"
								name="entryAmount"
								value={selectedEvent.entryAmount ?? 0}
								onChange={handleInputChange}
								className="w-full border rounded p-2 text-sm"
								placeholder="Entry Amount"
							/>
							<input
								type="number"
								name="capacity"
								value={selectedEvent.capacity ?? ""}
								onChange={handleInputChange}
								className="w-full border rounded p-2 text-sm"
								placeholder="Capacity"
							/>

							{/* Organizer */}
							<h3 className="font-medium mt-4">Organizer</h3>
							<input
								type="text"
								value={selectedEvent.organizer?.name || ""}
								onChange={(e) =>
									handleNestedChange("organizer", "name", e.target.value)
								}
								className="w-full border rounded p-2 text-sm"
								placeholder="Organizer Name"
							/>
							<input
								type="email"
								value={selectedEvent.organizer?.email || ""}
								onChange={(e) =>
									handleNestedChange("organizer", "email", e.target.value)
								}
								className="w-full border rounded p-2 text-sm"
								placeholder="Organizer Email"
							/>
							<input
								type="text"
								value={selectedEvent.organizer?.contact || ""}
								onChange={(e) =>
									handleNestedChange("organizer", "contact", e.target.value)
								}
								className="w-full border rounded p-2 text-sm"
								placeholder="Organizer Contact"
							/>
						</div>

						<div className="flex justify-end gap-3 mt-4">
							<button
								onClick={() => setIsModalOpen(false)}
								className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
							>
								Cancel
							</button>
							<button
								onClick={handleSave}
								disabled={updateEventMutation.isPending}
								className="px-4 py-2 text-sm text-white rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
							>
								{updateEventMutation.isPending ? "Saving..." : "Save Changes"}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default EventsList;
