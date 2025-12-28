import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
	useBooksQuery,
	useDeleteBookMutation,
	useUpdateBookMutation,
} from "../../hooks/useBooksApi";
import { BookCard } from "../common/cards";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/slices/authSlice";
import { ROLES } from "../../utils/constants";

const DEFAULT_HIGHLIGHTS = {
	whyThisBook: "",
	difference: "",
	whoCanBuy: "",
};

const ensureArray = (value, fallback = []) =>
	Array.isArray(value) ? value : fallback;

const sanitizeCommaSeparated = (value) =>
	value
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);

const normalizeBookForEditing = (book) => {
	const safe = JSON.parse(JSON.stringify(book ?? {}));

	return {
		...safe,
		id: safe._id || safe.id,
		title: safe.title ?? "",
		description: safe.description ?? "",
		price: safe.price ?? "",
		pages: safe.pages ?? "",
		coverImage: safe.coverImage ?? "",
		highlights: {
			...DEFAULT_HIGHLIGHTS,
			...(safe.highlights ?? {}),
		},
		keyFeatures: ensureArray(safe.keyFeatures, [{ feature: "" }]).map(
			(feature) => ({
				_id: feature?._id,
				feature: feature?.feature ?? "",
			})
		),
		targetAudience: ensureArray(safe.targetAudience),
		languageOptions: ensureArray(safe.languageOptions, [
			{
				language: "",
				stock: 0,
				buyLink: "",
				available: true,
				purchaseMode: "internal",
			},
		]).map((option) => ({
			_id: option?._id,
			language: option?.language ?? "",
			stock: option?.stock ?? 0,
			buyLink: option?.buyLink ?? "",
			available:
				typeof option?.available === "boolean"
					? option.available
					: option?.available === "false"
					? false
					: true,
			purchaseMode: option?.buyLink ? "external" : "internal",
		})),
	};
};

