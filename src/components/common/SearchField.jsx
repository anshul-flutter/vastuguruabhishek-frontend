import React from "react";

const SearchField = ({ value, onChange, placeholder = "Search key words..." }) => (
  <label className="relative flex items-center w-full md:w-80">
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500"
    />
    {/* inline search icon */}
    <svg
      className="absolute left-3 h-5 w-5 text-gray-400"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  </label>
);

export default SearchField;