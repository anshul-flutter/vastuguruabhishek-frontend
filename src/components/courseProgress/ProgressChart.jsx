// src/components/courseProgress/ProgressChart.jsx
import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function ProgressChart({ data }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis dataKey="date" axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
          <Tooltip />

          {/* Bars */}
          <Bar dataKey="value" barSize={30} fill="#3b82f6" radius={[8, 8, 0, 0]} />

          {/* Area overlay */}
          <Area
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            fill="url(#grad)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
