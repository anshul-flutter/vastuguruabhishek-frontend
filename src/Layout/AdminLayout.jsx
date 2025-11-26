import React, { useState, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Admin/Sidebar";
import Topbar from "../components/Admin/Topbar";

// Page titles mapping for different routes
const getPageTitle = (pathname) => {
	const titleMap = {
		"/admin/dashboard": "Dashboard Overview",
		"/admin/courses": "Course Management",
		"/admin/session-management": "Session Management",
		"/admin/student-management": "Student Management",
		"/admin/events": "Event Management",
		"/admin/event-payment": "Event Payment Management",
		"/admin/student-progress": "Student Progress Tracking",
		"/admin/consultation-bookings": "Consultation Bookings",
		"/admin/consultation-status": "Assign & Notify Consultations",
		"/admin/services": "Service Management",
		"/admin/create-service": "Create New Service",
		"/admin/create-package": "Create Package/Consultation",
		"/admin/orders": "Order Management",
		"/admin/books": "Books Management",
		"/admin/blog-management": "Blog Management",
		"/admin/podcast-management": "Podcast Management",
		"/admin/banner-management": "Banner Management",
		"/admin/payments": "Payment Gateway",
		"/admin/customers": "Customer Management",
		"/admin/manage-ticket": "Ticket Management",
		"/admin/testimonials": "Testimonials & Reviews",
		"/admin/financial-management": "Financial Management",
		"/admin/profile": "Admin Profile",
		"/admin/settings": "Settings",
		"/admin/edit-about": "Edit About Us",
	};

	// Check for dynamic routes
	if (pathname.includes("/courses/") && pathname.includes("/edit")) {
		return "Edit Course";
	}
	if (pathname === "/admin/create-course") {
		return "Create New Course";
	}
	if (pathname === "/admin/create-event") {
		return "Create New Event";
	}
	if (pathname === "/admin/add-book") {
		return "Add New Book";
	}
	if (pathname.includes("/admin/services/") && pathname.includes("/edit")) {
		return "Edit Service";
	}
	if (pathname.includes("/admin/orders/")) {
		return "Order Details";
	}
	if (pathname.includes("/admin/blog-details/")) {
		return "Blog Details";
	}
	if (pathname.includes("/admin/podcast-details/")) {
		return "Podcast Details";
	}

	return titleMap[pathname] || "Admin Panel";
};

const AdminLayout = () => {
	const location = useLocation();
	const [showNotification, setShowNotification] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const notificationRef = useRef(null);

	const pageTitle = getPageTitle(location.pathname);

	return (
		<div className="flex flex-col h-screen bg-[#FCFCFC] overflow-hidden">
			{/* Top bar - Full width, fixed height */}
			<Topbar
				pageTitle={pageTitle}
				showNotification={showNotification}
				setShowNotification={setShowNotification}
				notificationRef={notificationRef}
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
			/>

			{/* Sidebar and Main Content Side by Side */}
			<div className="flex flex-1 overflow-hidden">
				<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
				<main className="flex-1 p-4 md:p-6 overflow-y-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default AdminLayout;
