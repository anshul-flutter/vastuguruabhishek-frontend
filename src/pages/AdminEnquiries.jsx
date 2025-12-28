import React, { useMemo, useState } from "react";
import { useContactEnquiriesQuery } from "../hooks/useContactApi";
import { FaSearch } from "react-icons/fa";

const AdminEnquiries = () => {
	const [search, setSearch] = useState("");
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);

	const { data: enquiries = [], isLoading } = useContactEnquiriesQuery();

	const filtered = useMemo(() => {
		let list = Array.isArray(enquiries) ? enquiries : [];

		// Text search across name, email, phone, city, country, message
		if (search.trim()) {
			const q = search.trim().toLowerCase();
			list = list.filter((e) => {
				const fields = [e.name, e.email, e.phone, e.city, e.country, e.message]
					.filter(Boolean)
					.join(" ")
					.toLowerCase();
				return fields.includes(q);
			});
		}

		// Date range filter (createdAt)
		if (fromDate) {
			const from = new Date(fromDate);
			list = list.filter((e) => new Date(e.createdAt) >= from);
		}
		if (toDate) {
			// include whole day
			const to = new Date(toDate);
			to.setHours(23, 59, 59, 999);
			list = list.filter((e) => new Date(e.createdAt) <= to);
		}

		return list;
	}, [enquiries, search, fromDate, toDate]);

	const total = filtered.length;
	const totalPages = Math.max(1, Math.ceil(total / limit));
	const currentPage = Math.min(page, totalPages);
	const startIndex = (currentPage - 1) * limit;
	const pageData = filtered.slice(startIndex, startIndex + limit);

	const onChangeLimit = (e) => {
		setLimit(Number(e.target.value));
		setPage(1);
	};

	return (
		<div className="p-4 sm:p-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">All Enquiries</h1>
				<div className="text-sm text-gray-500">Total: {total}</div>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 mb-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="relative">
						<FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							placeholder="Search name, email, phone, message..."
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setPage(1);
							}}
							className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
						/>
					</div>
					<input
						type="date"
						value={fromDate}
						onChange={(e) => {
							setFromDate(e.target.value);
							setPage(1);
						}}
						className="border rounded-md px-3 py-2"
					/>
					<input
						type="date"
						value={toDate}
						onChange={(e) => {
							setToDate(e.target.value);
							setPage(1);
						}}
						className="border rounded-md px-3 py-2"
					/>
				</div>

				<div className="mt-4 flex items-center gap-3">
					<label className="text-sm text-gray-600">Rows per page</label>
					<select
						value={limit}
						onChange={onChangeLimit}
						className="border rounded-md px-2 py-1"
					>
						<option value={10}>10</option>
						<option value={20}>20</option>
						<option value={50}>50</option>
					</select>
					<button
						onClick={() => {
							setSearch("");
							setFromDate("");
							setToDate("");
							setPage(1);
						}}
						className="ml-auto bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 text-sm"
					>
						Clear Filters
					</button>
				</div>
			</div>

			{/* Table */}
			<div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
				<table className="min-w-full text-sm">
					<thead className="bg-gray-50 text-left">
						<tr>
							<th className="px-4 py-3 font-semibold text-gray-700">Name</th>
							<th className="px-4 py-3 font-semibold text-gray-700">Email</th>
							<th className="px-4 py-3 font-semibold text-gray-700">Phone</th>
							<th className="px-4 py-3 font-semibold text-gray-700">
								Location
							</th>
							<th className="px-4 py-3 font-semibold text-gray-700">Message</th>
							<th className="px-4 py-3 font-semibold text-gray-700">Created</th>
							<th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<tr>
								<td colSpan={7} className="px-4 py-8 text-center text-gray-500">
									Loading enquiries...
								</td>
							</tr>
						) : pageData.length === 0 ? (
							<tr>
								<td colSpan={7} className="px-4 py-8 text-center text-gray-500">
									No enquiries found.
								</td>
							</tr>
						) : (
							pageData.map((e) => (
								<tr key={e._id} className="border-t">
									<td className="px-4 py-3">
										<div className="font-medium text-gray-900">{e.name}</div>
									</td>
									<td className="px-4 py-3">
										<a
											className="text-blue-600 hover:underline break-all"
											href={`mailto:${encodeURIComponent(e.email || "")}`}
										>
											{e.email || "-"}
										</a>
									</td>
									<td className="px-4 py-3 text-gray-700">{e.phone || "-"}</td>
									<td className="px-4 py-3 text-gray-700">
										{[e.city, e.country].filter(Boolean).join(", ") || "-"}
									</td>
									<td className="px-4 py-3 text-gray-700 max-w-[320px]">
										<span className="line-clamp-2" title={e.message}>
											{e.message}
										</span>
									</td>
									<td className="px-4 py-3 text-gray-700 whitespace-nowrap">
										{e.createdAt ? new Date(e.createdAt).toLocaleString() : "-"}
									</td>
									<td className="px-4 py-3">
										<a
											className="inline-block px-3 py-1.5 text-white rounded bg-red-600 hover:bg-red-700 text-xs"
											href={`mailto:${encodeURIComponent(
												e.email || ""
											)}?subject=${encodeURIComponent(
												"Re: Your enquiry at Vastu Abhishek"
											)}&body=${encodeURIComponent(
												`Hi ${
													e.name || ""
												},\n\nThanks for reaching out.\n\nYour message: \n${
													e.message || ""
												}\n\n— Team Vastu Abhishek`
											)}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											Quick Reply
										</a>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="mt-4 flex items-center justify-between">
				<div className="text-sm text-gray-600">
					Page {currentPage} of {totalPages}
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => setPage((p) => Math.max(1, p - 1))}
						disabled={currentPage === 1}
						className="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
					>
						Previous
					</button>
					<button
						onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
						disabled={currentPage === totalPages}
						className="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
};

export default AdminEnquiries;
