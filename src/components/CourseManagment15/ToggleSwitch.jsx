import React, { useState } from "react";

const ToggleSwitch = ({ label }) => {
  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    setChecked(!checked);
  };

  return (
    <label className="flex items-center gap-3 cursor-pointer">
      {/* Hidden Checkbox */}
      <input
        type="checkbox"
        checked={checked}
        onChange={handleToggle}
        className="hidden"
      />

      {/* Switch UI */}
      <div
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? "bg-[#BB0E00]" : "bg-gray-300"
        }`}
      >
        <div
          className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </div>

      {/* Optional Label */}
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
};

export default ToggleSwitch;
