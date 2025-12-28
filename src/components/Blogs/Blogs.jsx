import React, { useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useBlogsQuery } from "../../hooks/useContentApi";
import { LoadingSpinner, ErrorMessage, Button } from "../common";
import { BlogCard } from "../common/cards";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/slices/authSlice";
import { ROLES } from "../../utils/constants";

const Blogs = () => {
	const [visibleCards, setVisibleCards] = useState(6);
	const currentUser = useAppSelector(selectCurrentUser);
	const isAdmin =
		currentUser?.role === ROLES.ASTROLOGER || currentUser?.role === ROLES.ADMIN;

	const {
		data: blogs = [],
		isLoading,
		isError,
		error,
		refetch,
	} = useBlogsQuery();

	// Ensure visibleCards shows something when blogs are available
	const effectiveVisibleCards =
		blogs.length > 0 ? Math.max(visibleCards, Math.min(6, blogs.length)) : 0;

	const errorMessage =
		error?.response?.data?.message ??
		error?.message ??
		"Failed to fetch blogs. Please try again.";

	if (isLoading) {
		return <LoadingSpinner message="Loading blogs..." />;
	}

	if (isError) {
		return <ErrorMessage message={errorMessage} onRetry={refetch} />;
	}

	// Show message when no blogs are available
	if (!isLoading && blogs.length === 0) {
		return (
			<div className="px-[1.5rem]">
				<h1 className="my-[2rem] text-[1.5rem] font-semibold">Latest Blogs</h1>
				<div className="text-center py-8">
					<p className="text-gray-500 text-lg">
						No blogs available at the moment.
					</p>
					<p className="text-gray-400 text-sm mt-2">
						Check back later for new content!
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="px-[1.5rem]">
			<h1 className="my-[2rem] text-[1.5rem] font-semibold">Latest Blogs</h1>

			<div className="grid gap-6 max-[600px]:grid-cols-1 max-[850px]:grid-cols-2 min-[850px]:grid-cols-3">
				{blogs.slice(0, effectiveVisibleCards).map((blog) => (
					<BlogCard key={blog._id} blog={blog} isAdmin={isAdmin} />
				))}
			</div>

			{/* View All / View Less */}
			{blogs.length > effectiveVisibleCards ? (
				<div className="flex items-center justify-center my-[2rem]">
					<Button
						onClick={() => setVisibleCards(blogs.length)}
						icon={<IoIosArrowRoundForward size={24} />}
					>
						View All
					</Button>
				</div>
			) : blogs.length > 6 ? (
				<div className="flex items-center justify-center my-[2rem]">
					<Button onClick={() => setVisibleCards(6)}>View Less</Button>
				</div>
			) : null}
		</div>
	);
};

export default Blogs;
