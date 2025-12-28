import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { day: "S", value: 40 },
  { day: "M", value: 30 },
  { day: "T", value: 80 },
  { day: "W", value: 45 },
  { day: "T", value: 35 },
  { day: "F", value: 70 },
  { day: "S", value: 50 },
];

const StatsChart = () => {
  // Get current day of week (0-6 where 0 is Sunday)
  const currentDayIndex = new Date().getDay();

  // Find the matching index in your data array
  let highlightIndex = -1;

  // This handles the case where you have duplicate day abbreviations (like 'T' for Tuesday and Thursday)
  let foundFirstT = false;

  for (let i = 0; i < data.length; i++) {
    const dayAbbr = data[i].day;

    if (
      (currentDayIndex === 0 && dayAbbr === "S") || // Sunday
      (currentDayIndex === 1 && dayAbbr === "M") || // Monday
      (currentDayIndex === 2 && dayAbbr === "T" && !foundFirstT) || // Tuesday (first T)
      (currentDayIndex === 3 && dayAbbr === "W") || // Wednesday
      (currentDayIndex === 4 && dayAbbr === "T" && foundFirstT) || // Thursday (second T)
      (currentDayIndex === 5 && dayAbbr === "F") || // Friday
      (currentDayIndex === 6 && dayAbbr === "S") // Saturday
    ) {
      highlightIndex = i;
      break;
    }

    if (dayAbbr === "T") foundFirstT = true;
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer
        className={
          "bg-[#fbfbfb] border rounded-lg min-shadow border-gray-300 p-2"
        }
      >
        <BarChart data={data} barSize={30}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip />
          <Bar dataKey="value" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  index === highlightIndex
                    ? "url(#highlightGradient)"
                    : "rgba(255, 99, 132, 0.5)"
                }
              />
            ))}
          </Bar>

          {/* Gradient for highlighted bar */}
          <defs>
            <linearGradient id="highlightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d7263d" />
              <stop offset="100%" stopColor="#f46036" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;
