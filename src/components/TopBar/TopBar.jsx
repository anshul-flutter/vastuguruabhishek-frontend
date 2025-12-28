import React from "react";

import {
	FaFacebookF,
	FaTwitter,
	FaInstagram,
	FaLinkedinIn,
} from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { GrYoutube } from "react-icons/gr";

const socialLinks = [
	{ icon: FaFacebookF, url: "https://facebook.com/vastuexpertabhishek" },
	{ icon: FaTwitter, url: "https://twitter.com" },
	{ icon: FaInstagram, url: "https://instagram.com" },
	{ icon: GrYoutube, url: "https://www.youtube.com/@vastuabhishek" },
];

export default function TopBar() {
	const { pathname } = useLocation();
	if (pathname !== "/") return null;

	return (
		<div className="bg-gray-900 w-full top-0 text-white text-xs py-2 px-3 sm:px-4 md:px-6">
			<div className="max-w-7xl mx-auto flex flex-col  sm:flex-row justify-between items-center gap-2 sm:gap-4">
				{/* Left: Contact Info */}
				<div className="flex flex-wrap justify-center items-center gap-2 xs:gap-3 sm:gap-4 w-full sm:w-auto min-h-auto">
					<div className="flex items-center gap-1.5">
						<FaPhoneAlt className="text-white text-[10px] flex-shrink-0" />
						<a
							href="tel:+919599967655"
							className="whitespace-nowrap hover:text-orange-500 transition-colors"
						>
							+91 9599967655
						</a>
					</div>
					<div className="flex items-center gap-1.5">
						<MdEmail className="text-white text-sm flex-shrink-0" />
						<a
							href="mailto:Contact@vastuabhishek.com"
							className="hover:text-orange-500 transition-colors truncate max-w-[200px] sm:max-w-none"
						>
							Contact@vastuabhishek.com
						</a>
					</div>
				</div>

				{/* Right: Social Links */}
				<div className="flex items-center gap-3 sm:gap-4">
					{socialLinks.map(({ icon: Icon, url }, index) => (
						<a
							key={index}
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-orange-500 transition-colors"
							aria-label={`Visit our ${Icon.name} page`}
						>
							<Icon size={16} className="w-4 h-4" />
						</a>
					))}
				</div>
			</div>
		</div>
	);
}
