import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/admin/dashboard"); // <-- Correct path
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#fff1f1] to-[#fdf2f2] py-10 px-5 text-center">
      <div className="welcome-card">
        <div className="w-[90%] max-w-[800px] h-[300px] bg-[#e6e6e6] rounded-xl flex items-center justify-center mb-8">
          <img
            src="/your-logo.png"
            alt="Welcome"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        <p className="text-xl text-[#b62d0f] my-5 font-medium">
          <span className="text-2xl text-[#f85f06] font-bold mx-1">"</span>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
          <span className="text-2xl text-[#f85f06] font-bold mx-1">"</span>
        </p>

        <button
          className="px-8 py-3 bg-gradient-to-r from-[#b62d0f] to-[#f85f06] text-white font-bold rounded-lg my-5 cursor-pointer"
          onClick={handleStart}
        >
          Get Started
        </button>

        <p className="text-sm text-[#444] mt-5">
          By proceeding, you agree to abide by our{" "}
          <a href="#" className="text-[#b62d0f] underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-[#b62d0f] underline">
            Conditions
          </a>
        </p>
      </div>
    </div>
  );
};

export default Welcome;
