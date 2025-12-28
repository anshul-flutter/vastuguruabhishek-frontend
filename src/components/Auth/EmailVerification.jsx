import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/slices/authSlice";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "../../hooks/useAuthApi";

export default function EmailVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState([null, null, null, null, null, null]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const inputsRef = useRef([]);
  const currentUser = useAppSelector(selectCurrentUser);
  const userEmail = location.state?.email || currentUser?.email;

  const verifyOtpMutation = useVerifyOtpMutation({
    onSuccess: () => {
      setMessage("Account created successfully! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/"); // Redirect to home/dashboard
      }, 1500);
    },
    onError: (error, message) => {
      setError(message);
    },
  });

  const resendOtpMutation = useResendOtpMutation({
    onSuccess: () => {
      setMessage("New OTP sent successfully! Please check your email.");
      setError("");
      setCode([null, null, null, null, null, null]);
      inputsRef.current[0]?.focus();
    },
    onError: (error, message) => {
      setError(message);
    },
  });

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const otp = code.join("");
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    if (!userEmail) {
      setError("Email not found. Please register again.");
      return;
    }

    verifyOtpMutation.mutate({
      email: userEmail,
      otp: otp,
    });
  };

  const handleResendOtp = () => {
    if (!userEmail) {
      setError("Email not found. Please register again.");
      return;
    }

    resendOtpMutation.mutate({ email: userEmail });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#fff5f5] to-[#fff9f0] overflow-hidden px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-red-600 rounded-2xl shadow-xl p-8 md:p-12 z-10 max-w-[500px] w-full"
      >
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
            Email Verification
          </h2>
          <p className="text-base text-gray-600 text-center">
            Please enter the 6-digit code we sent to{" "}
            <span className="font-semibold text-gray-800">{userEmail}</span>
          </p>

          {/* OTP Inputs */}
          <div className="grid grid-cols-6 gap-2 md:gap-3 w-full max-w-[380px]">
            {code.map((val, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                maxLength="1"
                value={val || ""}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`h-14 w-full rounded-lg border-2 text-center text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#BC3D03] transition ${
                  val ? "border-[#BC3D03] text-[#BB0E00]" : "border-gray-300"
                }`}
                required
              />
            ))}
          </div>

          {/* Success Message */}
          {message && (
            <p className="text-green-600 text-sm font-medium">{message}</p>
          )}

          {/* Error Message */}
          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            disabled={verifyOtpMutation.isPending}
            className="w-full h-14 bg-gradient-to-b from-[#BB0E00] to-[#B94400] text-white text-base font-semibold rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-60"
          >
            {verifyOtpMutation.isPending
              ? "Verifying..."
              : "Verify and Proceed"}
          </button>

          {/* Resend OTP */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-gray-600">Didn't receive the code? </p>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendOtpMutation.isPending}
              className="text-[#BB0E00] font-semibold hover:underline disabled:opacity-60"
            >
              {resendOtpMutation.isPending ? "Sending..." : "Resend OTP"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate("/auth/login")}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}