const BooksList = () => {
	const navigate = useNavigate();
	const { data: books = [], isLoading, isError } = useBooksQuery();
	const currentUser = useAppSelector(selectCurrentUser);
	const isAdmin =
		currentUser?.role === ROLES.ASTROLOGER || currentUser?.role === ROLES.ADMIN;

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedBook, setSelectedBook] = useState(null);
	const [coverFile, setCoverFile] = useState(null);
	const [deletingBookId, setDeletingBookId] = useState(null);

	const updateBookMutation = useUpdateBookMutation({
		onSuccess: () => {
			setIsModalOpen(false);
			setSelectedBook(null);
			setCoverFile(null);
		},
	});

	const deleteBookMutation = useDeleteBookMutation({
		onMutate: (bookId) => setDeletingBookId(bookId),
		onSettled: () => setDeletingBookId(null),
	});

	const handleEdit = (book) => {
		setCoverFile(null);
		setSelectedBook(normalizeBookForEditing(book));
		setIsModalOpen(true);
	};

	const handleDelete = (bookId) => {
		if (!bookId) return;
		if (!window.confirm("Are you sure you want to delete this book?")) return;
		deleteBookMutation.mutate(bookId);
	};

	const handleFieldChange = (event) => {
		const { name, value, type } = event.target;
		const parsedValue = type === "number" ? Number(value) : value;
		setSelectedBook((prev) => ({
			...prev,
			[name]: parsedValue,
		}));
	};

	const handleHighlightChange = (field, value) => {
		setSelectedBook((prev) => ({
			...prev,
			highlights: {
				...prev?.highlights,
				[field]: value,
			},
		}));
	};

	const handleKeyFeatureChange = (index, value) => {
		setSelectedBook((prev) => {
			const updated = [...(prev?.keyFeatures ?? [])];
			updated[index] = {
				...updated[index],
				feature: value,
			};
			return {
				...prev,
				keyFeatures: updated,
			};
		});
	};

	const handleAddKeyFeature = () => {
		setSelectedBook((prev) => ({
			...prev,
			keyFeatures: [...(prev?.keyFeatures ?? []), { feature: "" }],
		}));
	};

	const handleRemoveKeyFeature = (index) => {
		setSelectedBook((prev) => {
			const updated = [...(prev?.keyFeatures ?? [])];
			updated.splice(index, 1);
			return {
				...prev,
				keyFeatures: updated.length ? updated : [{ feature: "" }],
			};
		});
	};

	const handleLanguageOptionChange = (index, field, value) => {
		setSelectedBook((prev) => {
			const updated = [...(prev?.languageOptions ?? [])];
			if (!updated[index]) {
				updated[index] = {
					language: "",
					stock: 0,
					buyLink: "",
					available: true,
					purchaseMode: "internal",
				};
			}

			updated[index] = {
				...updated[index],
				[field]: field === "stock" ? Number(value) || 0 : value,
			};

			return {
				...prev,
				languageOptions: updated,
			};
		});
	};

	const handleLanguagePurchaseModeChange = (index, mode) => {
		setSelectedBook((prev) => {
			const updated = [...(prev?.languageOptions ?? [])];
			if (!updated[index]) return prev;

			updated[index] = {
				...updated[index],
				purchaseMode: mode,
				stock: mode === "external" ? 0 : updated[index].stock,
				buyLink: mode === "internal" ? "" : updated[index].buyLink,
			};

			return {
				...prev,
				languageOptions: updated,
			};
		});
	};

	const handleLanguageAvailabilityToggle = (index, checked) => {
		setSelectedBook((prev) => {
			const updated = [...(prev?.languageOptions ?? [])];
			if (!updated[index]) return prev;
			updated[index] = {
				...updated[index],
				available: checked,
			};
			return {
				...prev,
				languageOptions: updated,
			};
		});
	};

	const handleAddLanguageOption = () => {
		setSelectedBook((prev) => ({
			...prev,
			languageOptions: [
				...(prev?.languageOptions ?? []),
				{
					language: "",
					stock: 0,
					buyLink: "",
					available: true,
					purchaseMode: "internal",
				},
			],
		}));
	};

	const handleRemoveLanguageOption = (index) => {
		setSelectedBook((prev) => {
			const updated = [...(prev?.languageOptions ?? [])];
			updated.splice(index, 1);
			return {
				...prev,
				languageOptions:
					updated.length > 0
						? updated
						: [
								{
									language: "",
									stock: 0,
									buyLink: "",
									available: true,
									purchaseMode: "internal",
								},
						  ],
			};
		});
	};

	const handleTargetAudienceChange = (value) => {
		setSelectedBook((prev) => ({
			...prev,
			targetAudience: sanitizeCommaSeparated(value),
		}));
	};

	const handleCoverFileChange = (event) => {
		const file = event.target.files?.[0];
		setCoverFile(file ?? null);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		setSelectedBook(null);
		setCoverFile(null);
	};

	const handleSave = () => {
		if (!selectedBook) return;

		const bookId = selectedBook._id || selectedBook.id;
		if (!bookId) return;

		const payload = {
			title: selectedBook.title?.trim() ?? "",
			description: selectedBook.description?.trim() ?? "",
			price:
				selectedBook.price === "" || selectedBook.price === null
					? 0
					: Number(selectedBook.price) || 0,
			pages:
				selectedBook.pages === "" || selectedBook.pages === null
					? undefined
					: Number(selectedBook.pages) || undefined,
			highlights: {
				whyThisBook: selectedBook.highlights?.whyThisBook?.trim() ?? "",
				difference: selectedBook.highlights?.difference?.trim() ?? "",
				whoCanBuy: selectedBook.highlights?.whoCanBuy?.trim() ?? "",
			},
			keyFeatures: (selectedBook.keyFeatures ?? [])
				.map((feature) => {
					const sanitized = {
						feature: feature?.feature?.trim() ?? "",
					};
					if (feature?._id) {
						sanitized._id = feature._id;
					}
					return sanitized;
				})
				.filter((feature) => feature.feature.length > 0),
			targetAudience: ensureArray(selectedBook.targetAudience)
				.map((audience) => `${audience}`.trim())
				.filter(Boolean),
			languageOptions: ensureArray(selectedBook.languageOptions)
				.map((option) => {
					const sanitized = {
						language: option?.language?.trim() ?? "",
						stock:
							option?.stock === "" || option?.stock === null
								? 0
								: Number(option?.stock) || 0,
						buyLink: option?.buyLink?.trim() ?? "",
						available:
							typeof option?.available === "boolean"
								? option.available
								: option?.available === "true"
								? true
								: option?.available === "false"
								? false
								: true,
					};
					if (option?._id) {
						sanitized._id = option._id;
					}
					return sanitized;
				})
				.filter((option) => option.language.length > 0),
			coverImage: selectedBook.coverImage ?? "",
		};

		const formData = new FormData();
		formData.append("payload", JSON.stringify(payload));
		if (coverFile) {
			formData.append("file", coverFile);
		}

		updateBookMutation.mutate({
			bookId,
			payload: formData,
		});
	};

	const targetAudienceInputValue = useMemo(() => {
		if (!selectedBook?.targetAudience?.length) return "";
		return selectedBook.targetAudience.join(", ");
	}, [selectedBook?.targetAudience]);

	if (isLoading) {
		return <p className="text-center mt-8 text-gray-600">Loading books...</p>;
	}

	if (isError) {
		return (
			<p className="text-center mt-8 text-red-600">
				Failed to load books. Please try again later.
			</p>
		);
	}

	return (
		<div className="max-w-6xl mx-auto p-4">
			<div className="flex items-center justify-end mb-8">
				<button
					onClick={() => navigate("/admin/add-book")}
					className="flex h-10 items-center gap-2 px-4 py-1 rounded-md text-white bg-gradient-to-b from-[#bf1305] to-[#f64f42]"
				>
					<FiPlus size={22} />
					Add New Book
				</button>
			</div>

			{books.length === 0 ? (
				<div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
					No books found. Click “Add New Book” to create one.
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{books.map((book) => {
						const id = book._id || book.id;
						const isDeleting =
							deleteBookMutation.isPending && deletingBookId === id;

						return (
							<BookCard
								key={id}
								book={book}
								isAdmin={isAdmin}
								onEdit={handleEdit}
								onDelete={handleDelete}
								isDeleting={isDeleting}
							/>
						);
					})}
				</div>
			)}

			{isModalOpen && selectedBook && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
					<div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-start gap-4 mb-4">
							<div>
								<h2 className="text-lg font-semibold">Edit Book</h2>
								<p className="text-sm text-gray-500">
									ID: {selectedBook._id || selectedBook.id}
								</p>
							</div>
							<button
								onClick={handleModalClose}
								className="text-gray-500 hover:text-gray-700"
								type="button"
							>
								✕
							</button>
						</div>

						<div className="space-y-6">
							<section className="space-y-3">
								<h3 className="font-medium text-blue-600">Basic Information</h3>
								<input
									type="text"
									name="title"
									value={selectedBook.title}
									onChange={handleFieldChange}
									className="w-full border rounded p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Book Title"
								/>
								<textarea
									name="description"
									value={selectedBook.description}
									onChange={handleFieldChange}
									className="w-full border rounded p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Book Description"
									rows={4}
								/>
								<input
									type="number"
									name="price"
									value={selectedBook.price}
									onChange={handleFieldChange}
									className="w-full border rounded p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Price"
									min={0}
									step={0.01}
								/>
								<input
									type="number"
									name="pages"
									value={selectedBook.pages}
									onChange={handleFieldChange}
									className="w-full border rounded p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Number of Pages"
									min={1}
									step={1}
								/>

								<div className="space-y-2">
									<p className="text-sm font-medium text-gray-700">
										Cover Image
									</p>
									{selectedBook.coverImage && (
										<img
											src={selectedBook.coverImage}
											alt={selectedBook.title}
											className="w-full h-40 object-cover rounded border"
										/>
									)}
									<input
										type="file"
										accept="image/*"
										onChange={handleCoverFileChange}
										className="block w-full text-sm text-gray-600"
									/>
									{coverFile && (
										<p className="text-xs text-gray-500">
											Selected file: {coverFile.name}
										</p>
									)}
								</div>
							</section>

							<section className="space-y-3">
								<h3 className="font-medium text-blue-600">Highlights</h3>
								<input
									type="text"
									value={selectedBook.highlights?.whyThisBook || ""}
									onChange={(event) =>
										handleHighlightChange("whyThisBook", event.target.value)
									}
									className="w-full border rounded p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Why This Book"
								/>
								<input
									type="text"
									value={selectedBook.highlights?.difference || ""}
									onChange={(event) =>
										handleHighlightChange("difference", event.target.value)
									}
									className="w-full border rounded p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Difference"
								/>
								<input
									type="text"
									value={selectedBook.highlights?.whoCanBuy || ""}
									onChange={(event) =>
										handleHighlightChange("whoCanBuy", event.target.value)
									}
									className="w-full border rounded p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Who Can Buy"
								/>
							</section>

							<section className="space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="font-medium text-blue-600">Key Features</h3>
									<button
										onClick={handleAddKeyFeature}
										className="text-sm text-blue-600 hover:underline"
										type="button"
									>
										+ Add Feature
									</button>
								</div>
								{selectedBook.keyFeatures?.length ? (
									selectedBook.keyFeatures.map((feature, index) => (
										<div key={feature._id || index} className="flex gap-2">
											<input
												type="text"
												value={feature.feature}
												onChange={(event) =>
													handleKeyFeatureChange(index, event.target.value)
												}
												className="w-full border rounded p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												placeholder={`Feature ${index + 1}`}
											/>
											<button
												onClick={() => handleRemoveKeyFeature(index)}
												className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
												type="button"
											>
												Remove
											</button>
										</div>
									))
								) : (
									<p className="text-gray-500 text-sm">
										No key features added.
									</p>
								)}
							</section>

							<section className="space-y-3">
								<h3 className="font-medium text-blue-600">Target Audience</h3>
								<textarea
									value={targetAudienceInputValue}
									onChange={(event) =>
										handleTargetAudienceChange(event.target.value)
									}
									className="w-full border rounded p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Enter comma separated audience tags"
									rows={2}
								/>
								<p className="text-xs text-gray-500">
									Example: Beginners, Professionals, Students
								</p>
							</section>

							<section className="space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="font-medium text-blue-600">
										Language Options
									</h3>
									<button
										onClick={handleAddLanguageOption}
										className="text-sm text-blue-600 hover:underline"
										type="button"
									>
										+ Add Language
									</button>
								</div>
								{selectedBook.languageOptions?.length ? (
									selectedBook.languageOptions.map((option, index) => (
										<div
											key={option._id || index}
											className="rounded border border-gray-200 p-3 space-y-2"
										>
											<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
												<input
													type="text"
													value={option.language}
													onChange={(event) =>
														handleLanguageOptionChange(
															index,
															"language",
															event.target.value
														)
													}
													className="border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
													placeholder="Language"
												/>
											</div>

											<div className="flex items-center gap-4 my-2">
												<label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
													<input
														type="radio"
														name={`purchaseMode-${index}`}
														checked={option.purchaseMode === "internal"}
														onChange={() =>
															handleLanguagePurchaseModeChange(
																index,
																"internal"
															)
														}
														className="text-blue-600 focus:ring-blue-500"
													/>
													Sell on Website
												</label>
												<label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
													<input
														type="radio"
														name={`purchaseMode-${index}`}
														checked={option.purchaseMode === "external"}
														onChange={() =>
															handleLanguagePurchaseModeChange(
																index,
																"external"
															)
														}
														className="text-blue-600 focus:ring-blue-500"
													/>
													External Link
												</label>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
												{option.purchaseMode === "internal" ? (
													<input
														type="number"
														value={option.stock}
														min={0}
														onChange={(event) =>
															handleLanguageOptionChange(
																index,
																"stock",
																event.target.value
															)
														}
														className="border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
														placeholder="Stock"
													/>
												) : (
													<input
														type="text"
														value={option.buyLink}
														onChange={(event) =>
															handleLanguageOptionChange(
																index,
																"buyLink",
																event.target.value
															)
														}
														className="border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
														placeholder="Buy Link (e.g., Amazon URL)"
													/>
												)}
											</div>

											<div className="flex items-center justify-between">
												<label className="flex items-center gap-2 text-sm text-gray-600">
													<input
														type="checkbox"
														checked={Boolean(option.available)}
														onChange={(event) =>
															handleLanguageAvailabilityToggle(
																index,
																event.target.checked
															)
														}
													/>
													Available for purchase
												</label>
												<button
													onClick={() => handleRemoveLanguageOption(index)}
													className="text-xs text-red-600 hover:underline"
													type="button"
												>
													Remove Language
												</button>
											</div>
										</div>
									))
								) : (
									<p className="text-gray-500 text-sm">
										No language options configured.
									</p>
								)}
							</section>
						</div>

						<div className="flex justify-end gap-3 mt-6 pt-4 border-t">
							<button
								onClick={handleModalClose}
								className="px-6 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 transition-colors"
								type="button"
							>
								Cancel
							</button>
							<button
								onClick={handleSave}
								disabled={updateBookMutation.isPending}
								className="px-6 py-2 text-sm text-white rounded bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-60"
								type="button"
							>
								{updateBookMutation.isPending ? "Saving..." : "Save Changes"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default BooksList;
