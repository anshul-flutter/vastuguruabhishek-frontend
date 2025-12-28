import React from "react";
import { BsPlayCircleFill, BsStarHalf } from "react-icons/bs";

const UpcomingSessions = () => {
  return (
    <div className="relative flex justify-between gap-[1rem] flex-1 h-[350px] rounded-xl bg-gradient-to-br from-[#bb1101] via-[#ba4302] to-[#c73b01] overflow-hidden pt-4 pl-4 pb-4 min-shadow min-w-[300px]">
      <BsStarHalf
        className="absolute top-[10%] left-[10%] opacity-30 text-red-400"
        size={22}
      />
      <BsStarHalf
        className="absolute top-[40%] left-[20%] opacity-30 text-red-400"
        size={25}
      />
      <BsStarHalf
        className="absolute bottom-[10%] right-[10%] opacity-30 text-red-400"
        size={22}
      />
      <div className="absolute -bottom-[25%] -left-[15%] h-[200px] w-[200px] bg-red-400 opacity-30 rounded-full " />
      <div className="absolute -top-[30%] -right-[20%] h-[300px] w-[300px] bg-red-400 opacity-30 rounded-full " />
      <div className="flex flex-col justify-between z-2 ">
        <div>
          <h2 className="text-white/90 text-[1.15rem]">Upcoming Sessions</h2>
          <p className="text-[1.5rem] text-white font-semibold leading-tight mt-[1rem]">
            Lorem ipsum dolor, sit amet consectetur
          </p>
        </div>
        <div className="flex items-center gap-[1.5rem] z-2">
          <button className="w-fit px-[16px] py-[8px] whitespace-nowrap bg-white rounded-lg">
            Start Your Journey
          </button>
          <BsPlayCircleFill size={"2.5rem"} className="text-white" />
        </div>
      </div>
      <img
        src="/images/chakra.png"
        alt=""
        className="mt-[1rem] h-[250px] z-2"
      />
    </div>
  );
};

export default UpcomingSessions;
