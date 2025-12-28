import React from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import EventsList from "./EventsList";

const EventManagement = () => {
	const navigate = useNavigate();
	return (
		<div className="max-w-6xl mx-auto p-4">
			<div className="flex justify-end items-center mb-6">
				<button
					onClick={() => navigate("/admin/create-event")}
					className="flex h-10 items-center gap-2 px-4 py-2 rounded-md cursor-pointer text-white bg-gradient-to-b from-[#bf1305] to-[#f64f42]"
				>
					<FiPlus size={23} />
					Create New Event
				</button>
			</div>
			<EventsList />
		</div>
	);
};

export default EventManagement;
