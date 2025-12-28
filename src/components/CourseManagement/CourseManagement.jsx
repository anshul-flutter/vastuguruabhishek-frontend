
import { IoSearch } from "react-icons/io5";
import { FiBell } from "react-icons/fi";
import { LuFilter } from "react-icons/lu";
import CommentSection from "./CommentSection";
import NavigationManagement from "./Navigation";
import EventCard from "./EventCard";
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
     {/* Navigation */}
      <NavigationManagement /> 

      {/* Event Card */}
       <EventCard />  

      {/* Comments Section */}
        <CommentSection /> 
    </>
  );
}

export default Header;