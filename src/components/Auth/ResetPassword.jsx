import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useResetPasswordMutation } from "../../hooks/useAuthApi";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const resetPasswordMutation = useResetPasswordMutation({
    onSuccess: () => {
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
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

    // Validate password
    const pwdError = validatePassword(password);
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    } else {
      setPasswordError("");
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match!");
      return;
    } else {
      setConfirmError("");
    }

    if (!token) {
      setConfirmError("Invalid or expired reset link");
      return;
    }

    resetPasswordMutation.mutate({ token, password, confirmPassword });
  };

  return (
    <div className="relative min-h-screen bg-[#FCFCFC] flex items-center justify-center px-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute w-[545px] h-[545px] bg-[#BB0E00] opacity-[0.18] rounded-full blur-[329.9px] top-[-170px] left-[1049px]" />
      <div className="absolute w-[545px] h-[545px] bg-[#BB0E00] opacity-[0.18] rounded-full blur-[329.9px] top-[622px] left-[-179px]" />

      <form
        onSubmit={handleSubmit}
        className="w-[500px] p-[40px] border border-[#FF0000] rounded-[15px] bg-transparent flex flex-col gap-[20px] z-10"
      >
        <div className="flex flex-col items-center gap-[10px] w-full">
          <h2 className="text-[22px] font-medium text-black text-center font-sans">
            Reset Password
          </h2>
          <p className="text-sm text-[rgba(0,0,0,0.6)] text-center font-sans leading-tight">
            Your new password must be different <br /> from previously used
            passwords.
          </p>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1">
          <div className="relative w-full p-[10px] flex items-center bg-white shadow-[0_0_13px_rgba(0,0,0,0.08)] rounded-[10px]">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none border-none"
            />
            {showPassword ? (
              <IoEyeOffOutline
                size={"1.25rem"}
                className="cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <IoEyeOutline
                size={"1.25rem"}
                className="cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          {passwordError && (
            <p className="text-red-500 text-xs ml-1">{passwordError}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col gap-1">
          <div className="relative w-full p-[10px] flex items-center bg-white shadow-[0_0_13px_rgba(0,0,0,0.08)] rounded-[10px]">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full outline-none border-none"
            />
            {showConfirmPassword ? (
              <IoEyeOffOutline
                size={"1.25rem"}
                className="cursor-pointer"
                onClick={() => setShowConfirmPassword(false)}
              />
            ) : (
              <IoEyeOutline
                size={"1.25rem"}
                className="cursor-pointer"
                onClick={() => setShowConfirmPassword(true)}
              />
            )}
          </div>
          {confirmError && (
            <p className="text-red-500 text-xs ml-1">{confirmError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="w-full h-[50px] px-[15px] text-white text-sm font-semibold font-sans rounded-[10px] border border-[#BB0E00] outline outline-[#BB0E00] outline-offset-[-1px] 
            bg-gradient-to-b from-[#BB0E00] to-[#B94400] shadow-[inset_0_4px_12.4px_rgba(255,255,255,0.25)] flex items-center justify-center disabled:opacity-70 cursor-pointer"
        >
          {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
        </button>

        {resetPasswordMutation.isSuccess && (
          <p className="text-green-600 text-sm text-center font-medium">
            Password reset successful! Redirecting to login...
          </p>
        )}
      </form>

      <div className="absolute bottom-6 text-center text-[12px] text-[rgba(0,0,0,0.6)] font-normal font-sans leading-[18.6px] z-10">
        By proceeding, you agree to abide by our <br />
        <a href="#" className="text-black underline font-medium">
          Terms
        </a>{" "}
        and{" "}
        <a href="#" className="text-black underline font-medium">
          Conditions
        </a>
        .
      </div>
    </div>
  );
}
