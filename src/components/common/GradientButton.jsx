// src/components/common/GradientButton.jsx
import React from "react";

export default function GradientButton({
  as = "button",
  children,
  className = "",
  gradient = "customerList", // "customerList" | "view"
  ...rest
}) {
  const Tag = as;

  const style =
    gradient === "view"
      ? { background: "linear-gradient(90deg, #BB0E00 0%, #B94400 100%)" }
      : { background: "linear-gradient(90deg, #BB0E00 0%, #FA5446 100%)" };

  return (
    <Tag
      style={style}
      className={`text-white text-sm px-4 py-2 rounded-md shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#BB0E00] ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
