import { GrApps } from "react-icons/gr";
import { GoChevronDown } from "react-icons/go";
import { FiEdit, FiTrash2 } from "react-icons/fi";

function CourseAndTopic() {
  return (
    <div className="px-2 xs:px-3 sm:px-4 lg:px-0">
      <div className="mt-4 xs:mt-6 sm:mt-8 lg:mt-[35px] mb-3 xs:mb-4 sm:mb-5 lg:mb-[20px]">
        <p className="font-sans text-sm xs:text-base sm:text-lg lg:text-[20px] font-medium leading-tight xs:leading-normal sm:leading-relaxed lg:leading-[22px]">
          Course & Topic Details:
        </p>
      </div>

      {/* Input Fields Section */}
      <div className="flex flex-col items-end gap-4 xs:gap-5 sm:gap-6 lg:gap-[35px]">
        {/* Reusable field */}
        {[
          { placeholder: "Type Title", icons: true },
          { placeholder: "Type Lesson Name", icons: true },
          { placeholder: "Select Duration", dropdown: true },
          { placeholder: "Add Amount (INR)" },
        ].map((field, index) => (
          <div
            key={index}
            className="flex flex-row items-center gap-2 xs:gap-3 sm:gap-4 lg:gap-[20px] w-full"
          >
            <div className="w-3 h-3 xs:w-4 xs:h-4 lg:w-[16px] lg:h-[16px] flex-shrink-0">
              <GrApps className="w-2.5 h-2.5 xs:w-3 xs:h-3 lg:w-[13px] lg:h-[13px]" />
            </div>
            <div className="border border-[#E4E4E4] rounded-[8px] xs:rounded-[9px] sm:rounded-[10px] lg:rounded-[10px] flex h-9 xs:h-10 sm:h-11 lg:h-[45px] px-2 xs:px-3 sm:px-4 lg:px-[15px] py-2 xs:py-2.5 sm:py-3 lg:py-[12px] items-center gap-2 xs:gap-2.5 sm:gap-3 lg:gap-[10px] flex-1 bg-[rgba(248,248,248,0.30)] shadow-[0_1px_5px_rgba(0,0,0,0.08)] xs:shadow-[0_1px_7px_rgba(0,0,0,0.09)] sm:shadow-[0_2px_8px_rgba(0,0,0,0.09)] lg:shadow-[0_2px_10px_rgba(0,0,0,0.10)] backdrop-blur-[20px] xs:backdrop-blur-[25px] sm:backdrop-blur-[35px] lg:backdrop-blur-[40px]">
              <input
                type="text"
                placeholder={field.placeholder}
                className="text-xs xs:text-xs sm:text-sm lg:text-[12px] font-normal leading-tight xs:leading-normal sm:leading-relaxed lg:leading-[16px] flex-1 outline-none bg-transparent placeholder:text-gray-500"
              />
              {field.icons && (
                <div className="flex flex-row items-center gap-1.5 xs:gap-2 sm:gap-2.5 lg:gap-[10px] flex-shrink-0">
                  <FiEdit className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 lg:w-[15px] lg:h-[15px] text-gray-600 hover:text-red-500 cursor-pointer transition-colors" />
                  <FiTrash2 className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 lg:w-[13px] lg:h-[13px] text-gray-600 hover:text-red-500 cursor-pointer transition-colors" />
                </div>
              )}
              {field.dropdown && (
                <div className="flex flex-row items-center gap-2 lg:gap-[10px] flex-shrink-0">
                  <GoChevronDown className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Lecture Topics Section */}
        <div className="flex flex-row items-start gap-2 xs:gap-3 sm:gap-4 lg:gap-[20px] w-full">
          {/* Left dots */}
          <div className="flex flex-col items-center mt-3 xs:mt-4 sm:mt-6">
            {[1, 2, 3].map((dot, index, arr) => (
              <div key={dot} className="flex flex-col items-center">
                {/* Red dot */}
                <div className="w-[10px] h-[10px] rounded-full bg-red-500" />

                {/* Black line (only show if not the last dot) */}
                {index !== arr.length - 1 && (
                  <div className="w-[2px] h-[30px] sm:h-[50px] bg-black" />
                )}
              </div>
            ))}
          </div>

          {/* Right content */}
          <div className="flex flex-col gap-2 xs:gap-2.5 sm:gap-3 lg:gap-[15px] w-full">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex-1">
                <div className="flex flex-row items-center gap-2 xs:gap-3 sm:gap-4 lg:gap-[20px] w-full">
                  {/* Small left icon box */}
                  <div className="w-3 h-3 xs:w-4 xs:h-4 lg:w-[16px] lg:h-[16px] flex-shrink-0">
                    <GrApps className="w-2.5 h-2.5 xs:w-3 xs:h-3 lg:w-[13px] lg:h-[13px]" />
                  </div>

                  {/* Input box */}
                  <div
                    className="border border-[#E4E4E4] rounded-[8px] xs:rounded-[9px] sm:rounded-[10px] lg:rounded-[10px] 
                          flex h-8 xs:h-9 sm:h-11 lg:h-[45px] 
                          px-2 xs:px-3 sm:px-4 lg:px-[15px] 
                          py-1.5 xs:py-2 sm:py-3 lg:py-[12px] 
                          items-center gap-2 xs:gap-2.5 sm:gap-3 lg:gap-[10px] 
                          flex-1 bg-[rgba(248,248,248,0.30)] 
                          shadow-[0_1px_5px_rgba(0,0,0,0.08)] 
                          xs:shadow-[0_1px_7px_rgba(0,0,0,0.09)] 
                          sm:shadow-[0_2px_8px_rgba(0,0,0,0.09)] 
                          lg:shadow-[0_2px_10px_rgba(0,0,0,0.10)] 
                          backdrop-blur-[20px] xs:backdrop-blur-[25px] 
                          sm:backdrop-blur-[35px] lg:backdrop-blur-[40px]"
                  >
                    <input
                      type="text"
                      placeholder="Add Lecture Topics"
                      className="text-sm xs:text-xs sm:text-sm lg:text-[12px] 
                         font-normal leading-tight xs:leading-normal sm:leading-relaxed lg:leading-[16px] 
                         border-none outline-none bg-transparent flex-1 placeholder:text-gray-500"
                    />

                    {/* Action icons */}
                    <div className="flex flex-row items-center gap-1.5 xs:gap-2 sm:gap-2.5 lg:gap-[10px] flex-shrink-0">
                      <button className="p-1 hover:bg-gray-100 rounded-full">
                        <FiEdit className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 lg:w-[15px] lg:h-[15px] text-gray-600 hover:text-red-500 transition-colors" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-full">
                        <FiTrash2 className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 lg:w-[13px] lg:h-[13px] text-gray-600 hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add More Button */}
      <div className="mt-3 xs:mt-4 sm:mt-5 lg:mt-[20px] flex justify-center items-center">
        <button className="text-red-500 border border-red-500 rounded-[8px] xs:rounded-[9px] sm:rounded-[10px] lg:rounded-[10px] px-3 xs:px-4 sm:px-5 lg:px-[15px] py-2 xs:py-2.5 sm:py-3 lg:py-[12px] text-xs xs:text-sm sm:text-base lg:text-base font-medium hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-200">
          Add More
        </button>
      </div>
    </div>
  );
}

export default CourseAndTopic;
