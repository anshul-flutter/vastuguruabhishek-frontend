import React, { useMemo, useState } from "react";
import { useHomeContentQuery } from "../../hooks/useHomeContentQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import toast from "react-hot-toast";

export default function HomeContentEditor() {
	const queryClient = useQueryClient();
	const { data, isLoading, error } = useHomeContentQuery();
	const initial = useMemo(
		() => ({
			servicesSection: {
				subtitle:
					data?.servicesSection?.subtitle ??
					"Briefly describe your core offerings here.",
			},
			premiumSection: {
				subtitle:
					data?.premiumSection?.subtitle ??
					"Explain premium consultations or products.",
			},
			freeSection: {
				subtitle:
					data?.freeSection?.subtitle ??
					"Describe free tools and resources offered.",
			},
		}),
		[data]
	);

	const [form, setForm] = useState(initial);

	// Keep form in sync when data loads later
	React.useEffect(() => {
		setForm(initial);
	}, [initial]);

	const updateMutation = useMutation({
		mutationFn: async (payload) => {
			const res = await apiClient.put("/home-content", payload);
			return res.data;
		},
		onSuccess: () => {
			toast.success("Home content updated");
			queryClient.invalidateQueries({ queryKey: ["homeContent"] });
		},
		onError: (err) => {
			const msg =
				err?.response?.data?.message || err?.message || "Update failed";
			toast.error(msg);
		},
	});

	const handleChange = (section, field, value) => {
		setForm((prev) => ({
			...prev,
			[section]: {
				...prev[section],
				[field]: value,
			},
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		updateMutation.mutate(form);
	};

	if (isLoading) {
		return <div className="p-4">Loading content…</div>;
	}

	if (error) {
		return (
			<div className="p-4 text-red-600">Failed to load: {error.message}</div>
		);
	}

	return (
		<div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow">
			<h2 className="text-2xl font-semibold mb-4">Content Management</h2>
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Services */}
				<fieldset className="border border-gray-200 rounded-md p-4">
					<legend className="px-2 text-sm font-medium">Services Section</legend>
					<div className="space-y-3">
						<div className="text-sm text-gray-700">
							<span className="font-medium">Title:</span>{" "}
							{data?.servicesSection?.title ?? "Our Services"}
						</div>
						<label className="block">
							<span className="text-sm text-gray-700">Subtitle</span>
							<textarea
								value={form.servicesSection.subtitle}
								onChange={(e) =>
									handleChange("servicesSection", "subtitle", e.target.value)
								}
								className="mt-1 w-full border rounded-md px-3 py-2"
								rows={3}
							/>
						</label>
					</div>
				</fieldset>

				{/* Premium */}
				<fieldset className="border border-gray-200 rounded-md p-4">
					<legend className="px-2 text-sm font-medium">Premium Section</legend>
					<div className="space-y-3">
						<div className="text-sm text-gray-700">
							<span className="font-medium">Title:</span>{" "}
							{data?.premiumSection?.title ?? "Premium Services"}
						</div>
						<label className="block">
							<span className="text-sm text-gray-700">Subtitle</span>
							<textarea
								value={form.premiumSection.subtitle}
								onChange={(e) =>
									handleChange("premiumSection", "subtitle", e.target.value)
								}
								className="mt-1 w-full border rounded-md px-3 py-2"
								rows={3}
							/>
						</label>
					</div>
				</fieldset>

				{/* Free */}
				<fieldset className="border border-gray-200 rounded-md p-4">
					<legend className="px-2 text-sm font-medium">Free Section</legend>
					<div className="space-y-3">
						<div className="text-sm text-gray-700">
							<span className="font-medium">Title:</span>{" "}
							{data?.freeSection?.title ?? "Free Services"}
						</div>
						<label className="block">
							<span className="text-sm text-gray-700">Subtitle</span>
							<textarea
								value={form.freeSection.subtitle}
								onChange={(e) =>
									handleChange("freeSection", "subtitle", e.target.value)
								}
								className="mt-1 w-full border rounded-md px-3 py-2"
								rows={3}
							/>
						</label>
					</div>
				</fieldset>

				<div className="flex items-center gap-3">
					<button
						type="submit"
						className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-60"
						disabled={updateMutation.isLoading}
					>
						{updateMutation.isLoading ? "Saving…" : "Save Changes"}
					</button>
				</div>
			</form>
		</div>
	);
}
