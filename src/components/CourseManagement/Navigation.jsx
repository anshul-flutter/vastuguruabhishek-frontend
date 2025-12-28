
function NavigationManagement() {
  return (
    <>
      {/* Navigation */}
      <nav className="h-auto flex flex-wrap gap-2 sm:gap-3 mt-6 mx-2 sm:mx-4 md:mx-6">
        <button className="px-4 sm:px-5 md:px-6 py-1 sm:py-2 text-xs sm:text-sm font-medium border border-[#ECECEC] bg-[#F1F1F1] rounded-[5px] hover:bg-[#BB0E00] hover:text-white transition-colors duration-300">
          Customers List
        </button>
        <button className="px-4 sm:px-5 md:px-6 py-1 sm:py-2 text-xs sm:text-sm font-medium border border-[#ECECEC] bg-[#F1F1F1] rounded-[5px] hover:bg-[#BB0E00] hover:text-white transition-colors duration-300">
          Orders & Purchase History
        </button>
        <button className="px-4 sm:px-5 md:px-6 py-1 sm:py-2 text-xs sm:text-sm font-medium border border-[#ECECEC] bg-[#F1F1F1] rounded-[5px] hover:bg-[#BB0E00] hover:text-white transition-colors duration-300">
          Event Bookings
        </button>
      </nav>
    </>
  );
}

export default NavigationManagement;
