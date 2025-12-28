import React from "react";
import { PiSpinnerBold } from "react-icons/pi";

export default function ProcessingCard() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center w-[400px]">
        <PiSpinnerBold className=" text-[#bb1500] mx-auto text-8xl mb-4" />
        <h2 className="text-2xl font-bold mb-2">Processing...</h2>

        <p className="text-[#757575] text-[17px]">
          We are processing your payment.
          <br /> It might take a few seconds.
        </p>
        <p className="text-[#757575] mt-4 text-[17px]">
          Please do not refresh the page or <br />
          click the "Back" button of your
          browser.
        </p>
      </div>
    </div>
  );
}
