import React, { useState } from "react";
import {FiEdit2,FiTrash2,FiChevronDown,FiPlus,} from "react-icons/fi";
const DottedHandle = () => (
  <span className="flex flex-col justify-center items-center w-6 cursor-move text-gray-500 space-y-1">
    {[...Array(3)].map((_, row) => (
      <span key={row} className="flex space-x-1">
        {[...Array(3)].map((_, col) => (
          <span key={col} className="w-1 h-1 bg-current rounded-full"></span>
        ))}
      </span>
    ))}
  </span>
);
const InputRow = ({ placeholder, right = "edit-delete", type = "text" }) => {
  return (
    <div className="flex items-center gap-2">
      <DottedHandle />
      <div className="relative flex-1">
        {right === "select" ? (
          <>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm appearance-none pr-10 focus:outline-none focus:ring-1 focus:ring-red-400"
              defaultValue=""
            >
              <option value="" disabled>
                {placeholder}
              </option>
              <option>Today 5:00 PM</option>
              <option>Tomorrow 10:00 AM</option>
              <option>Custom…</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </>
        ) : (
          <>
            <input
              type={type}
              placeholder={placeholder}
              className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-400 ${
                right === "edit-delete" ? "pr-16" : "pr-3"
              }`}
            />
            {right === "edit-delete" ? (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                <button
                  className="text-gray-500 hover:text-blue-600"
                  type="button"
                  title="Edit"
                >
                  <FiEdit2 />
                </button>
                <button
                  className="text-gray-500 hover:text-red-600"
                  type="button"
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

const EventManagement = () => {
  const [conceptTracks, setConceptTracks] = useState(["", "", ""]);

  const handleAddTrack = () => setConceptTracks((s) => [...s, ""]);
  const handleRemoveTrack = (index) =>
    setConceptTracks((s) => s.filter((_, i) => i !== index));

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow-md space-y-6">
        {/* Title */}
        <h2 className="text-[15px] sm:text-base font-semibold">
          Enter The Details To Event Scheduling
        </h2>
        <div className="border-2 border-dashed border-red-400 rounded-md flex flex-col items-center justify-center h-40 cursor-pointe">
          <div className="flex flex-col items-center text-red-500">
            <span className="text-2xl font-bold border border-red-400 w-10 h-8 flex rounded items-center justify-center">+</span>
            <span className="text-xs sm:text-sm font-medium"> Add Thumbnail</span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-3">Add Event Details:</h3>
          <div className="space-y-3">
            <InputRow placeholder="Event Title" right="edit-delete" />
            <InputRow placeholder="Type Event Name" right="edit-delete" />
            <InputRow placeholder="Select Timing" right="select" />
            <InputRow placeholder="Add Entry Amount (INR)"right="none"type="number"/>
            <InputRow placeholder="Add Location" right="edit-delete" />
            <InputRow placeholder="Add Virtual Platform (if applicable)" right="edit-delete" />
       {conceptTracks.map((_, i) => ( <div key={i} className="flex items-center gap-2">
       <DottedHandle />
      <div className="relative flex-1">
       <input type="text"placeholder="Add Concept Topics"className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm pr-16 focus:outline-none focus:ring-1"/>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
        <button type="button"className="text-gray-500 hover:text-blue-600"title="Edit">
          <FiEdit2 />
        </button>
        <button
          type="button"
          onClick={() => handleRemoveTrack(i)}
          className="text-gray-500 hover:text-red-600"
          title="Delete"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  </div>
))}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleAddTrack}
                className="px-3 py-1.5 text-xs sm:text-sm border border-[#bb0e00] text-[#bb0e00] rounded-md hover:bg-red-50 transition flex items-center gap-2"
              >
                <FiPlus /> Add More
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[15px] font-semibold mb-3">
            Add Live Streaming Panel:
          </h3>
          <div className="space-y-2">
            <InputRow
              placeholder="Select a Lectures (e.g. Astrologer, API)"
              right="select"
            />
            <InputRow placeholder="Add Platform Link" right="edit-delete" />
          </div>
        </div>

        <div>
          <h3 className="text-[13px] font-semibold mb-3">
            Live Status & Replay Access
          </h3>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm">Live Status:</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <span className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#bb0e00] transition" />
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5" />
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-4 w-full max-w-md">
              <div className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-xs text-gray-500 text-center">Add +</div>
              <div className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-xs text-gray-500 text-center">Add +</div>
              <div className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-xs text-gray-500 text-center">Add +</div>
            </div>
            <button className="ml-4 px-9 py-2 text-xs sm:text-sm border border-red-500 text-red-600 rounded-md hover:bg-red-50 transition">
              Add More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManagement;
