import React, { useState } from "react";
import { FaApple, FaUser, FaPhone } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { selectSelectedRole } from "../store/slices/authSlice";
import { useRegisterMutation } from "../hooks/useAuthApi";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfPassword, setShowCnfPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const selectedRole = useAppSelector(selectSelectedRole);

  const registerMutation = useRegisterMutation({
    onSuccess: () => {
      setMessage(
        "Registration successful! Please check your email for verification."
      );
      // Redirect to email verification page with email
      setTimeout(() => {
        navigate("/auth/email-verification", {
          state: { email: email },
        });
      }, 1500);
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

  const validateDOB = () => {
    const { day, month, year } = dob;
    if (!day || !month || !year) {
      alert("Please fill in complete Date of Birth.");
      return false;
    }

    const enteredDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();

    // Check valid date (e.g., 31 Feb issue)
    if (
      enteredDate.getDate() !== Number(day) ||
      enteredDate.getMonth() + 1 !== Number(month)
    ) {
      alert("Invalid Date of Birth entered.");
      return false;
    }

    if (enteredDate > today) {
      alert("Date of Birth cannot be in the future.");
      return false;
    }

    return true;
  };

  const handleContinue = async (e) => {
    e.preventDefault();

    if (!validateDOB()) {
      return;
    }

    // validate password
    const pwdError = validatePassword(password);
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    } else {
      setPasswordError("");
    }

    // confirm password check - FIXED: Use setConfirmError instead of setError
    if (password.trim() !== confirmPassword.trim()) {
      setConfirmError("Passwords do not match");
      return; // Add return to prevent API call when passwords don't match
    } else {
      setConfirmError("");
    }

    registerMutation.mutate({
      name,
      email,
      phone,
      dob: {
        day: dob.day,
        month: dob.month,
        year: dob.year,
      },
      password,
      confirmPassword,
      role: selectedRole ?? "student",
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#fff5f5] to-[#fff9f0] flex justify-center items-center p-5 font-sans">
      <form
        className="bg-gradient-to-r from-[#fff] to-[#efefef] p-8 md:p-10 rounded-2xl shadow-xl max-w-[450px] w-full text-center border border-[#fca311]"
        onSubmit={handleContinue}
      >
        <h2 className="text-xl md:text-2xl mb-6 text-[#222]">
          Start Your Astrological Journey <strong>Register Now!</strong>
        </h2>

        {/* Name */}
        <div className="w-full flex border justify-between items-center h-[50px] border-gray-300 rounded-lg px-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            name="name"
            onChange={(e) => setName(e.target.value)}
            className="w-full my-2 outline-none h-full rounded-lg text-base"
            required
          />
          <FaUser className="text-gray-500" />
        </div>

        {/* Email */}
        <div className="w-full mt-2 flex border justify-between items-center h-[50px] border-gray-300 rounded-lg px-3">
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full my-2 outline-none h-full rounded-lg text-base"
            required
          />
          <IoMdMail className="text-gray-500" />
        </div>

        {/* Phone */}
        <div className="w-full mt-2 flex border justify-between items-center h-[50px] border-gray-300 rounded-lg px-3">
          <input
            type="tel"
            placeholder="Phone Number"
            name="phone"
            value={phone}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only numbers and max 12 digits
              if (/^\d{0,12}$/.test(value)) {
                setPhone(value);
              }
            }}
            className="w-full my-2 outline-none h-full rounded-lg text-base"
            required
          />
          <FaPhone className="text-gray-500" />
        </div>

        {/* DOB */}
        <div className="w-full mt-2 flex border justify-between items-center h-[50px] border-gray-300 rounded-lg px-3 space-x-2">
          {/* Day */}
          <select
            name="day"
            value={dob.day}
            onChange={(e) => setDob({ ...dob, day: e.target.value })}
            className="flex-1 my-2 outline-none h-full rounded-lg text-base text-center"
            required
          >
            <option value="">DD</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Month */}
          <select
            name="month"
            value={dob.month}
            onChange={(e) => setDob({ ...dob, month: e.target.value })}
            className="flex-1 my-2 outline-none h-full rounded-lg text-base text-center"
            required
          >
            <option value="">MM</option>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month, index) => (
              <option key={index + 1} value={index + 1}>
                {month}
              </option>
            ))}
          </select>

          {/* Year */}
          <select
            name="year"
            value={dob.year}
            onChange={(e) => setDob({ ...dob, year: e.target.value })}
            className="flex-1 my-2 outline-none h-full rounded-lg text-base text-center"
            required
          >
            <option value="">YYYY</option>
            {Array.from(
              { length: new Date().getFullYear() - 1900 + 1 },
              (_, i) => 1900 + i
            )
              .reverse()
              .map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
          </select>
        </div>

        {/* Password */}
        <div className="w-full mt-2 flex border justify-between items-center h-[50px] border-gray-300 rounded-lg px-3">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full my-2 outline-none h-full rounded-lg text-base"
            required
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-gray-700 cursor-pointer"
          >
            {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </span>
        </div>
        {passwordError && (
          <p className="text-red-500 text-xs mt-1">{passwordError}</p>
        )}

        {/* Confirm Password */}
        <div className="w-full mt-2 flex border justify-between items-center h-[50px] border-gray-300 rounded-lg px-3">
          <input
            name="confirmPassword"
            type={showCnfPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full my-2 outline-none h-full rounded-lg text-base"
            required
          />
          <span
            onClick={() => setShowCnfPassword((prev) => !prev)}
            className="text-gray-700 cursor-pointer"
          >
            {showCnfPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </span>
        </div>
        {confirmError && (
          <p className="text-red-500 text-xs mt-1">{confirmError}</p>
        )}

        {/* Continue */}
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full py-3.5 mt-4 bg-[#b31217] text-white font-bold rounded-lg hover:opacity-90 transition duration-300 cursor-pointer disabled:opacity-60"
        >
          {registerMutation.isPending ? "Registering..." : "Continue"}
        </button>

        {message && (
          <p
            className={`mt-3 text-sm ${
              message.includes("successful") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Register;
