import { FaStar } from "react-icons/fa";
import profileImg from "../../assets/profile.png";

export default function Consultancy() {
  return (
    <div className="relative w-full max-w-[230px] min-h-[260px] bg-white rounded-b-xl p-4 flex flex-col items-center shadow-[0_4px_20px_rgba(220,38,38,0.2)]">
      <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-xl border-t-2 border-l-2 border-r-2 border-[#bc1203]"></div>
      <img
        src={profileImg}
        alt="profile"
        className="w-[72px] h-[72px] rounded-full border-[#d50000] object-cover relative z-10"
      />
      <h2 className="text-xl font-bold text-[#d50000] mt-1">Lorem ipsum</h2>
      <p className="text-sm font-semibold text-black">Lorem ipsum</p>
      <div className="mt-1 text-center">
        <p className="text-gray-600 text-sm">Services:</p>
        <p className="text-black text-sm">Numerology, Vastu, Residential</p>
      </div>
      <div className="w-full h-px bg-black/20 my-2"></div>
      <div className="flex items-center gap-1 text-sm text-black">
        <FaStar className="text-[#ff8c00]" /> 4.9 (5 reviews)
      </div>
      <button className="mt-2 px-[6px] py-[6px] bg-gradient-to-b from-[#be3407] to-[#a7130d] shadow-[inset_0_4.52px_14.02px_rgba(0,0,0,0.25)] overflow-hidden rounded-[6px] outline outline-[#8A0000] inline-flex justify-center items-center text-white text-[11px] font-semibold leading-[15px]">
        Book Now
      </button>
    </div>
  );
}
