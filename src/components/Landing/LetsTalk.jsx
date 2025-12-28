import { useFormik } from "formik";
import React from "react";
import { useContactMutation } from "../../hooks/useContactApi";

const LetsTalk = () => {
	const contactMutation = useContactMutation();

	const formik = useFormik({
		initialValues: {
			name: "",
			email: "",
			phone: "",
			country: "",
			city: "",
			message: "",
		},
		validate: (values) => {
			const errors = {};
			if (!values.name) {
				errors.name = "Name is required";
			}
			if (!values.email) {
				errors.email = "Email is required";
			} else if (
				!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
			) {
				errors.email = "Invalid email. eg: vastu@gmail.com";
			}
			if (!values.phone) {
				errors.phone = "Phone number is required";
			} else if (!/^[0-9]{10}$/.test(values.phone)) {
				errors.phone = "Phone must be 10 digits";
			}
			if (!values.country) {
				errors.country = "Country is required";
			}
			if (!values.city) {
				errors.city = "City is required";
			}
			return errors;
		},

		onSubmit: (values, { resetForm }) => {
			// Prevent submission if already submitting
			if (contactMutation.isPending) {
				return;
			}

			contactMutation.mutate(values, {
				onSuccess: () => {
					resetForm();
				},
			});
		},
	});

	return (
		<section className="py-6 sm:py-8 px-3 sm:px-4 mx-auto max-w-[600px] bg-[#fbfbfb] flex flex-col items-center">
			{/* LetsTalk Card */}
			<div className="max-w-3xl w-full bg-gradient-to-br from-[#ff7a6c] via-[#ffa875] to-[#ff7a6c] rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10">
				<h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
					Let&apos;s Talk
				</h2>
				<form
					onSubmit={formik.handleSubmit}
					className="flex flex-col gap-3 sm:gap-4 border border-white rounded-xl bg-[#ffb69c] backdrop-blur-[2px] p-3 sm:p-4"
				>
					{/* Name */}
					<input
						type="text"
						name="name"
						placeholder="Name*"
						value={formik.values.name}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						disabled={contactMutation.isPending}
						className={`w-full bg-[#fed2b4] px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border border-gray-100 focus:ring-2 focus:ring-pink-300 focus:outline-none text-sm sm:text-base ${
							contactMutation.isPending ? "opacity-60 cursor-not-allowed" : ""
						}`}
					/>
					{formik.touched.name && formik.errors.name && (
						<p className="text-xs sm:text-sm text-red-600 -mt-2">
							{formik.errors.name}
						</p>
					)}

					{/* Email */}
					<input
						type="email"
						name="email"
						placeholder="Email*"
						value={formik.values.email}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						disabled={contactMutation.isPending}
						className={`w-full bg-[#fed2b4] px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border border-gray-100 focus:ring-2 focus:ring-pink-300 focus:outline-none text-sm sm:text-base ${
							contactMutation.isPending ? "opacity-60 cursor-not-allowed" : ""
						}`}
					/>
					{formik.touched.email && formik.errors.email && (
						<p className="text-xs sm:text-sm text-red-600 -mt-2">
							{formik.errors.email}
						</p>
					)}

					{/* Phone */}
					<input
						type="tel"
						name="phone"
						placeholder="Phone Number*"
						value={formik.values.phone}
						onChange={(e) => {
							// Allow only numbers
							const onlyNums = e.target.value.replace(/\D/g, "");
							// Limit to 15 digits
							if (onlyNums.length <= 15) {
								formik.setFieldValue("phone", onlyNums);
							}
						}}
						onBlur={formik.handleBlur}
						disabled={contactMutation.isPending}
						className={`w-full bg-[#fed2b4] px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border border-gray-100 focus:ring-2 focus:ring-pink-300 focus:outline-none text-sm sm:text-base ${
							contactMutation.isPending ? "opacity-60 cursor-not-allowed" : ""
						}`}
						inputMode="numeric"
						pattern="[0-9]*"
					/>

					{formik.touched.phone && formik.errors.phone && (
						<p className="text-xs sm:text-sm text-red-600 -mt-2">
							{formik.errors.phone}
						</p>
					)}
					{/* Country */}
					<input
						type="text"
						name="country"
						placeholder="Country"
						value={formik.values.country}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						disabled={contactMutation.isPending}
						className={`w-full bg-[#fed2b4] px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border border-gray-100 focus:ring-2 focus:ring-pink-300 focus:outline-none text-sm sm:text-base ${
							contactMutation.isPending ? "opacity-60 cursor-not-allowed" : ""
						}`}
					/>
					{formik.touched.country && formik.errors.country && (
						<p className="text-xs sm:text-sm text-red-600 -mt-2">
							{formik.errors.country}
						</p>
					)}
					{/* City */}
					<input
						type="text"
						name="city"
						placeholder="City"
						value={formik.values.city}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						disabled={contactMutation.isPending}
						className={`w-full bg-[#fed2b4] px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border border-gray-100 focus:ring-2 focus:ring-pink-300 focus:outline-none text-sm sm:text-base ${
							contactMutation.isPending ? "opacity-60 cursor-not-allowed" : ""
						}`}
					/>
					{formik.touched.city && formik.errors.city && (
						<p className="text-xs sm:text-sm text-red-600 -mt-2">
							{formik.errors.city}
						</p>
					)}

					{/* Message */}
					<textarea
						name="message"
						rows="4"
						placeholder="Message"
						value={formik.values.message}
						onChange={formik.handleChange}
						disabled={contactMutation.isPending}
						className={`w-full bg-[#fed2b4] px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border border-gray-100 focus:ring-2 focus:ring-pink-300 focus:outline-none resize-none text-sm sm:text-base ${
							contactMutation.isPending ? "opacity-60 cursor-not-allowed" : ""
						}`}
					></textarea>

					{/* Button */}
					<button
						type="submit"
						disabled={contactMutation.isPending}
						className={`w-full py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-[#c02c07] to-red-600 text-white font-semibold shadow-lg transform transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2 ${
							contactMutation.isPending
								? "opacity-70 cursor-not-allowed"
								: "hover:scale-101 cursor-pointer"
						}`}
					>
						{contactMutation.isPending ? (
							<>
								<div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
								Sending...
							</>
						) : (
							"Send Message"
						)}
					</button>
				</form>
			</div>
		</section>
	);
};

export default LetsTalk;
