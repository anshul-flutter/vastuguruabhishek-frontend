import React from "react";

const palette = {
  Basic: "bg-green-100 text-green-700 border-green-200",
  Mid: "bg-gray-100 text-gray-700 border-gray-200",
  Adv: "bg-amber-100 text-amber-700 border-amber-200",
//   Platinum: "bg-purple-100 text-purple-700 border-purple-200",
};

const StatusPill = ({ level }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${
    palette[level] || "bg-gray-100 text-gray-700 border-gray-200"
  }`}>
    {level}
  </span>
);

export default StatusPill;