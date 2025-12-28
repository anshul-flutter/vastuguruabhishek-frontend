import { useState } from "react";
import { IoMdMail } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { MdError } from "react-icons/md";
import { useForgotPasswordMutation } from "../../hooks/useAuthApi";

export default function Forget() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const forgotPasswordMutation = useForgotPasswordMutation({
    onSuccess: () => {
      // Success state is handled in the JSX below
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    forgotPasswordMutation.mutate({ email });
  };

  const isSuccess = forgotPasswordMutation.isSuccess;
  const errorMessage = forgotPasswordMutation.error?.response?.data?.message;

  return (
    <div className="relative min-h-screen bg-[#FCFCFC] flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute w-[545px] h-[545px] bg-[#BB0E00] opacity-[0.18] rounded-full blur-[329.9px] top-[-170px] left-[1049px]" />
      <div className="absolute w-[545px] h-[545px] bg-[#BB0E00] opacity-[0.18] rounded-full blur-[329.9px] top-[622px] left-[-179px]" />

      <form
        onSubmit={handleSubmit}
        className="w-[600px] p-[30px] border mx-[10px] border-[#FF0000] rounded-[15px] bg-transparent flex flex-col gap-[10px] z-10"
      >
        {isSuccess ? (
          // ✅ SUCCESS CASE
          <div className="flex flex-col items-center justify-center">
            <img
              src="/images/email.svg"
              alt="email icon"
              className="h-[200px] opacity-80"
            />
            <p className="text-gray-700 text-center">
              Password reset link has been sent to{" "}
              <span className="text-gray-600 font-semibold">{email}</span>
            </p>
            <button
              type="button"
              onClick={() => navigate("/auth/login")}
              className="mt-4 text-[#BB0E00] font-semibold hover:underline"
            >
              ← Back to Login
            </button>
          </div>
        ) : (
          // ✅ FORM + INLINE ERROR
          <div className="flex flex-col items-center gap-[30px] w-full">
            <div className="flex flex-col items-center gap-[15px] w-[322px]">
              <h2 className="text-[24px] font-medium text-black text-center leading-[22px] font-sans">
                Forgot Password
              </h2>
              <p className="text-[16px] text-[rgba(0,0,0,0.6)] text-center font-sans font-medium">
                Enter the email address associated with your account.
              </p>
            </div>

            <div className="w-full flex flex-col gap-2">
              <div className="border flex p-[10px] items-center justify-between w-full rounded-md border-gray-400">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border outline-none border-none w-full"
                  placeholder="Enter your email"
                />
                <IoMdMail className="text-[#B94400]" size={"1.5rem"} />
              </div>
              {/* Show error under input if email is not registered */}
              {errorMessage && (
                <p className="flex items-center justify-center gap-2 text-sm text-red-700">
                  {errorMessage}
                  <MdError size={20} />
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full h-[50px] px-[15px] text-white text-sm font-semibold font-sans rounded-[10px] border border-[#BB0E00] outline outline-[#BB0E00] outline-offset-[-1px] bg-gradient-to-b from-[#BB0E00] to-[#B94400] 
            shadow-[inset_0_4px_12.4px_rgba(255,255,255,0.25)] flex items-center justify-center cursor-pointer disabled:opacity-70"
            >
              {forgotPasswordMutation.isPending ? "Sending..." : "Continue"}
            </button>
          </div>
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
