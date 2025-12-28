import { IoSearch } from "react-icons/io5";
import { FiBell } from "react-icons/fi";
import { LuFilter } from "react-icons/lu";

function Header() {
  return (
    <>
    <header className="flex flex-col sm:flex-row justify-between items-center px-[10px] py-[15px] border-b border-[#EDEDED] shadow-[0_1px_11.9px_rgba(0,0,0,0.10)]">
      {/* Left */}
      <div className="mb-2 sm:mb-0">
        <p className="text-[22px] font-semibold text-black/80">Course Managment</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-[9px] w-full sm:w-auto">
        {/* Search Bar */}
        <div className="flex items-center justify-center gap-[10px] border border-[#E6E6E6] rounded-full shadow-[0_0_15.6px_0_rgba(0,0,0,0.08)] px-[10px] py-[10px] w-full sm:w-[300px]">
          <IoSearch size={20} />
          <input
            type="text"
            placeholder="Search key words..."
            className="flex-1 border-none outline-none text-sm bg-transparent"
          />
        </div>

        {/* Filter Button */}
        <div className="flex justify-center items-center w-[44px] h-[44px] border border-[#E6E6E6] rounded-full shadow-[0_0_15.6px_0_rgba(0,0,0,0.08)]">
          <LuFilter size={20} />
        </div>

        {/* Bell Button */}
        <div className="flex justify-center items-center w-[44px] h-[44px] border border-[#E6E6E6] rounded-full shadow-[0_0_15.6px_0_rgba(0,0,0,0.08)]">
          <FiBell size={20} />
        </div>
      </div>
    </header>
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-4 sm:mt-5 px-4 sm:px-6">
        <p className="font-sans text-lg sm:text-[25px] font-medium leading-tight sm:leading-[26px] text-center sm:text-left">
          Enter the Details To Create New Course
        </p>
        <div className="border border-red-500 w-full sm:w-[260px] h-[50px] px-3 sm:px-[15px] py-3 sm:py-[15px] rounded bg-[#BB0E00] flex items-center mt-2 sm:mt-0">
          <p className="text-white text-sm sm:text-[15px] font-semibold leading-tight sm:leading-[19px] text-center w-full">
            Assign Courses to Astrologers
          </p>
        </div>
      </div>
    </>
  );
}

export default Header;