
import { MdKeyboardArrowDown } from "react-icons/md";

function SecurityBackupDetails() {
  return (
    <div className="border border-[#e1e1e1] rounded-[15px] bg-[#f8f8f8] shadow-[0_0_10px_0_rgba(0,0,0,0.15)] flex flex-col gap-[30px] p-[15px] mx-[15px]">
      {/* Upper Heading */}
      <div>
        <p className="text-[18px] font-medium leading-[22px]">Security Settings</p>
      </div>

      {/* Lower Heading */}
      <div className="flex flex-col gap-[20px]">
        <div className="flex justify-between items-center">
          <p className="text-[15px] font-medium text-[rgba(0,0,0,0.80)] leading-normal">
            Last Backup
          </p>
          <p className="text-[13px] font-normal text-[rgba(0,0,0,0.70)] leading-normal truncate">
            Jul 14, 2025 - 2:00 A.M
          </p>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-[15px] font-medium text-[rgba(0,0,0,0.80)] leading-normal">
            Backup Size
          </p>
          <p className="text-[13px] font-normal text-[rgba(0,0,0,0.70)] leading-normal">
            112 MB
          </p>
        </div>

        <div className="flex justify-between items-center flex-wrap">
          <p className="text-[15px] font-medium text-[rgba(0,0,0,0.80)] leading-normal">
            Frequency
          </p>
          <div className="flex flex-row items-center gap-[15px] self-stretch">
            <p className="text-[13px] font-normal text-[rgba(0,0,0,0.70)] leading-normal truncate">
              Daily at 2:00 AM
            </p>
            <MdKeyboardArrowDown size={25} />
          </div>
        </div>

        <div className="w-full">
          <button
            className="w-full border border-[#BB0E00] rounded-[5px] cursor-pointer shadow-[inset_0_4px_12.4px_rgba(255,255,255,0.25)] p-[15px] text-[15px] font-semibold bg-gradient-to-b from-[#BB0E00] to-[#B94400] text-white"
          >
            Download Backup
          </button>
        </div>

        <div>
          <button
            className="w-full border border-[#BB0E00] rounded-[5px] cursor-pointer shadow-[inset_0_4px_12.4px_rgba(255,255,255,0.25)] p-[15px] text-[15px] font-semibold bg-white text-[#BB0E00]"
          >
            Change Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

export default SecurityBackupDetails;