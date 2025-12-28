// src/components/common/Tabs.jsx
import React from "react";

export default function Tabs({ tabs, activeTab, onTabChange }) {
	if (!tabs || tabs.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-wrap gap-3">
			{tabs.map((tab) => {
				const isActive = activeTab === tab.key;
				return (
					<button
						key={tab.key}
						type="button"
						onClick={() => onTabChange(tab.key)}
						className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
							isActive
								? "text-white"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
						style={
							isActive
								? {
										background: "linear-gradient(to right, #BB0E00, #B94400)",
								  }
								: undefined
						}
					>
						<span>{tab.label}</span>
						{tab.badge !== undefined && (
							<span
								className={`rounded-full px-2 py-0.5 text-xs ${
									isActive ? "bg-white/20 text-white" : "bg-white text-gray-900"
								}`}
							>
								{tab.badge}
							</span>
						)}
					</button>
				);
			})}
		</div>
	);
}
