import React from "react";

const notificationsToday = [
  { id: 1, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor", time: "3:15 PM", color: "bg-red-500" },
  { id: 2, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor", time: "3:15 PM", color: "bg-red-500" },
  { id: 3, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor", time: "3:15 PM", color: "bg-red-500" },
  { id: 4, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor", time: "3:15 PM", color: "bg-red-500" },
];

const Notification2 = () => {
  return (
    <div className="min-h-screen flex justify-center bg-white p-5">
      <div className="w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-4 ">Today</h2>
        <ul className="space-y-4">
          {notificationsToday.map((item) => (
            <li key={item.id} className="flex items-start space-x-2">
              <span className={`w-3 h-3 rounded-full mt-1 ${item.color}`}></span>
              <div>
                <p className="text-sm text-gray-800">{item.text}</p>
                <p className="text-xs text-gray-500">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notification2;
