// import React from "react";
// import { FaStarOfDavid, FaCaretRight, FaShoppingCart } from "react-icons/fa";

// export default function PackageCard({ icon, title, subtitle, features, oldPrice, newPrice }) {
//   return (
//     <div className="relative w-[342px] h-[400px] bg-gradient-to-b from-[#FFE9E9] to-[#FFD5BD] shadow-md overflow-hidden rounded-[15px] p-3">
//       <div className="flex items-center gap-3 mb-3">
//         <div className="w-[66px] h-[66px] bg-gradient-to-b from-[#BB0E00] to-[#B94400] shadow-inner rounded-full border border-[#AC0000] flex justify-center items-center">
//           {icon || <FaStarOfDavid className="text-white" size={28} />}
//         </div>
//         <div className="flex flex-col gap-1 w-[234px]">
//           <h3 className="text-black text-[20px] font-medium leading-[26px]">{title}</h3>
//           <p className="text-black text-[16px] font-normal leading-[20.8px]">{subtitle}</p>
//         </div>
//       </div>
//       <div className="flex flex-col gap-[15px] mb-2">
//         {features.map((feature, i) => (
//           <div key={i} className="flex items-start gap-2">
//             <FaCaretRight className="text-[#BB0E00] mt-[2px]" />
//             <span className="text-black text-[15px] leading-[19.5px]">{feature}</span>
//           </div>
//         ))}
//       </div>

//       <div className="text-black/90 text-[13px] underline leading-[16.9px] cursor-pointer mt-3">
//         More details
//       </div>
//       <div className="border-t border-black/20 mt-5"></div>

//       <div className="flex justify-between items-center mt-4">
//         <div className="flex flex-col gap-1 w-[86px]">
//           <span className="text-black/60 text-[15px] line-through leading-[19.5px]">{oldPrice}</span>
//           <span className="text-black text-[15px] font-semibold leading-[20.2px]">{newPrice}</span>
//         </div>

//         {/* Button with Cart Icon */}
//         <button className="flex items-center gap-2 px-3 py-2 bg-gradient-to-b from-[#BB0E00] to-[#B94400] shadow-inner rounded-md border border-[#BB0E00] text-white text-[13px] font-semibold leading-[16px] hover:opacity-90 transition">
//           <FaShoppingCart size={14} /> Buy Now
//         </button>
//       </div>
//     </div>
//   );
// }
