import React, { useState } from "react";
import { FaApple, FaGoogle } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdMail } from "react-icons/io";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectSelectedRole,
  setSelectedRole,
} from "../../store/slices/authSlice";
import { useLoginMutation } from "../../hooks/useAuthApi";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const selectedRole = useAppSelector(selectSelectedRole);
  const role = selectedRole ?? "student";
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useLoginMutation({
    onSuccess: (data) => {
      const redirectPath =
        location.state?.from?.pathname ??
        (data?.data?.role === "admin" ? "/admin/dashboard" : "/");
      navigate(redirectPath, { replace: true });
    },
    onError: (_error, message, errorData) => {
      setError(message);
      // If user is not verified, redirect to email verification page
      if (errorData?.verified === false) {
        setTimeout(() => {
          navigate("/auth/email-verification", {
            state: { email: errorData.email },
          });
        }, 2000);
      }
    },
  });

  const handleContinue = async (e) => {
    e.preventDefault();
    setError("");
    dispatch(setSelectedRole(role.toLowerCase()));
    loginMutation.mutate({
      email,
      password,
      role: role.toLowerCase(),
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#fff5f5] to-[#fff9f0] flex justify-center items-center p-2 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
      <form
        className="bg-gradient-to-r from-[#fff] to-[#efefef] p-8 md:p-6 rounded-2xl shadow-xl max-w-[550px] w-full text-center border border-[#fca311]"
        onSubmit={handleContinue}
      >
        <h2 className="text-xl mb-6 text-[#222]">
          Sign in to your <br />{" "}
          <strong className="text-2xl">Cosmic Journey</strong>
        </h2>

        {/* Email */}
        <div className="w-full flex border justify-between items-center h-[50px] border-gray-300 rounded-lg px-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full my-2 outline-none h-full rounded-lg border-gray-300 text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <span className="text-gray-500">
            <IoMdMail />
          </span>
        </div>

        {/* Password */}
        <div className="w-full mt-2 flex border justify-between items-center h-[50px] border-gray-300 rounded-lg px-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full my-2 outline-none h-full rounded-lg border-gray-300 text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-gray-700 cursor-pointer"
          >
            {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </span>
        </div>

        {/* Role Dropdown */}
        {/* <div className="relative w-full my-2 text-left">
          <div
            onClick={() => setOpen(!open)}
            className="w-full px-3 py-3 rounded-lg border border-gray-300 text-base bg-transparent cursor-pointer flex justify-between items-center hover:border-[#f85f06] transition"
          >
            {role}
            <span
              className={`transform transition ${open ? "rotate-180" : ""}`}
            >
              <IoMdArrowDropdown size={25} className="text-gray-600" />
            </span>
          </div>

          {open && (
            <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg">
              {roles.map((r) => (
                <li
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setOpen(false);
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-[#fef2f2] ${
                    role === r ? "bg-[#fff5f5] font-semibold" : ""
                  }`}
                >
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div> */}

        {/* Error Message */}
        {error && <p className="text-red-600 text-sm my-2">{error}</p>}

        <div className="flex justify-between items-center my-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="form-checkbox h-4 w-4 text-[#b31217] border-gray-300 rounded focus:ring-[#b31217]"
            />
            <span className="text-sm text-gray-700">Stay signed-in</span>
          </label>

          <a
            href="/auth/forget-password"
            className="text-sm font-semibold text-[#b31217] hover:underline"
          >
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full py-3.5 mt-4 bg-[#b31217] text-white font-bold rounded-lg hover:opacity-90 transition duration-300 cursor-pointer disabled:opacity-60"
        >
          {loginMutation.isPending ? "Signing in..." : "Continue"}
        </button>

        <p className="mt-4 text-sm">
          Don't have an account?{" "}
          <span
            className="text-[#b31217] cursor-pointer font-semibold"
            onClick={() => navigate("/auth/register")}
          >
            Register
          </span>
        </p>

        <p className="text-xs text-[#777] mt-7">
          By proceeding, you agree to abide by our{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Terms and Conditions
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
