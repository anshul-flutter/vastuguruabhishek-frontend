
import { MdPhone } from "react-icons/md";
import { RiMailFill } from "react-icons/ri";

function ContactCard() {
  return (
    <div className="flex flex-col items-start gap-[15px]">
      {/* Phone Card */}
      <div className="flex flex-col items-start self-stretch rounded-[15px] border border-[#EEE] bg-white shadow-[0_0_14.7px_0_rgba(0,0,0,0.08)] px-3 py-[17px] mx-[8px] sm:mx-[15px]">
        <div className="flex items-center gap-[10px] self-stretch">
          <div className="flex w-[40px] h-[40px] sm:w-[49px] sm:h-[49px] justify-center items-center rounded-[10px] bg-[#FFD7D4]">
            <MdPhone size={20} sm:size={23} color="#B94400" />
          </div>
          <div className="flex flex-col items-start gap-[4px]">
            <p className="text-[11px] sm:text-[12px] font-normal leading-[22px] text-[rgba(0,0,0,0.56)]">
              Our 24/7 customer services
            </p>
            <p className="text-[14px] sm:text-[16px] font-medium leading-[22px] text-[#C71210]">
              +91 009909990
            </p>
          </div>
        </div>
      </div>

      {/* Email Card */}
      <div className="flex flex-col items-start self-stretch rounded-[15px] border border-[#EEE] bg-white shadow-[0_0_14.7px_0_rgba(0,0,0,0.08)] px-3 py-[17px] mx-[8px] sm:mx-[15px]">
        <div className="flex items-center gap-[10px] self-stretch">
          <div className="flex w-[40px] h-[40px] sm:w-[49px] sm:h-[49px] justify-center items-center rounded-[10px] bg-[#FFD7D4]">
            <RiMailFill size={20} sm:size={23} color="#B94400" />
          </div>
          <div className="flex flex-col items-start gap-[4px]">
            <p className="text-[11px] sm:text-[12px] font-normal leading-[22px] text-[rgba(0,0,0,0.56)]">
              Write Us at
            </p>
            <p className="text-[14px] sm:text-[16px] font-medium leading-[22px] text-[#C71210]">
              vastuabhishek@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactCard;
