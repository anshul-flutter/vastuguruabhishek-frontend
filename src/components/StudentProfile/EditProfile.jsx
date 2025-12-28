import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { selectCurrentUser, updateUser } from "../../store/slices/authSlice";
import {
	FaArrowLeft,
	FaCamera,
	FaUser,
	FaEnvelope,
	FaPhone,
	FaCalendar,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const EditProfile = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const currentUser = useAppSelector(selectCurrentUser);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		dob: {
			day: "",
			month: "",
			year: "",
		},
	});

	const [profileImage, setProfileImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});

	// Initialize form data with current user data
	useEffect(() => {
		if (currentUser) {
			setFormData({
				name: currentUser.name || "",
				email: currentUser.email || "",
				phone: currentUser.phone || "",
				dob: {
					day: currentUser.dob?.day || "",
					month: currentUser.dob?.month || "",
					year: currentUser.dob?.year || "",
				},
			});
			if (currentUser.profileImage) {
				setImagePreview(currentUser.profileImage);
			}
		} else {
			navigate("/auth/login");
		}
	}, [currentUser, navigate]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear error for this field
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handleDobChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			dob: {
				...prev.dob,
				[name]: value,
			},
		}));
		// Clear error for DOB
		if (errors.dob) {
			setErrors((prev) => ({ ...prev, dob: "" }));
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith("image/")) {
				toast.error("Please select an image file");
				return;
			}
			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				toast.error("Image size should be less than 5MB");
				return;
			}
			setProfileImage(file);
			// Create preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.name.trim()) {
			newErrors.name = "Name is required";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		if (!formData.phone.trim()) {
			newErrors.phone = "Phone number is required";
		} else if (!/^\d{10}$/.test(formData.phone.replace(/[-\s]/g, ""))) {
			newErrors.phone = "Phone number should be 10 digits";
		}

		// Validate DOB
		const { day, month, year } = formData.dob;
		if (!day || !month || !year) {
			newErrors.dob = "Complete date of birth is required";
		} else {
			const dayNum = parseInt(day);
			const monthNum = parseInt(month);
			const yearNum = parseInt(year);

			if (dayNum < 1 || dayNum > 31) {
				newErrors.dob = "Invalid day";
			} else if (monthNum < 1 || monthNum > 12) {
				newErrors.dob = "Invalid month";
			} else if (yearNum < 1900 || yearNum > new Date().getFullYear()) {
				newErrors.dob = "Invalid year";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			toast.error("Please fix the errors in the form");
			return;
		}

		try {
			setLoading(true);

			// Create FormData for multipart/form-data
			const submitData = new FormData();
			submitData.append("name", formData.name);
			submitData.append("email", formData.email);
			submitData.append("phone", formData.phone);
			submitData.append("dob[day]", formData.dob.day);
			submitData.append("dob[month]", formData.dob.month);
			submitData.append("dob[year]", formData.dob.year);

			if (profileImage) {
				submitData.append("profileImage", profileImage);
			}

			const response = await axios.put(
				`${import.meta.env.VITE_BACKEND_URL}/auth/update-profile`,
				submitData,
				{
					withCredentials: true,
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			if (response.data.success) {
				// Update Redux store with new user data
				dispatch(updateUser(response.data.data));
				toast.success("Profile updated successfully!");
				navigate("/profile");
			}
		} catch (error) {
			console.error("Error updating profile:", error);
			const errorMessage =
				error?.response?.data?.message ||
				error?.message ||
				"Failed to update profile. Please try again.";
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const displayName = currentUser?.name || "User";

	return (
		<section className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-8 px-4">
			<div className="max-w-3xl mx-auto">
				{/* Header */}
				<div className="flex items-center gap-4 mb-8">
					<button
						onClick={() => navigate("/profile")}
						className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
					>
						<FaArrowLeft className="text-gray-600" />
					</button>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
						<p className="text-sm text-gray-600">
							Update your personal information
						</p>
					</div>
				</div>

				{/* Profile Image Section */}
				<div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
					<div className="flex flex-col items-center">
						<div className="relative">
							<div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500 shadow-lg">
								{imagePreview ? (
									<img
										src={imagePreview}
										alt="Profile Preview"
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 text-white text-4xl font-bold">
										{displayName.charAt(0).toUpperCase()}
									</div>
								)}
							</div>
							<label
								htmlFor="profileImage"
								className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full cursor-pointer shadow-lg transition-colors"
							>
								<FaCamera className="text-lg" />
								<input
									type="file"
									id="profileImage"
									accept="image/*"
									onChange={handleImageChange}
									className="hidden"
								/>
							</label>
						</div>
						<p className="mt-4 text-sm text-gray-600">
							Click the camera icon to change your profile picture
						</p>
						<p className="text-xs text-gray-500">Max size: 5MB</p>
					</div>
				</div>

				{/* Form Section */}
				<form
					onSubmit={handleSubmit}
					className="bg-white rounded-2xl shadow-lg p-8"
				>
					<div className="space-y-6">
						{/* Name Field */}
						<div>
							<label
								htmlFor="name"
								className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
							>
								<FaUser className="text-orange-500" />
								Full Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								className={`w-full px-4 py-3 border ${
									errors.name ? "border-red-500" : "border-gray-300"
								} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
								placeholder="Enter your full name"
							/>
							{errors.name && (
								<p className="mt-1 text-sm text-red-500">{errors.name}</p>
							)}
						</div>

						{/* Email Field */}
						<div>
							<label
								htmlFor="email"
								className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
							>
								<FaEnvelope className="text-orange-500" />
								Email Address
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								className={`w-full px-4 py-3 border ${
									errors.email ? "border-red-500" : "border-gray-300"
								} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
								placeholder="Enter your email"
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-500">{errors.email}</p>
							)}
						</div>

						{/* Phone Field */}
						<div>
							<label
								htmlFor="phone"
								className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
							>
								<FaPhone className="text-orange-500" />
								Phone Number
							</label>
							<input
								type="tel"
								id="phone"
								name="phone"
								value={formData.phone}
								onChange={handleInputChange}
								className={`w-full px-4 py-3 border ${
									errors.phone ? "border-red-500" : "border-gray-300"
								} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
								placeholder="Enter your phone number"
							/>
							{errors.phone && (
								<p className="mt-1 text-sm text-red-500">{errors.phone}</p>
							)}
						</div>

						{/* Date of Birth Field */}
						<div>
							<label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
								<FaCalendar className="text-orange-500" />
								Date of Birth
							</label>
							<div className="grid grid-cols-3 gap-4">
								<div>
									<input
										type="number"
										name="day"
										value={formData.dob.day}
										onChange={handleDobChange}
										placeholder="Day"
										min="1"
										max="31"
										className={`w-full px-4 py-3 border ${
											errors.dob ? "border-red-500" : "border-gray-300"
										} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
									/>
								</div>
								<div>
									<input
										type="number"
										name="month"
										value={formData.dob.month}
										onChange={handleDobChange}
										placeholder="Month"
										min="1"
										max="12"
										className={`w-full px-4 py-3 border ${
											errors.dob ? "border-red-500" : "border-gray-300"
										} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
									/>
								</div>
								<div>
									<input
										type="number"
										name="year"
										value={formData.dob.year}
										onChange={handleDobChange}
										placeholder="Year"
										min="1900"
										max={new Date().getFullYear()}
										className={`w-full px-4 py-3 border ${
											errors.dob ? "border-red-500" : "border-gray-300"
										} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
									/>
								</div>
							</div>
							{errors.dob && (
								<p className="mt-1 text-sm text-red-500">{errors.dob}</p>
							)}
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-4 mt-8">
						<button
							type="button"
							onClick={() => navigate("/profile")}
							className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? (
								<span className="flex items-center justify-center gap-2">
									<svg
										className="animate-spin h-5 w-5"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Updating...
								</span>
							) : (
								"Save Changes"
							)}
						</button>
					</div>
				</form>
			</div>
		</section>
	);
};

export default EditProfile;
