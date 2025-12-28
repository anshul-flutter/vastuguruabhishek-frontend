import React, { useMemo, useState } from "react";
import { useNumerologyMutation } from "../../hooks/useNumerologyApi";
import toast from "react-hot-toast";

const tableData = [
	["A", "B", "C", "D", "E", "U", "O", "F"],
	["I", "J", "K", "G", "W", "M", "H", "V"],
	["J", "R", "L", "T", "N", "W", "", ""],
	["Q", "", "S", "", "X", "", "", ""],
	["Y", "", "", "", "", "", "", ""],
];

const headers = ["1", "2", "3", "4", "5", "6", "7", "8"];

const NameCalculator = () => {
	const [fullName, setFullName] = useState("");
	const [dob, setDob] = useState("");
	const [error, setError] = useState("");

	const [nameCalculation, setNameCalculation] = useState("");
	const [nameNumber, setNameNumber] = useState("");
	const [soulNumber, setSoulNumber] = useState("");
	const [personalityNumber, setPersonalityNumber] = useState("");
	const [livePathNumber, setLifePathNumber] = useState("");
	const [destinyNumber, setDestinyNumber] = useState("");
	const [loShuGrid, setLoShuGrid] = useState({});

	// Numerology letter to number mapping based on the table
	const letterMap = {
		A: 1,
		I: 1,
		J: 1,
		Q: 1,
		Y: 1,
		B: 2,
		K: 2,
		R: 2,
		C: 3,
		G: 3,
		L: 3,
		S: 3,
		D: 4,
		M: 4,
		T: 4,
		E: 5,
		H: 5,
		N: 5,
		X: 5,
		U: 6,
		V: 6,
		W: 6,
		O: 7,
		Z: 7,
		F: 8,
		P: 8,
	};

	const numerologyMutation = useNumerologyMutation({
		onSuccess: (data) => {
			const payload = data ?? {};
			const nameWithoutSpaces = fullName.replace(/[^A-Za-z]/g, "");
			const calculationDisplay = nameWithoutSpaces
				.split("")
				.map((char) => {
					const upperChar = char.toUpperCase();
					const number = letterMap[upperChar] || 0;
					return `${upperChar}(${number})`;
				})
				.join(" + ");

			setNameCalculation(calculationDisplay);
			setNameNumber(payload.nameNumber ?? "");
			setSoulNumber(payload.soulNumber ?? "");
			setPersonalityNumber(payload.personalityNumber ?? "");
			setLifePathNumber(payload.lifePathNumber ?? "");
			setDestinyNumber(payload.destinyNumber ?? "");
			setLoShuGrid(payload.loShuGrid ?? {});
		},
		onError: (_error, message) => {
			setError(message);
		},
	});

	const loading = numerologyMutation.isPending;

	const resetResults = () => {
		setNameCalculation("");
		setNameNumber("");
		setSoulNumber("");
		setPersonalityNumber("");
		setLifePathNumber("");
		setDestinyNumber("");
		setLoShuGrid({});
	};

	const handleCalculate = () => {
		const trimmedName = fullName.trim();
		if (!trimmedName || !dob) {
			setError("Please enter both full name and date of birth");
			resetResults();
			return;
		}

		const dobRegex = /^\d{2}-\d{2}-\d{4}$/;
		if (!dobRegex.test(dob)) {
			const message = "Date of birth must be in DD-MM-YYYY format";
			setError(message);
			toast.error(message);
			resetResults();
			return;
		}

		setError("");
		numerologyMutation.mutate({ fullName: trimmedName, dob });
	};

	// Generate Lo Shu Grid display
	const generateLoShuGrid = () => {
		const gridOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];
		return gridOrder.map((num, i) => (
			<div
				key={i}
				className="border rounded p-4 flex justify-center items-center text-lg font-bold min-h-[60px]"
			>
				{loShuGrid[num] || ""}
			</div>
		));
	};

	const resultCards = useMemo(
		() => [
			{
				label: "Name Number",
				value: nameNumber,
				className: "text-blue-600",
			},
			{
				label: "Soul Number",
				value: soulNumber,
				className: "text-purple-600",
			},
			{
				label: "Personality Number",
				value: personalityNumber,
				className: "text-green-600",
			},
			{
				label: "Destiny Number / Conductor Number",
				value: destinyNumber,
				className: "text-indigo-600",
			},
		],
		[nameNumber, soulNumber, personalityNumber, destinyNumber]
	);

	const hasResults = Boolean(
		nameNumber || soulNumber || personalityNumber || destinyNumber
	);

	const totalNameValue = useMemo(() => {
		if (!nameCalculation) return 0;
		return nameCalculation.split(" + ").reduce((sum, part) => {
			const number = part.match(/\((\d+)\)/);
			return sum + (number ? parseInt(number[1]) : 0);
		}, 0);
	}, [nameCalculation]);

	return (
		<div className="p-6 flex gap-6 max-[800px]:flex-col">
			{/* Left Section */}
			<div className="w-[30%] max-[800px]:w-full space-y-4">
				<div className="bg-white p-4 rounded-lg border-gray-300 shadow">
					<label className="block text-sm font-semibold">Full Name</label>
					<input
						type="text"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						className="w-full p-2 border rounded mt-1"
						placeholder="Enter Full Name"
						disabled={loading}
					/>

					<label className="block text-sm font-semibold mt-3">
						Date of Birth
					</label>
					<input
						type="text"
						value={dob}
						onChange={(e) => setDob(e.target.value)}
						className="w-full p-2 border rounded mt-1"
						placeholder="DD-MM-YYYY"
						disabled={loading}
					/>

					<button
						onClick={handleCalculate}
						disabled={loading || !fullName.trim() || !dob}
						className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? "Calculating..." : "Calculate"}
					</button>

					{error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
				</div>

				{/* Lo Shu Grid */}
				<div>
					<h2 className="font-semibold mb-2">Lo Shu Grid</h2>
					<div className="grid grid-cols-3 gap-2">{generateLoShuGrid()}</div>
				</div>

				{/* Numerology Chart */}
				<div>
					<h2 className="font-semibold mb-2">Numerology Number Chart</h2>
					<div className="overflow-x-auto">
						<table className="border-collapse border border-gray-400">
							<thead>
								<tr>
									{headers.map((h, i) => (
										<th
											key={i}
											className="border border-gray-400 p-2 w-12 text-center"
										>
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{tableData.map((row, rowIndex) => (
									<tr key={rowIndex}>
										{row.map((cell, colIndex) => (
											<td
												key={colIndex}
												className="border border-gray-400 p-2 text-center w-12 h-12"
											>
												{cell}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* Right Section */}
			<div className="flex max-[500px]:flex-col flex-1 gap-[2rem]">
				<div className="flex flex-col flex-1 gap-[1rem]">
					<div className="bg-white p-4 rounded-lg border-gray-300 shadow flex-1 border">
						<h2 className="font-semibold mb-2">Name Calculation</h2>
						<p className="text-gray-600 text-sm break-words">
							{nameCalculation || "Enter name to see calculation"}
						</p>
						{nameCalculation && (
							<div className="mt-2 pt-2 border-t">
								<p className="text-xs text-gray-500">Total: {totalNameValue}</p>
							</div>
						)}
					</div>
					{/* <div className="bg-white p-4 rounded-lg border-gray-300 shadow flex-1 border">
              <h2 className="font-semibold mb-2">
                Driver Number / Conductor Number Calculate
              </h2>
              <p className="text-2xl font-bold text-orange-600">
                {driverNumber || "-"}
              </p>
            </div> */}
					<div className="bg-white p-4 rounded-lg border-gray-300 shadow flex-1 border">
						<h2 className="font-semibold mb-2">
							Life Path Number / Driver Number
						</h2>
						<p className="text-2xl font-bold text-red-600">
							{livePathNumber || "-"}
						</p>
					</div>
				</div>

				<div className="flex gap-[1rem] flex-col flex-1">
					{resultCards.map((card) => (
						<div
							key={card.label}
							className="bg-white p-4 rounded-lg border-gray-300 shadow flex-1 border"
						>
							<h2 className="font-semibold mb-2">{card.label}</h2>
							<p className={`text-2xl font-bold ${card.className}`}>
								{hasResults ? card.value || "-" : "-"}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default NameCalculator;
