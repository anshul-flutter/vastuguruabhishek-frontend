import React, { useState } from "react";
import { useGenerateKundli, useGetLocation } from "../../hooks/useKundliApi";
import toast from "react-hot-toast";
import { FaUser, FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";

const KundliGenerator = () => {
	const [formData, setFormData] = useState({
		name: "",
		day: "",
		month: "",
		year: "",
		hour: "",
		minute: "",
		place: "",
		latitude: "",
		longitude: "",
		timezone: "5.5", // IST default
	});

	const [kundliData, setKundliData] = useState(null);
	const [showResults, setShowResults] = useState(false);
	const [activeChartTab, setActiveChartTab] = useState("lagna"); // 'lagna' or 'navamsa'

	const kundliMutation = useGenerateKundli({
		onSuccess: (responseData) => {
			try {
				console.log("Raw response data:", responseData);

				// Parse the API response
				// The hook already extracts and structures the data properly
				const parsedData = {
					name: responseData.name,
					// Planets data structure: { output: {...planets} }
					planets: responseData.planets?.output || responseData.planets,
					// Chart SVG structure: { output: "SVG string" }
					lagnaChart:
						responseData.lagnaChart?.output || responseData.lagnaChart,
					navamsaChart:
						responseData.navamsaChart?.output || responseData.navamsaChart,
					// Nakshatra structure: { output: "JSON string" }
					nakshatra:
						typeof responseData.nakshatra?.output === "string"
							? JSON.parse(responseData.nakshatra.output)
							: responseData.nakshatra,
					// Dasha structure: { output: "JSON string" }
					dasha:
						typeof responseData.dasha?.output === "string"
							? JSON.parse(responseData.dasha.output)
							: responseData.dasha,
				};

				console.log("Parsed kundli data:", parsedData);
				setKundliData(parsedData);
				setShowResults(true);
			} catch (error) {
				console.error("Error parsing Kundli data:", error);
				console.error("Error details:", error.message, error.stack);
				toast.error("Failed to parse Kundli data: " + error.message);
			}
		},
		onError: (error) => {
			toast.error(error.message || "Failed to generate Kundli");
		},
	});

	const locationMutation = useGetLocation({
		onSuccess: (data) => {
			setFormData((prev) => ({
				...prev,
				latitude: data.latitude,
				longitude: data.longitude,
			}));
			toast.success(`Location found: ${data.displayName}`);
		},
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleGetLocation = () => {
		if (!formData.place.trim()) {
			toast.error("Please enter a place name");
			return;
		}
		locationMutation.mutate(formData.place);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// Validation
		if (!formData.name.trim()) {
			toast.error("Please enter your name");
			return;
		}

		if (!formData.day || !formData.month || !formData.year) {
			toast.error("Please enter complete date of birth");
			return;
		}

		if (!formData.hour || !formData.minute) {
			toast.error("Please enter time of birth");
			return;
		}

		if (!formData.latitude || !formData.longitude) {
			toast.error("Please get location coordinates");
			return;
		}

		kundliMutation.mutate(formData);
	};

	const handleReset = () => {
		setFormData({
			name: "",
			day: "",
			month: "",
			year: "",
			hour: "",
			minute: "",
			place: "",
			latitude: "",
			longitude: "",
			timezone: "5.5",
		});
		setKundliData(null);
		setShowResults(false);
		setActiveChartTab("lagna"); // Reset to lagna chart tab
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8 px-4">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
						Free Kundli Generator
					</h1>
					<p className="text-gray-600">
						Generate your personalized Vedic astrology birth chart
					</p>
				</div>

				{!showResults ? (
					/* Form Section */
					<div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-3xl mx-auto">
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Name */}
							<div>
								<label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
									<FaUser className="mr-2 text-orange-600" />
									Full Name
								</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
									placeholder="Enter your full name"
									disabled={kundliMutation.isPending}
								/>
							</div>

							{/* Date of Birth */}
							<div>
								<label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
									<FaCalendarAlt className="mr-2 text-orange-600" />
									Date of Birth
								</label>
								<div className="grid grid-cols-3 gap-3">
									<input
										type="number"
										name="day"
										value={formData.day}
										onChange={handleInputChange}
										className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										placeholder="Day"
										min="1"
										max="31"
										disabled={kundliMutation.isPending}
									/>
									<input
										type="number"
										name="month"
										value={formData.month}
										onChange={handleInputChange}
										className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										placeholder="Month"
										min="1"
										max="12"
										disabled={kundliMutation.isPending}
									/>
									<input
										type="number"
										name="year"
										value={formData.year}
										onChange={handleInputChange}
										className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										placeholder="Year"
										min="1900"
										max="2100"
										disabled={kundliMutation.isPending}
									/>
								</div>
							</div>

							{/* Time of Birth */}
							<div>
								<label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
									<FaClock className="mr-2 text-orange-600" />
									Time of Birth (24-hour format)
								</label>
								<div className="grid grid-cols-2 gap-3">
									<input
										type="number"
										name="hour"
										value={formData.hour}
										onChange={handleInputChange}
										className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										placeholder="Hour (0-23)"
										min="0"
										max="23"
										disabled={kundliMutation.isPending}
									/>
									<input
										type="number"
										name="minute"
										value={formData.minute}
										onChange={handleInputChange}
										className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										placeholder="Minute (0-59)"
										min="0"
										max="59"
										disabled={kundliMutation.isPending}
									/>
								</div>
							</div>

							{/* Place of Birth */}
							<div>
								<label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
									<FaMapMarkerAlt className="mr-2 text-orange-600" />
									Place of Birth
								</label>
								<div className="flex gap-2">
									<input
										type="text"
										name="place"
										value={formData.place}
										onChange={handleInputChange}
										className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										placeholder="Enter city name"
										disabled={kundliMutation.isPending}
									/>
									<button
										type="button"
										onClick={handleGetLocation}
										disabled={
											locationMutation.isPending || kundliMutation.isPending
										}
										className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{locationMutation.isPending
											? "Loading..."
											: "Get Coordinates"}
									</button>
								</div>
								{formData.latitude && formData.longitude && (
									<p className="text-xs text-green-600 mt-1">
										Coordinates: {parseFloat(formData.latitude).toFixed(4)},{" "}
										{parseFloat(formData.longitude).toFixed(4)}
									</p>
								)}
							</div>

							{/* Timezone */}
							<div>
								<label className="text-sm font-semibold text-gray-700 mb-2 block">
									Timezone (hours from UTC)
								</label>
								<input
									type="number"
									name="timezone"
									value={formData.timezone}
									onChange={handleInputChange}
									className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
									placeholder="5.5 for IST"
									step="0.5"
									disabled={kundliMutation.isPending}
								/>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								disabled={kundliMutation.isPending}
								className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
							>
								{kundliMutation.isPending
									? "Generating Kundli... (This may take 5-10 seconds)"
									: "Generate Kundli"}
							</button>

							{/* Info Message */}
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
								<p className="text-xs text-blue-800">
									<strong>Note:</strong> Kundli generation takes 5-10 seconds
									due to API rate limits.
								</p>
							</div>
						</form>
					</div>
				) : (
					/* Results Section */
					<div className="space-y-6">
						{/* Header with name and birth details */}
						<div className="bg-white rounded-xl shadow-lg p-6">
							<div className="flex justify-between items-start mb-4">
								<div>
									<h2 className="text-2xl font-bold text-gray-800">
										{kundliData?.name || formData.name}
									</h2>
									<p className="text-gray-600 mt-1">
										Born on {formData.day}/{formData.month}/{formData.year} at{" "}
										{formData.hour}:{formData.minute}
									</p>
									<p className="text-gray-600">{formData.place}</p>
								</div>
								<button
									onClick={handleReset}
									className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
								>
									New Kundli
								</button>
							</div>
						</div>

						{/* Birth Charts - Lagna and Navamsa with Tabs */}
						<div className="bg-white rounded-xl shadow-lg p-6">
							<h3 className="text-xl font-bold text-gray-800 mb-4">
								Birth Charts
							</h3>

							{/* Chart Type Tabs - only show if we have multiple charts */}
							{kundliData?.navamsaChart && (
								<div className="flex gap-2 mb-4 border-b border-gray-200">
									<button
										onClick={() => setActiveChartTab("lagna")}
										className={`px-4 py-2 font-semibold transition-colors ${
											activeChartTab === "lagna"
												? "text-orange-600 border-b-2 border-orange-600"
												: "text-gray-600 hover:text-gray-800"
										}`}
									>
										Lagna Kundli (D1)
									</button>
									<button
										onClick={() => setActiveChartTab("navamsa")}
										className={`px-4 py-2 font-semibold transition-colors ${
											activeChartTab === "navamsa"
												? "text-orange-600 border-b-2 border-orange-600"
												: "text-gray-600 hover:text-gray-800"
										}`}
									>
										Navamsa (D9)
									</button>
								</div>
							)}

							{/* Chart Display */}
							<div className="flex justify-center">
								{activeChartTab === "lagna" && kundliData?.lagnaChart ? (
									<div>
										<div
											dangerouslySetInnerHTML={{
												__html: kundliData.lagnaChart,
											}}
											className="max-w-full"
										/>
										<p className="text-sm text-gray-600 text-center mt-2">
											Lagna Kundli (Rasi Chart) - Shows planetary positions in
											houses based on ascendant
										</p>
									</div>
								) : activeChartTab === "navamsa" && kundliData?.navamsaChart ? (
									<div>
										<div
											dangerouslySetInnerHTML={{
												__html: kundliData.navamsaChart,
											}}
											className="max-w-full"
										/>
										<p className="text-sm text-gray-600 text-center mt-2">
											Navamsa Chart (D9) - Important divisional chart for
											marriage and spiritual matters
										</p>
									</div>
								) : kundliData?.lagnaChart ? (
									// Fallback: show lagna chart if navamsa tab is active but no navamsa data
									<div>
										<div
											dangerouslySetInnerHTML={{
												__html: kundliData.lagnaChart,
											}}
											className="max-w-full"
										/>
										<p className="text-sm text-gray-600 text-center mt-2">
											Lagna Kundli (Rasi Chart) - Shows planetary positions in
											houses based on ascendant
										</p>
									</div>
								) : (
									<p className="text-gray-500">Chart not available</p>
								)}
							</div>
						</div>

						{/* Planetary Positions */}
						<div className="bg-white rounded-xl shadow-lg p-6">
							<h3 className="text-xl font-bold text-gray-800 mb-4">
								Planetary Positions
							</h3>
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead className="bg-gray-100">
										<tr>
											<th className="px-4 py-2 text-left">Planet</th>
											<th className="px-4 py-2 text-left">Sign</th>
											<th className="px-4 py-2 text-left">Degree</th>
											<th className="px-4 py-2 text-left">House</th>
											<th className="px-4 py-2 text-left">Nakshatra</th>
										</tr>
									</thead>
									<tbody>
										{kundliData?.planets &&
											Object.entries(kundliData.planets).map(
												([planetName, planetData]) => (
													<tr key={planetName} className="border-b">
														<td className="px-4 py-2 font-semibold">
															{planetData.localized_name}
															{planetData.isRetro === "true" && (
																<span className="text-red-500 ml-1">(R)</span>
															)}
														</td>
														<td className="px-4 py-2">
															{planetData.zodiac_sign_name}
														</td>
														<td className="px-4 py-2">
															{planetData.degrees}° {planetData.minutes}'{" "}
															{Math.round(planetData.seconds)}"
														</td>
														<td className="px-4 py-2">
															{planetData.house_number}
														</td>
														<td className="px-4 py-2">
															{planetData.nakshatra_name} (
															{planetData.nakshatra_pada})
														</td>
													</tr>
												)
											)}
									</tbody>
								</table>
							</div>
						</div>

						{/* Nakshatra Details */}
						{kundliData?.nakshatra && (
							<div className="bg-white rounded-xl shadow-lg p-6">
								<h3 className="text-xl font-bold text-gray-800 mb-4">
									Birth Nakshatra
								</h3>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
									<div>
										<p className="text-gray-600 text-sm">Nakshatra</p>
										<p className="font-semibold text-lg">
											{kundliData.nakshatra.name}
										</p>
									</div>
									<div>
										<p className="text-gray-600 text-sm">Number</p>
										<p className="font-semibold text-lg">
											{kundliData.nakshatra.number}
										</p>
									</div>
									<div>
										<p className="text-gray-600 text-sm">Starts At</p>
										<p className="font-semibold text-sm">
											{new Date(
												kundliData.nakshatra.starts_at
											).toLocaleString()}
										</p>
									</div>
									<div>
										<p className="text-gray-600 text-sm">Ends At</p>
										<p className="font-semibold text-sm">
											{new Date(kundliData.nakshatra.ends_at).toLocaleString()}
										</p>
									</div>
									<div>
										<p className="text-gray-600 text-sm">Remaining</p>
										<p className="font-semibold text-lg">
											{kundliData.nakshatra.remaining_percentage_at_given_time.toFixed(
												2
											)}
											%
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Dasha System */}
						{kundliData?.dasha && (
							<div className="bg-white rounded-xl shadow-lg p-6">
								<h3 className="text-xl font-bold text-gray-800 mb-4">
									Vimsottari Maha Dasha
								</h3>
								<div className="space-y-2">
									{Object.entries(kundliData.dasha).map(([key, dasha]) => {
										const startDate = new Date(dasha.start_time);
										const endDate = new Date(dasha.end_time);
										const now = new Date();
										const isCurrent = now >= startDate && now <= endDate;

										return (
											<div
												key={key}
												className={`flex justify-between items-center border-l-4 pl-4 py-2 ${
													isCurrent
														? "border-orange-600 bg-orange-50"
														: "border-gray-300"
												}`}
											>
												<div>
													<p className="font-semibold text-lg">
														{dasha.Lord}
														{isCurrent && (
															<span className="ml-2 text-xs bg-orange-600 text-white px-2 py-1 rounded">
																Current
															</span>
														)}
													</p>
												</div>
												<div className="text-right">
													<p className="text-sm text-gray-600">
														{startDate.toLocaleDateString()} -{" "}
														{endDate.toLocaleDateString()}
													</p>
													<p className="text-xs text-gray-500">
														{Math.round(
															(endDate - startDate) /
																(365.25 * 24 * 60 * 60 * 1000)
														)}{" "}
														years
													</p>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default KundliGenerator;
