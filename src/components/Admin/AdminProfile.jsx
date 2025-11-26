import { useMemo, useState, useEffect } from "react";
import { FaEnvelope, FaPhoneAlt, FaUserShield } from "react-icons/fa";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/slices/authSlice";
import { useCurrentUserQuery } from "../../hooks/useAuthApi";
import axios from "axios";

const defaultAdminDetails = {
	name: "—",
	email: "—",
	role: "—",
	phone: "—",
};

const InfoRow = ({ icon, label, value }) => (
	<div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white">
		<span className="text-[#BB0E00] text-lg">{icon}</span>
		<div className="flex flex-col">
			<span className="text-xs uppercase tracking-wide text-gray-400">
				{label}
			</span>
			<span className="text-sm font-medium text-gray-800">{value}</span>
		</div>
	</div>
);

function AdminProfile() {
	const currentUser = useAppSelector(selectCurrentUser);
	const { data: fetchedUser } = useCurrentUserQuery({
		enabled: !currentUser,
	});

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [profileImage, setProfileImage] = useState(null);
	const [imagePreview, setImagePreview] = useState("");
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");

	const adminDetails = useMemo(() => {
		const user = currentUser ?? fetchedUser;
		if (!user) return defaultAdminDetails;
		return {
			name: user.name ?? defaultAdminDetails.name,
			email: user.email ?? defaultAdminDetails.email,
			role: user.role ?? defaultAdminDetails.role,
			phone: user.phone ?? defaultAdminDetails.phone,
		};
	}, [currentUser, fetchedUser]);

	useEffect(() => {
		setName(adminDetails.name !== "—" ? adminDetails.name : "");
		setEmail(adminDetails.email !== "—" ? adminDetails.email : "");
		if (currentUser?.profileImage) setImagePreview(currentUser.profileImage);
		else if (fetchedUser?.profileImage)
			setImagePreview(fetchedUser.profileImage);
	}, [adminDetails, currentUser, fetchedUser]);

	const onFileChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setProfileImage(file);
		const reader = new FileReader();
		reader.onload = () => setImagePreview(reader.result);
		reader.readAsDataURL(file);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		setMessage("");
		try {
			const fd = new FormData();
			if (name) fd.append("name", name);
			if (email) fd.append("email", email);
			if (profileImage) fd.append("profileImage", profileImage);
			const base = import.meta.env.VITE_BACKEND_URL || "/api";
			const url = `${base}/auth/update-profile`;
			await axios.put(url, fd, {
				headers: { "Content-Type": "multipart/form-data" },
				withCredentials: true,
			});
			setMessage("Profile updated successfully");
		} catch (err) {
			setMessage(err?.response?.data?.message || "Failed to update profile");
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 md:p-10">
			<header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between border-b border-gray-100 pb-6">
				<div className="flex flex-col gap-1">
					<h1 className="text-2xl font-semibold text-gray-900">
						{adminDetails.name}
					</h1>
					<p className="text-sm text-gray-500">{adminDetails.role}</p>
				</div>
				{/* Edit Profile */}
				<form
					onSubmit={onSubmit}
					className="flex flex-col gap-3 w-full md:w-auto md:min-w-[360px]"
				>
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border">
							{imagePreview ? (
								<img
									src={imagePreview}
									alt="Profile"
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center text-gray-400">
									No Photo
								</div>
							)}
						</div>
						<label className="px-3 py-2 text-sm bg-indigo-50 text-indigo-700 rounded cursor-pointer hover:bg-indigo-100">
							Change Photo
							<input
								type="file"
								className="hidden"
								accept="image/*"
								onChange={onFileChange}
							/>
						</label>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Full name"
							className="px-3 py-2 border rounded"
						/>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email"
							className="px-3 py-2 border rounded"
						/>
					</div>
					<button
						type="submit"
						className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
						disabled={saving}
					>
						{saving ? "Saving..." : "Save Changes"}
					</button>
					{message && <p className="text-sm mt-2 text-gray-600">{message}</p>}
				</form>
			</header>

			<section className="grid gap-4 md:grid-cols-2 mt-6">
				<InfoRow
					icon={<FaUserShield />}
					label="Role"
					value={adminDetails.role}
				/>
				<InfoRow
					icon={<FaEnvelope />}
					label="Email"
					value={adminDetails.email}
				/>
				<InfoRow
					icon={<FaPhoneAlt />}
					label="Phone"
					value={adminDetails.phone}
				/>
			</section>

			{/* Removed static Security & Activity placeholders */}
		</div>
	);
}

export default AdminProfile;
