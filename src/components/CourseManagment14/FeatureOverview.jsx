import React from "react";

function FeatureOverview() {
  return (
    <div className="flex flex-col lg:flex-row flex-wrap justify-center items-center gap-4 px-2 py-5 lg:flex-nowrap lg:justify-between lg:px-3 lg:gap-0">
      <div className="w-full lg:w-auto">
        <button className="w-full border border-[#ECECEC] rounded-md flex px-4 py-2 justify-center items-center gap-2 text-sm lg:text-base lg:px-6 lg:py-2.5 
          bg-[#F1F1F1] hover:bg-gradient-to-b hover:from-[#BB0E00] hover:to-[#FA5446] 
          hover:text-white hover:border-[#BB0E00] cursor-pointer transition-colors duration-300">
          App Content Management
        </button>
      </div>
      <div className="w-full lg:w-auto">
        <button className="w-full border border-[#ECECEC] rounded-md flex px-4 py-2 justify-center items-center gap-2 text-sm lg:text-base lg:px-6 lg:py-2.5 
          bg-[#F1F1F1] hover:bg-gradient-to-b hover:from-[#BB0E00] hover:to-[#FA5446] 
          hover:text-white hover:border-[#BB0E00] cursor-pointer transition-colors duration-300">
          Static
        </button>
      </div>
      <div className="w-full lg:w-auto">
        <button className="w-full border border-[#ECECEC] rounded-md flex px-4 py-2 justify-center items-center gap-2 text-sm lg:text-base lg:px-6 lg:py-2.5 
          bg-[#F1F1F1] hover:bg-gradient-to-b hover:from-[#BB0E00] hover:to-[#FA5446] 
          hover:text-white hover:border-[#BB0E00] cursor-pointer transition-colors duration-300">
          User Role Permissions
        </button>
      </div>
      <div className="w-full lg:w-auto">
        <button className="w-full border border-[#ECECEC] rounded-md flex px-4 py-2 justify-center items-center gap-2 text-sm lg:text-base lg:px-6 lg:py-2.5 
          bg-[#F1F1F1] hover:bg-gradient-to-b hover:from-[#BB0E00] hover:to-[#FA5446] 
          hover:text-white hover:border-[#BB0E00] cursor-pointer transition-colors duration-300">
          Payment Gateway
        </button>
      </div>
      <div className="w-full lg:w-auto">
        <button className="w-full border border-[#ECECEC] rounded-md flex px-4 py-2 justify-center items-center gap-2 text-sm lg:text-base lg:px-6 lg:py-2.5 
          bg-[#F1F1F1] hover:bg-gradient-to-b hover:from-[#BB0E00] hover:to-[#FA5446] 
          hover:text-white hover:border-[#BB0E00] cursor-pointer transition-colors duration-300">
          Data Backup & Security
        </button>
      </div>
    </div>
  );
}

export default FeatureOverview;
