import React from "react";
import { FaStarOfDavid, FaCaretRight } from "react-icons/fa";
import { PiStarOfDavidLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { selectIsAuthenticated } from "../../store/slices/authSlice";
import toast from "react-hot-toast";

export default function VastuService({
	sectionTitle,
	headingLines,
	description,
	packages,
}) {
	const navigate = useNavigate();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);

	const handleBuyClick = (detailsLink) => {
		if (!isAuthenticated) {
			const fallbackPath =
				typeof window !== "undefined" ? window.location.pathname : "/";
			toast("Please log in to continue", { icon: "🔐" });
			navigate("/auth/login", {
				replace: false,
				state: { from: { pathname: detailsLink || fallbackPath } },
			});
			return;
		}

		if (detailsLink && detailsLink.startsWith("http")) {
			window.open(detailsLink, "_blank", "noopener");
		} else if (detailsLink) {
			navigate(detailsLink);
		}
	};

	return (
		<section className="min-h-screen flex flex-col items-center py-10 px-4">
			{/* Section Title */}
			<h2 className="text-center text-[#BB0E00] text-[20px] border-b-2 capitalize mb-2">
				{sectionTitle}
			</h2>

			{/* Heading */}
			<div className="text-center leading-tight mb-6">
				{headingLines.map((line, i) => (
					<React.Fragment key={i}>
						{line.map((part, j) => (
							<span
								key={j}
								className={`text-[1.5rem] ${
									part.bold
										? "text-black font-semibold"
										: "text-black/50 font-medium"
								} capitalize`}
							>
								{part.text}{" "}
							</span>
						))}
						<br />
					</React.Fragment>
				))}
			</div>

			{/* Description */}
			<p className="max-w-5xl text-center mx-auto text-black text-[17px] font-normal leading-[22px] px-4 mb-6">
				{description}
			</p>

			{/* Packages */}
			<div className="flex flex-wrap justify-center h-fit gap-6">
				{packages.map((pkg, index) => (
					<div
						key={index}
						className="relative w-[340px] h-full bg-[radial-gradient(circle,_#ffe6e3,_#ffd5bd)] shadow-md overflow-hidden rounded-[15px] p-3"
					>
						{/* Icon + Title */}
						<div className="flex items-center gap-3 mb-3">
							<div className="w-[66px] h-[66px] bg-gradient-to-b from-[#BB0E00] to-[#B94400] shadow-inner rounded-full border border-[#AC0000] flex justify-center items-center">
								<PiStarOfDavidLight className="text-white" size={"2.5rem"} />
							</div>
							<div className="flex flex-col gap-1 w-[234px]">
								<h3 className="text-black text-[20px] font-semibold leading-[26px]">
									{pkg.title}
								</h3>
								<p className="text-black text-[16px] font-normal leading-[20.8px]">
									{pkg.subtitle}
								</p>
							</div>
						</div>

						{/* Features */}
						<div className="flex flex-col gap-[15px] mb-2">
							{pkg.features.map((feature, i) => (
								<div key={i} className="flex items-start gap-2">
									<FaCaretRight className="text-[#BB0E00] mt-[2px]" />
									<span className="text-black text-[15px] leading-[19.5px]">
										{feature}
									</span>
								</div>
							))}
						</div>

						{/* More Details */}
						<div className="text-black/90 text-[13px] underline leading-[16.9px] cursor-pointer mb-2">
							More details
						</div>
						<div className="border-t border-black/20 mb-2"></div>

						{/* Price + Button */}
						<div className="flex gap-[1rem] justify-between items-center">
							<div className="flex flex-col gap-1 flex-1/2">
								{/* <span className="text-black/60 text-[15px] line-through leading-[19.5px]">
                  {pkg.oldPrice}
                </span> */}
								<span className="text-black text-[16px] font-semibold leading-normal">
									{pkg.price}
								</span>
							</div>
							<button
								className="flex-1/2 px-4 py-[12px] bg-gradient-to-b from-[#BB0E00] to-[#B94400] shadow-inner rounded-[5px] border border-[#BB0E00] text-white text-[14px] font-semibold leading-[18.2px]"
								onClick={() => handleBuyClick(pkg.detailsLink)}
							>
								Buy Package
							</button>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
