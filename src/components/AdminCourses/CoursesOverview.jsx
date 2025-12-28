
function CoursesOverview(){
    return(
        <>
         <section className="mx-2.5 mt-5 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
         <h2 className="text-lg sm:text-xl font-medium capitalize text-center sm:text-left">Overview</h2>
          <button className="text-[#BB0E00] border border-[#BB0E00] px-3 py-2 sm:px-4 sm:py-3 rounded-md flex items-center justify-center text-sm sm:text-base w-40 sm:w-auto">
           + Add Course
          </button>
        </section>
        </>
    )
}

export default CoursesOverview