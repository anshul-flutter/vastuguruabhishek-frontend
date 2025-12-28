import React, { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useChangePasswordMutation } from "../hooks/useAuthApi";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const changePasswordMutation = useChangePasswordMutation({
    onSuccess: () => {
      setMessage("Password changed successfully! Redirecting...");
      // Clear form
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // Redirect after success
      setTimeout(() => {
        navigate("/profile"); // Or wherever you want to redirect
      }, 2000);
    },
    onError: (_error, errorMessage) => {
      setMessage(errorMessage);
    },
  });

  // Password validation function
  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pwd))
      return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one number";
    if (!/[!@#$%^&*]/.test(pwd))
      return "Password must contain at least one special character (!@#$%^&*)";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setOldPasswordError("");
    setNewPasswordError("");
    setConfirmError("");
    setMessage("");

    // Validate old password
    if (!oldPassword.trim()) {
      setOldPasswordError("Current password is required");
      return;
    }

    // Validate new password
    const pwdError = validatePassword(newPassword);
    if (pwdError) {
      setNewPasswordError(pwdError);
      return;
    }

    // Check if passwords match
    if (newPassword.trim() !== confirmPassword.trim()) {
      setConfirmError("Passwords do not match");
      return;
    }

    // Check if new password is different from old
    if (oldPassword === newPassword) {
      setNewPasswordError(
        "New password must be different from current password"
      );
      return;
    }

    // Submit
    changePasswordMutation.mutate({
      oldPassword,
      newPassword,
      confirmPassword,
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#fff5f5] to-[#fff9f0] flex justify-center items-center p-5 font-sans">
      <form
        className="bg-gradient-to-r from-[#fff] to-[#efefef] p-8 md:p-10 rounded-2xl shadow-xl max-w-[450px] w-full text-center border border-[#fca311]"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl md:text-2xl mb-6 text-[#222]">
          Change Your <strong>Password</strong>
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Enter your current password and choose a new secure password.
        </p>

        {/* Current Password */}
        <div className="w-full flex border justify-between items-center h-[50px] border-gray-300 rounded-lg px-3">
          <input
            name="oldPassword"
            type={showOldPassword ? "text" : "password"}
            placeholder="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full my-2 outline-none h-full rounded-lg text-base"
            required
          />
          <span
            onClick={() => setShowOldPassword((prev) => !prev)}
            className="text-gray-700 cursor-pointer"
          >
            {showOldPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </span>
        </div>
        {oldPasswordError && (
          <p className="text-red-500 text-xs mt-1 text-left">
            {oldPasswordError}
          </p>
        )}

        {/* New Password */}
        <div className="w-full mt-4 flex border justify-between items-center h-[50px] border-gray-300 rounded-lg px-3">
          <input
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full my-2 outline-none h-full rounded-lg text-base"
            required
          />
          <span
            onClick={() => setShowNewPassword((prev) => !prev)}
            className="text-gray-700 cursor-pointer"
          >
            {showNewPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </span>
        </div>
        {newPasswordError && (
          <p className="text-red-500 text-xs mt-1 text-left">
            {newPasswordError}
          </p>
        )}

        {/* Confirm New Password */}
        <div className="w-full mt-4 flex border justify-between items-center h-[50px] border-gray-300 rounded-lg px-3">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full my-2 outline-none h-full rounded-lg text-base"
            required
          />
          <span
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="text-gray-700 cursor-pointer"
          >
            {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </span>
        </div>
        {confirmError && (
          <p className="text-red-500 text-xs mt-1 text-left">{confirmError}</p>
        )}

        {/* Password Requirements */}
        <div className="mt-4 text-left bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">
            Password Requirements:
          </p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Contains at least one uppercase letter (A-Z)</li>
            <li>• Contains at least one number (0-9)</li>
            <li>• Contains at least one special character (!@#$%^&*)</li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={changePasswordMutation.isPending}
          className="w-full py-3.5 mt-6 bg-[#b31217] text-white font-bold rounded-lg hover:opacity-90 transition duration-300 cursor-pointer disabled:opacity-60"
        >
          {changePasswordMutation.isPending
            ? "Changing Password..."
            : "Change Password"}
        </button>

        {/* Message */}
        {message && (
          <p
            className={`mt-3 text-sm ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full mt-4 text-sm text-gray-600 hover:text-gray-800 underline"
        >
          ← Go Back
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
