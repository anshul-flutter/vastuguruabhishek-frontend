
function FeatureOverview() {
  return (
    <div className="flex flex-row justify-between items-center px-[10px] py-[20px] 
                    max-[900px]:flex-col max-[900px]:gap-2">
      <div className="max-[900px]:w-full">
        <button className="border border-[#ECECEC] rounded-md bg-[#F1F1F1] flex px-[25px] py-[10px] 
                           flex-col justify-center items-center gap-[10px] 
                           hover:border-[#BB0E00] hover:bg-gradient-to-b hover:from-[#BB0E00] hover:to-[#FA5446] 
                           hover:text-white cursor-pointer
                           max-[1200px]:text-[13px] max-[1200px]:px-[15px] 
                           max-[900px]:text-[15px] max-[900px]:w-full">
          App Content Management
        </button>
      </div>
      <div className="max-[900px]:w-full">
        <button className="border border-[#ECECEC] rounded-md bg-[#F1F1F1] flex px-[25px] py-[10px] 
                           flex-col justify-center items-center gap-[10px] 
                           hover:border-[#BB0E00] hover:bg-gradient-to-b hover:from-[#BB0E00] hover:to-[#FA5446] 
                           hover:text-white cursor-pointer
                           max-[1200px]:text-[13px] max-[1200px]:px-[15px] 
                           max-[900px]:text-[15px] max-[900px]:w-full">
          Static
        </button>
      </div>
      <div className="max-[900px]:w-full">
        <button className="border border-[#ECECEC] rounded-md bg-[#F1F1F1] flex px-[25px] py-[10px] 
                           flex-col justify-center items-center gap-[10px] 
                           hover:border-[#BB0E00] hover:bg-gradient-to-b hover:from-[#BB0E00] hover:to-[#FA5446] 
                           hover:text-white cursor-pointer
                           max-[1200px]:text-[13px] max-[1200px]:px-[15px] 
                           max-[900px]:text-[15px] max-[900px]:w-full">
          User Role Permissions
        </button>
      </div>
      <div className="max-[900px]:w-full">
        <button className="border border-[#ECECEC] rounded-md bg-[#F1F1F1] flex px-[25px] py-[10px] 
                           flex-col justify-center items-center gap-[10px] 
                           hover:border-[#BB0E00] hover:bg-gradient-to-b hover:from-[#BB0E00] hover:to-[#FA5446] 
                           hover:text-white cursor-pointer
                           max-[1200px]:text-[13px] max-[1200px]:px-[15px] 
                           max-[900px]:text-[15px] max-[900px]:w-full">
          Payment Gateway
        </button>
      </div>
      <div className="max-[900px]:w-full">
        <button className="border border-[#ECECEC] rounded-md bg-[#F1F1F1] flex px-[25px] py-[10px] 
                           flex-col justify-center items-center gap-[10px] 
                           hover:border-[#BB0E00] hover:bg-gradient-to-b hover:from-[#BB0E00] hover:to-[#FA5446] 
                           hover:text-white cursor-pointer
                           max-[1200px]:text-[13px] max-[1200px]:px-[15px] 
                           max-[900px]:text-[15px] max-[900px]:w-full">
          Data Backup & Security
        </button>
      </div>
    </div>
  );
}

export default FeatureOverview;
