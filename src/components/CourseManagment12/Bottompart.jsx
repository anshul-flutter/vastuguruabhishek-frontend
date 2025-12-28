
function BottomPart(){
    return(
        <div>
        <div className="flex flex-col items-start gap-[15px] ml-[12px] mr-[15px]">
          <button className="w-full h-[45px] sm:h-[50px] flex justify-center items-center border border-[#BB0E00] rounded-[5px] shadow-[inset_0_4px_12.4px_rgba(255,255,255,0.25)] text-white text-[14px] sm:text-[15px] font-semibold bg-gradient-to-b from-[#BB0E00] to-[#B94400]">
              Publish
          </button>
          <button className="w-full h-[45px] sm:h-[50px] flex justify-center items-center border border-[#BB0E00] rounded-[5px] shadow-[inset_0_4px_12.4px_rgba(255,255,255,0.25)] text-[#BB0E00] text-[14px] sm:text-[15px] font-semibold bg-white">
              Edit Text
          </button>
        </div>
             {/* Footer */}
           <p className="text-black/60 text-[14px] sm:text-[15px] font-medium text-center mt-[20px] sm:mt-[30px] px-3">
             @ 2025 Vastu Abhishek, All rights reserved.
          </p>
        </div>
    )
}

export default BottomPart