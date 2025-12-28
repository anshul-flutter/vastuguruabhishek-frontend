import React from "react";
import profileImg from "../../assets/PayProfile.svg";
import { FaWallet, FaComments, FaBook, FaShoppingCart } from "react-icons/fa";

const EarningsCard = ({ icon: Icon, label, amount }) => (
  <div className="p-3 bg-gray-50 rounded-lg shadow-sm relative flex flex-col justify-between h-24">
    <div className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-md bg-[#ffb3ad] text-[#bb0e00]">
      <Icon className="w-4 h-4" />
    </div>
    <div className="mt-auto pt-6">
      <p className="text-xs text-gray-950">{label}</p>
      <p className="text-sm font-semibold">{amount}</p>
    </div>
  </div>
);

const PayoutCard = () => {
  return (
    <div className="w-full max-w-xs bg-white rounded-2xl shadow-md p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={profileImg}
            alt="Profile"
            className="w-12 h-12 rounded-full shadow-sm"
          />
          <div>
            <h3 className="text-sm font-semibold">Ritwik Sharma</h3>
            <p className="text-xs text-gray-500">Period: Jul 1 – Jul 14</p>
            <p className="text-xs text-gray-800">
              Last Payout: <span className="font-medium">₹48,000</span> – on Jul 10
            </p>
          </div>
        </div>
        <button className="text-gray-800">⋮</button>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <EarningsCard icon={FaWallet} label="Total Earnings" amount="₹52,000" />
        <EarningsCard icon={FaComments} label="Consultations" amount="₹39,000" />
        <EarningsCard icon={FaBook} label="Course Share" amount="₹8,000" />
        <EarningsCard
          icon={FaShoppingCart}
          label="Product Commission"
          amount="₹5,000"
        />
      </div>
      <button className="w-full py-2 rounded-lg text-white font-medium bg-gradient-to-r from-[#bc4b0b] to-[#b91f02]">
        Download PDF
      </button>
    </div>
  );
};

const Payouts = () => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
      <PayoutCard />
      <PayoutCard />
      <PayoutCard />
    </div>
  );
};

export default Payouts;
