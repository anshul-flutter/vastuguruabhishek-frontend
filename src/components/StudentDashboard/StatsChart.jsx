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

const defaultData = [
	{ day: "S", value: 40 },
	{ day: "M", value: 30 },
	{ day: "T", value: 80 },
	{ day: "W", value: 45 },
	{ day: "T", value: 35 },
	{ day: "F", value: 70 },
	{ day: "S", value: 50 },
];

const StatsChart = ({ activityData = defaultData }) => {
	// Get current day of week (0-6 where 0 is Sunday)
	const currentDayIndex = new Date().getDay();

	// Find the matching index in the data array
	let highlightIndex = -1;

	// This handles the case where you have duplicate day abbreviations (like 'T' for Tuesday and Thursday)
	let foundFirstT = false;

	for (let i = 0; i < activityData.length; i++) {
		const dayAbbr = activityData[i].day;

		if (
			(currentDayIndex === 0 && dayAbbr === "S" && i === 0) || // Sunday (first S)
			(currentDayIndex === 1 && dayAbbr === "M") || // Monday
			(currentDayIndex === 2 && dayAbbr === "T" && !foundFirstT) || // Tuesday (first T)
			(currentDayIndex === 3 && dayAbbr === "W") || // Wednesday
			(currentDayIndex === 4 && dayAbbr === "T" && foundFirstT) || // Thursday (second T)
			(currentDayIndex === 5 && dayAbbr === "F") || // Friday
			(currentDayIndex === 6 && dayAbbr === "S" && i === 6) // Saturday (last S)
		) {
			highlightIndex = i;
			break;
		}

		if (dayAbbr === "T") foundFirstT = true;
	}

	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white p-3 border border-gray-300 rounded-lg shadow-md">
					<p className="font-medium">{`Day: ${label}`}</p>
					<p className="text-[#bb1201]">{`Activity: ${payload[0].value}`}</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div style={{ width: "100%", height: 300 }}>
			<ResponsiveContainer
				className={
					"bg-[#fbfbfb] border rounded-lg min-shadow border-gray-300 p-2"
				}
			>
				<BarChart data={activityData} barSize={30}>
					<CartesianGrid strokeDasharray="3 3" vertical={false} />
					<XAxis dataKey="day" axisLine={false} tickLine={false} />
					<YAxis hide />
					<Tooltip content={<CustomTooltip />} />
					<Bar dataKey="value" radius={[10, 10, 0, 0]}>
						{activityData.map((entry, index) => (
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
