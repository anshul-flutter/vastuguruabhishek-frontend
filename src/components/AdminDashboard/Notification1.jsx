

import React from "react";

const notificationsToday = [
  { id: 1, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor", time: "3:15 PM", color: "bg-red-500" },
  { id: 2, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor", time: "3:15 PM", color: "bg-red-500" },
  { id: 3, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor", time: "3:15 PM", color: "bg-red-500" },
  { id: 4, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor", time: "3:15 PM", color: "bg-red-500" },
];

const notificationsYesterday = [
  { id: 5, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor", time: "3:15 PM", color: "bg-gray-400" },
  { id: 6, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor", time: "3:15 PM", color: "bg-gray-400" },
  { id: 7, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor", time: "3:15 PM", color: "bg-gray-400" },
];

const Notification1 = () => {
  return (
    <div className="p-5 bg-white min-h-screen flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-2 ">Today</h2>
      <ul className="space-y-4 mb-6 flex flex-col items-center">
        {notificationsToday.map((item) => (
          <li
            key={item.id}
            className="flex items-start space-x-3 max-w-lg text-left"
          >
            <span className={`w-3 h-3 mt-1 rounded-full ${item.color}`}></span>
            <div className="flex flex-col">
              <p className="text-sm text-gray-800 break-words">{item.text}</p>
              <p className="text-xs text-gray-500">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>
      <h2 className="text-lg font-semibold mb-2">Yesterday</h2>
      <ul className="space-y-4 flex flex-col items-center">
        {notificationsYesterday.map((item) => (
          <li
            key={item.id}
            className="flex items-start space-x-3 max-w-lg text-left"
          >
            <span className={`w-3 h-3 mt-1 rounded-full ${item.color}`}></span>
            <div className="flex flex-col">
              <p className="text-sm text-gray-800 break-words">{item.text}</p>
              <p className="text-xs text-gray-500">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notification1;
