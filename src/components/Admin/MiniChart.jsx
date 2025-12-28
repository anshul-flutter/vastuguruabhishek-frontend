// src/components/Admin/MiniChart.jsx
import React, { useMemo } from "react";

/**
 * MiniChart
 * props:
 *  - data: number[] (e.g. [10, 35, 20, 50, ...])
 *  - stroke (optional) default '#2FB100'
 *  - strokeWidth (optional)
 *  - height (optional)
 */
export default function MiniChart({
  data = [],
  stroke = "#2FB100",
  strokeWidth = 1.5,
  width = 312,
  height = 82,
  padding = 8,
}) {
  // unique gradient id (so multiple charts can co-exist)
  const gradId = useMemo(
    () => "g" + Math.random().toString(36).slice(2, 9),
    []
  );

  const points = useMemo(() => {
    if (!data || data.length === 0) {
      // fallback single flat line
      return [
        { x: padding, y: height / 2 },
        { x: width - padding, y: height / 2 },
      ];
    }
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    const w = width - padding * 2;
    const h = height - padding * 2;
    return data.map((d, i) => {
      const x = padding + (i / Math.max(1, data.length - 1)) * w;
      const norm = (d - min) / span;
      const y = padding + (1 - norm) * h;
      return { x: +x.toFixed(2), y: +y.toFixed(2) };
    });
  }, [data, width, height, padding]);

  // Catmull-Rom -> Cubic Bezier converter (creates smooth path)
  const pathD = useMemo(() => {
    if (!points || points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i === 0 ? points[0] : points[i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i + 2 < points.length ? points[i + 2] : p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`;
    }
    return d;
  }, [points]);

  // area path (close to bottom)
  const areaD = useMemo(() => {
    if (!pathD) return "";
    const first = points[0];
    const last = points[points.length - 1];
    // line to baseline and back to start, then close
    return `${pathD} L ${last.x} ${height - padding} L ${first.x} ${height - padding} Z`;
  }, [pathD, points, height, padding]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="w-full h-20"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.18" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* area fill */}
      {areaD && (
        <path d={areaD} fill={`url(#${gradId})`} stroke="none" />
      )}

      {/* smooth green stroke */}
      <path
        d={pathD}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
