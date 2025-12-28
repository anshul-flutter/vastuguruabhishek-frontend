import React, { createContext, useContext, useState } from "react";

const TabsContext = createContext();

const Tabs = ({
	defaultValue,
	value,
	onValueChange,
	children,
	className = "",
	...props
}) => {
	const [selectedTab, setSelectedTab] = useState(defaultValue || value);

	const handleValueChange = (newValue) => {
		setSelectedTab(newValue);
		if (onValueChange) {
			onValueChange(newValue);
		}
	};

	const contextValue = {
		value: value || selectedTab,
		onValueChange: handleValueChange,
	};

	return (
		<TabsContext.Provider value={contextValue}>
			<div className={`w-full ${className}`} {...props}>
				{children}
			</div>
		</TabsContext.Provider>
	);
};

const TabsList = ({ className = "", children, ...props }) => {
	return (
		<div
			className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}
			{...props}
		>
			{children}
		</div>
	);
};

const TabsTrigger = ({ value, className = "", children, ...props }) => {
	const context = useContext(TabsContext);

	if (!context) {
		throw new Error("TabsTrigger must be used within a Tabs component");
	}

	const isActive = context.value === value;

	return (
		<button
			className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
				isActive
					? "bg-white text-gray-950 shadow-sm"
					: "hover:bg-white/50 hover:text-gray-950"
			} ${className}`}
			onClick={() => context.onValueChange(value)}
			{...props}
		>
			{children}
		</button>
	);
};

const TabsContent = ({ value, className = "", children, ...props }) => {
	const context = useContext(TabsContext);

	if (!context) {
		throw new Error("TabsContent must be used within a Tabs component");
	}

	if (context.value !== value) {
		return null;
	}

	return (
		<div
			className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 ${className}`}
			{...props}
		>
			{children}
		</div>
	);
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
