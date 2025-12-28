import React from "react";

const PageBtn = ({ children, active, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`h-8 min-w-8 px-2 rounded-md text-sm border transition
      ${active ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    {children}
  </button>
);

const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;
  const numbers = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-2">
      <PageBtn onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}>{"<"}</PageBtn>
      {numbers.map((n) => (
        <PageBtn key={n} onClick={() => onChange(n)} active={n === page}>{n}</PageBtn>
      ))}
      <PageBtn onClick={() => onChange(Math.min(pages, page + 1))} disabled={page === pages}>{">"}</PageBtn>
    </div>
  );
};

export default Pagination;