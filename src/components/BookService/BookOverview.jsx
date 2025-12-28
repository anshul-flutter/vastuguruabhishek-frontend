import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ebookImg from "../../assets/ebook.png";
import { useBooksQuery } from "../../hooks/useContentApi";
import { useAddToCartMutation, useCartQuery } from "../../hooks/useCartApi";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/slices/authSlice";
import { BookCard } from "../common/cards";

export default function BookOverview() {
	const navigate = useNavigate();
	const currentUser = useAppSelector(selectCurrentUser);
	const isAdmin =
		currentUser?.role === "astrologer" || currentUser?.role === "admin";

	const [addingToCartId, setAddingToCartId] = useState(null);

	const {
		data: books = [],
		isLoading,
		isError,
		error,
		refetch,
	} = useBooksQuery();

	const { mutate: addToCart } = useAddToCartMutation();
	const { data: cartData } = useCartQuery(undefined, {
		skip: !currentUser || isAdmin,
	});

	const bannerImage = ebookImg;

	// Check if a book is in cart
	const isBookInCart = (bookId) => {
		if (!cartData?.items) return false;
		return cartData.items.some(
			(item) =>
				(item.itemId === bookId || item.productId === bookId) &&
				item.itemType === "Book"
		);
	};

	const handleAddToCart = (book, selectedLanguage) => {
		// Check if user is logged in
		if (!currentUser) {
			toast("Please log in to continue", { icon: "🔐" });
			navigate("/auth/login", {
				state: { from: { pathname: window.location.pathname } },
			});
			return;
		}

		// Check if already in cart
		if (isBookInCart(book._id || book.id)) {
			navigate("/cart");
			return;
		}

		// Set loading state for this specific book
		setAddingToCartId(book._id || book.id);

		const payload = {
			itemId: book._id || book.id,
			itemType: "Book",
			quantity: 1,
			additionalInfo: selectedLanguage
				? { language: selectedLanguage }
				: undefined,
		};

		addToCart(payload, {
			onSuccess: () => {
				setAddingToCartId(null);
			},
			onError: (error) => {
				setAddingToCartId(null);
				const errorMessage =
					error?.response?.data?.message ||
					error?.message ||
					"Failed to add to cart. Please try again.";
				toast.error(errorMessage);
			},
		});
	};

	const handleViewDetails = (book) => {
		navigate(`/books/${book._id ?? book.id}`);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
			<main className="mx-auto max-w-6xl space-y-12 px-4 py-16 md:px-8">
				<section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-100 via-orange-50 to-orange-100 p-10 shadow-xl">
					<div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
						<div className="space-y-6 text-center lg:text-left">
							<p className="inline-flex rounded-full bg-orange-500/10 px-4 py-1 text-sm font-medium uppercase tracking-wider text-orange-600">
								Featured collection
							</p>
							<h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
								Unlock ancient wisdom with curated astrology e-books
							</h1>
							<p className="text-gray-600">
								Explore our digital library covering Vedic astrology,
								numerology, Vastu, and spiritual guidance crafted by renowned
								astrologers.
							</p>
							<div className="flex flex-wrap justify-center gap-4 lg:justify-start">
								<button
									onClick={() => navigate("/courses")}
									className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
								>
									Browse Courses
								</button>
								<button
									onClick={() => navigate("/contact")}
									className="rounded-full border border-orange-500/40 px-6 py-3 text-sm font-semibold text-orange-600 transition hover:border-orange-500 hover:bg-orange-50"
								>
									Talk to an expert
								</button>
							</div>
						</div>
						<img
							src={bannerImage}
							alt="Astrology ebooks"
							className="mx-auto w-full max-w-md rounded-3xl object-cover shadow-2xl"
							loading="lazy"
						/>
					</div>
				</section>

				<section className="space-y-8">
					<header className="space-y-4 text-center lg:text-left">
						<h2 className="text-3xl font-semibold text-gray-900 lg:text-4xl">
							Discover titles tailored for your spiritual journey
						</h2>
						<p className="text-gray-600">
							Each book blends timeless knowledge with practical insights to
							help you interpret charts, align energies, and elevate daily life.
						</p>
					</header>

					{isLoading && (
						<p className="text-center text-sm text-orange-600">
							Loading books…
						</p>
					)}

					{isError && (
						<div className="flex flex-col items-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
							<p>We couldn&apos;t load the library just now.</p>
							<button
								onClick={() => refetch()}
								className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
							>
								Try again
							</button>
							{error?.message && (
								<p className="text-xs text-red-500">{error.message}</p>
							)}
						</div>
					)}

					{!isLoading && !isError && books.length === 0 && (
						<p className="text-center text-sm text-gray-500">
							Our bookstore is being refreshed. Please check back soon.
						</p>
					)}

					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{!isError &&
							books.map((book) => (
								<BookCard
									key={book._id || book.id}
									book={book}
									onViewDetails={handleViewDetails}
									onAddToCart={handleAddToCart}
									isAddingToCart={addingToCartId === (book._id || book.id)}
									isInCart={isBookInCart(book._id || book.id)}
									isAdmin={isAdmin}
								/>
							))}
					</div>
				</section>
			</main>
		</div>
	);
}
