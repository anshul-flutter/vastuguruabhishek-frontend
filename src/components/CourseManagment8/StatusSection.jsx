
function StatusSection() {
  return (
    <>
      <nav className="w-full h-auto flex flex-wrap gap-2 sm:gap-3 mt-6 pl-[10px] pr-2 sm:pr-4 md:pr-6">
        <button className="px-4 sm:px-5 md:px-6 py-1 sm:py-2 text-xs sm:text-sm font-medium border border-[#ECECEC] bg-[#F1F1F1] rounded-[5px] hover:bg-[#BB0E00] hover:text-white transition-colors duration-300 cursor-pointer">
          All Bookings
        </button>
        <button className="px-4 sm:px-5 md:px-6 py-1 sm:py-2 text-xs sm:text-sm font-medium border border-[#ECECEC] bg-[#F1F1F1] rounded-[5px] hover:bg-[#BB0E00] hover:text-white transition-colors duration-300 cursor-pointer">
          Assign Astrologers
        </button>
        <button className="px-4 sm:px-5 md:px-6 py-1 sm:py-2 text-xs sm:text-sm font-medium border border-[#ECECEC] bg-[#F1F1F1] rounded-[5px] hover:bg-[#BB0E00] hover:text-white transition-colors duration-300 cursor-pointer">
          Payment Status
        </button>
      </nav>
    </>
  );
}

export default StatusSection;

