
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

function FAQSection() {
  return (
    <div className="flex flex-col items-start gap-[25px] pl-3 mr-[15px] sm:pl-5 bg-[#FCFCFC]">
      {/* Heading */}
      <div>
        <p className="text-[18px] sm:text-[20px] font-semibold leading-[26px]">
          Frequently Asked Questions
        </p>
      </div>

      {/* Questions */}
      <div className="flex flex-col items-start gap-5 w-full ml-[0px] sm:ml-[5px]">
        {/* Q1 */}
        <div className="w-full border-b border-[rgba(0,0,0,0.13)]">
          <div className="flex flex-row justify-between items-center self-stretch pb-3">
            <p className="text-[18px] sm:text-[20px] font-medium text-[rgba(0,0,0,0.60)]">
              1. Lorem ipsum dolor sit amet consectetur?
            </p>
            <IoIosArrowDown size={18} sm:size={20} className="text-[rgba(0,0,0,0.60)]" />
          </div>
        </div>

        {/* Q2 */}
        <div className="w-full border-b border-[rgba(0,0,0,0.13)]">
          <div className="flex flex-row justify-between items-center self-stretch pb-3">
            <p className="text-[18px] sm:text-[20px] font-medium text-[rgba(0,0,0,0.60)]">
              2. Lorem ipsum dolor sit amet consectetur?
            </p>
            <IoIosArrowDown size={18} sm:size={20} className="text-[rgba(0,0,0,0.60)]" />
          </div>
        </div>

        {/* Q3 */}
        <div className="w-full border-b border-[rgba(0,0,0,0.13)]">
          <div className="flex flex-row justify-between items-center self-stretch pb-3">
            <p className="text-[18px] sm:text-[20px] font-medium text-[rgba(0,0,0,0.60)]">
              3. Lorem ipsum dolor sit amet consectetur?
            </p>
            <IoIosArrowDown size={18} sm:size={20} className="text-[rgba(0,0,0,0.60)]" />
          </div>
        </div>

        {/* Q4 */}
        <div className="w-full border-b border-[rgba(0,0,0,0.13)]">
          <div className="flex flex-row justify-between items-center self-stretch pb-3">
            <p className="text-[18px] sm:text-[20px] font-medium text-[rgba(0,0,0,0.60)]">
              4. Lorem ipsum dolor sit amet consectetur?
            </p>
            <IoIosArrowDown size={18} sm:size={20} className="text-[rgba(0,0,0,0.60)]" />
          </div>
        </div>

        {/* Q5 (open) */}
        <div className="w-full border-b border-[rgba(0,0,0,0.13)]">
          <div className="flex flex-row justify-between items-center self-stretch pb-3">
            <p className="text-[18px] sm:text-[20px] font-medium text-black">
              5. Lorem ipsum dolor sit amet consectetur?
            </p>
            <IoIosArrowUp size={18} sm:size={20} className="text-black" />
          </div>
          <div className="pb-3">
            <p className="text-[16px] sm:text-[18px] text-[rgba(0,0,0,0.60)]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQSection;