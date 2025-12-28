// src/components/courseProgress/StatsCard.jsx
import React from "react";

export default function StatsCard({ title, value, small, icon }) {
  return (
    <div className="card p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        {/* Left: Title & Value */}
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className={`${small ? "text-md" : "text-lg"} font-semibold text-gray-900`}>
            {value}
          </div>
        </div>

        {/* Right: Icon */}
        <div className="bg-red-100 p-3 rounded-lg flex items-center justify-center">
          {icon ? (
            <img
              src={icon}
              alt={title}
              className="w-6 h-6 object-contain"
            />
          ) : (
            <div className="w-6 h-6 bg-red-300 rounded" />
          )}
        </div>
      </div>
    </div>
  );
}
