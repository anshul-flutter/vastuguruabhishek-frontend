// src/components/courseProgress/CourseProgressPage.jsx
import React from "react";
// Note: Removed StudentProfileHeader to keep course-only details in UI
import StatsCard from "./StatsCard";
import ProgressChart from "./ProgressChart";
import LoadingOverlay from "../common/LoadingOverlay";

const getStatusClass = (status) => {
	const normalized = status?.toLowerCase();
	if (normalized === "on track") return "text-green-600";
	if (normalized === "behind") return "text-orange-500";
	if (normalized === "ahead") return "text-blue-600";
	return "text-gray-600";
};

const buildChartData = (timeline, progressPercent) => {
	if (Array.isArray(timeline) && timeline.length > 0) {
		return timeline.map((point) => ({
			date: point.label,
			value: Math.min(100, Math.max(0, point.value ?? 0)),
		}));
	}
	const percent = Math.min(100, Math.max(0, progressPercent ?? 0));
	return [
		{ date: "Start", value: 0 },
		{ date: "Current", value: percent },
	];
};

const formatFraction = (completed, total) => {
	if (total == null || total === 0) {
		return `${completed ?? 0}`;
	}
	return `${completed ?? 0} / ${total}`;
};

export default function CourseProgressPage({
	entries = [],
	isLoading,
	isFetching,
	isError,
}) {
	if (isLoading) {
		return <LoadingOverlay fullscreen message="Loading course progress..." />;
	}

	if (isError) {
		return (
			<p className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-700">
				Failed to load course progress. Please try again.
			</p>
		);
	}

	if (!entries.length) {
		return (
			<p className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
				No course progress tracked yet.
			</p>
		);
	}

	return (
		<div className="relative space-y-8">
			{isFetching && <LoadingOverlay message="Refreshing course progress..." />}

			{entries.map((entry) => {
				const key =
					entry._id ??
					`${entry.student?._id ?? "student"}-${entry.course?._id ?? "course"}`;
				const videosTotal = entry.videosTotal ?? 0;
				const videosCompleted = entry.videosCompleted ?? 0;
				const quizzesTotal = entry.quizzesTotal ?? 0;
				const quizzesCompleted = entry.quizzesCompleted ?? 0;
				const progressPercent = Math.min(
					100,
					Math.max(0, entry.progressPercent ?? 0)
				);
				const status = entry.status ?? "On Track";
				const stats = [
					{
						title: "Videos Watched",
						value: formatFraction(videosCompleted, videosTotal),
						icon: "/images/videos.png",
					},
					{
						title: "Quizzes Completed",
						value: formatFraction(quizzesCompleted, quizzesTotal),
						icon: "/images/quizzes.png",
					},
					{
						title: "Progress",
						value: `${progressPercent}%`,
						icon: "/images/progress.png",
					},
					{
						title: "Status",
						value: (
							<span className={`font-semibold ${getStatusClass(status)}`}>
								{status}
							</span>
						),
						icon: "/images/status.png",
					},
				];

				const chartData = buildChartData(entry.timeline, progressPercent);

				return (
					<article key={key} className="space-y-4">
						{/* Course-only header */}
						<div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs uppercase tracking-wide text-gray-500">
										Course
									</p>
									<h3 className="text-lg font-semibold text-gray-900">
										{entry.course?.title ?? "Untitled Course"}
									</h3>
								</div>
								{entry.progressPercent != null && (
									<div className="text-right">
										<p className="text-xs text-gray-500">Progress</p>
										<p className="text-base font-semibold text-gray-900">
											{progressPercent}%
										</p>
									</div>
								)}
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
							<div className="grid grid-cols-2 gap-4 lg:col-span-1">
								{stats.map((stat) => (
									<StatsCard key={stat.title} {...stat} />
								))}
							</div>
							<div className="lg:col-span-2">
								<ProgressChart data={chartData} />
							</div>
						</div>
					</article>
				);
			})}
		</div>
	);
}
