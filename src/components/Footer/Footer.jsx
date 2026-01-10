import React from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const services = [
  { label: "Vasti For Home", path: "/vastu-for-home" },
  {
    label: "Vastu For Factory/Commercial",
    path: "/vastu-for-factory-commercial-units",
  },
  // { label: "Online Consultation", path: "/services/online" },
  { label: "Vastu for Office", path: "/vastu-for-office" },
];

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Courses", path: "/courses" },
  { label: "Help", path: "/support" },
];

const externalLinks = [
  {
    label: "Terms & Conditions",
    path: "https://www.vastuguru.vastuabhishek.com/term-condition",
  },
  {
    label: "Privacy Policy",
    path: "https://www.vastuguru.vastuabhishek.com/privacy-policy",
  },
  { label: "FAQ", path: "https://www.vastuguru.vastuabhishek.com/faqs" },
];

const contactInfo = [
  {
    icon: <FaPhone className="mr-2" />,
    text: "+91 9599967655",
    href: "tel:+919599967655",
  },
  {
    icon: <FaEnvelope className="mr-2" />,
    text: "Contact@vastuabhishek.com",
    href: "mailto:Contact@vastuabhishek.com",
  },
  {
    icon: <FaMapMarkerAlt className="mr-2" size={24} />,
    text: "142, 2nd Floor Pocket - 17, Sector-24 Rohini, New Delhi 110085",
    href: "https://www.google.com/maps?q=Mumbai,India",
  },
];

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="text-white pt-8 sm:pt-12 md:pt-16 mt-8 sm:mt-12 md:mt-16 bg-gradient-to-br from-[#bb1200] to-[#c84706]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Description */}
          <div>
            <div className="text-2xl font-bold mb-3 sm:mb-4">
              <img
                src="/images/logo.jpg"
                alt="Logo"
                className="h-[40px] sm:h-[50px]"
              />
            </div>
            <p className="text-white/90 mb-3 sm:mb-4 text-sm sm:text-base">
              Transforming lives through ancient Vastu wisdom and modern
              insights.
            </p>
            {/* App Store and Google Play Links */}
            <div className="mt-6 text-center">
              <div className="flex justify-center items-center gap-4">
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/images/google-play-badge.png"
                    alt="Get it on Google Play"
                    className="h-24"
                  />
                </a>
                <a
                  href="https://www.apple.com/app-store/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/images/app-store-badge.png"
                    alt="Download on the App Store"
                    className="h-20"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Quick Links
            </h3>
            <ul>
              {quickLinks.map((link, index) => (
                <li key={index} className="mb-1 text-xs sm:text-sm">
                  <button
                    className="text-white/90 hover:text-white cursor-pointer hover:underline"
                    onClick={() => navigate(link.path)}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              {externalLinks.map((link, index) => (
                <li key={index} className="mb-1 text-xs sm:text-sm">
                  <a
                    href={link.path}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/90 hover:text-white hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Services
            </h3>
            <ul>
              {services.map((service, index) => (
                <li key={index} className="mb-1 text-xs sm:text-sm">
                  <button
                    className="text-white/90 hover:text-white hover:underline"
                    onClick={() => navigate(service.path)}
                  >
                    {service.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-white/90">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Contact Info
            </h3>
            <p className="pb-2 sm:pb-[10px] font-semibold text-sm">
              Vastu Abhishek
            </p>
            <ul className="space-y-1">
              {contactInfo.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center text-white/90 text-xs sm:text-sm"
                >
                  <a
                    href={item.href}
                    // target={item.href.startsWith("http") ? "_blank" : "_self"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start hover:underline"
                  >
                    <span className="mt-1 mr-2">{item.icon}</span>
                    <span>{item.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="py-4 sm:py-6 mt-6 sm:mt-10 text-center">
          <p className="text-white/70 font-semibold text-xs sm:text-sm px-2">
            © 2025 Vastu Abhishek. All rights reserved. {" | "}
            Developed By{" "}
            <a
              href="https://alpixn.com/"
              target="_blank"
              className="underline"
              rel="noreferrer"
            >
              Alpixn
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
