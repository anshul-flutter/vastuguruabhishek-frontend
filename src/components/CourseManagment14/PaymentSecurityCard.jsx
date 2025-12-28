// import styles from "./PaymentSecurityCard.module.css"
// import { FcSimCardChip } from "react-icons/fc";
// import { PiWifiHighBold } from "react-icons/pi";
// import { IoCopyOutline } from "react-icons/io5";
// function PaymentSecurityCard(){
//     return(
//         <div className={styles.Parent}>
//            <div className={styles.LeftAlign}>
//               <div className={styles.FirstLeftAlign}>
//                  <p>Bank</p>
//               </div>
//               <div className={styles.SecondLeftAlign}>
//                  <FcSimCardChip  size={50}/>
//               </div>
//               <div className={styles.ThirdLeftAlign}>
//                  <pre style={{color:"white"}}> 1 2 3 4   5 6 7 8  9 0 1 2</pre><PiWifiHighBold size={25} style={{ transform: "rotate(90deg)", color:"white" }} />
//               </div>
//               <div className={styles.FourthLeftAlign}>
//                  <p>VARUN BHAT</p>
//                  <p>12/35</p>
//               </div>
//            </div>
//            <div className={styles.RightAlign}>
//               <div className={styles.RightAlignHeading}>
//                   <p>Security Settings</p>
//               </div>
//               <div className={styles.LowerPart}>
//                   <div>
//                      <p>Gateway</p>
//                      <p style={{color:"rgba(0, 0, 0, 0.70)"}}>Razorpay</p>
//                   </div>
//                   <div>
//                     <p>Status</p>
//                     <p style={{color:"#189200"}}>Active</p>
//                   </div>
//                   <div>
//                       <p>API Key</p>
//                     <div style={{display:"flex",flexDirection:"row",alignItems:"center",gap:"10px"}}>
//                       <p style={{color:"rgba(0, 0, 0, 0.70)"}}>rzp_test_d89fsfg8f9w </p>
//                       <IoCopyOutline />
//                     </div>
//                   </div>
//                   <div>
//                     <p>Mode</p>
//                     <p style={{color:"rgba(0, 0, 0, 0.70)"}}>Live</p>
//                   </div>
//                   <div>
//                      <p>Last Modified</p>
//                      <p style={{color:"rgba(0, 0, 0, 0.70)"}}>Jul 13, 2025</p>
//                   </div>
//                </div>
//                   <div className={styles.LowerButton}>
//                      <button style={{background:"linear-gradient(180deg, #BB0E00 0%, #B94400 100%)",color: "#fff"}}>Edit Settings</button>
//                      <button style={{background:"#FFF",color:"#BB0E00"}}>Test Payment</button>
//                   </div>
//            </div>
//         </div>
//     )
// }

// export default PaymentSecurityCard

import { FcSimCardChip } from "react-icons/fc";
import { PiWifiHighBold } from "react-icons/pi";
import { IoCopyOutline } from "react-icons/io5";

function PaymentSecurityCard() {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between justify-start items-start mx-[15px] gap-4">
      {/* Left Card */}
      <div className="rounded-[15px] bg-gradient-to-br from-[#FF5D00] to-[#D56700] shadow-[0_4px_17px_0_rgba(255,94,0,0.44)] w-full max-w-[350px] h-[210px]">
        {/* Bank Heading */}
        <div>
          <p className="text-white text-[18px] font-medium w-full max-w-[310px] mx-auto mt-5 flex justify-end">
            Bank
          </p>
        </div>

        {/* Chip */}
        <div className="w-full max-w-[310px] mx-auto">
          <FcSimCardChip size={50} />
        </div>

        {/* Card Number + Wifi */}
        <div className="w-full max-w-[310px] mx-auto mt-[10px] flex flex-row justify-between items-center">
          <pre className="text-white"> 1 2 3 4   5 6 7 8  9 0 1 2</pre>
          <PiWifiHighBold
            size={25}
            className="text-white rotate-90"
          />
        </div>

        {/* Name + Expiry */}
        <div className="w-full max-w-[308px] mx-auto mt-10 flex flex-row justify-between items-center">
          <p className="text-white text-[14px] font-medium tracking-[1px]">
            VARUN BHAT
          </p>
          <p className="text-white text-[14px] font-medium tracking-[1px]">
            12/35
          </p>
        </div>
      </div>

      {/* Right Card */}
      <div className="border border-[#E1E1E1] rounded-[15px] w-full max-w-[700px] flex flex-col self-stretch bg-[#F8F8F8] p-[15px] gap-[30px]">
        {/* Heading */}
        <div>
          <p className="text-[17px] font-[530] leading-[22px]">
            Security Settings
          </p>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-[20px]">
          <div className="flex flex-row justify-between items-center self-stretch">
            <p>Gateway</p>
            <p className="text-[rgba(0,0,0,0.70)]">Razorpay</p>
          </div>

          <div className="flex flex-row justify-between items-center self-stretch">
            <p>Status</p>
            <p className="text-[#189200]">Active</p>
          </div>

          <div className="flex flex-row justify-between items-center self-stretch">
            <p>API Key</p>
            <div className="flex flex-row items-center gap-[10px]">
              <p className="text-[rgba(0,0,0,0.70)] truncate max-w-[200px]">rzp_test_d89fsfg8f9w</p>
              <IoCopyOutline />
            </div>
          </div>

          <div className="flex flex-row justify-between items-center self-stretch">
            <p>Mode</p>
            <p className="text-[rgba(0,0,0,0.70)]">Live</p>
          </div>

          <div className="flex flex-row justify-between items-center self-stretch">
            <p>Last Modified</p>
            <p className="text-[rgba(0,0,0,0.70)]">Jul 13, 2025</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-[20px]">
          <button className="border border-[#BB0E00] rounded-[5px] shadow-[inset_0_4px_12.4px_rgba(255,255,255,0.25)] py-[15px] text-[15px] font-medium cursor-pointer bg-gradient-to-b from-[#BB0E00] to-[#B94400] text-white">
            Edit Settings
          </button>
          <button className="border border-[#BB0E00] rounded-[5px] shadow-[inset_0_4px_12.4px_rgba(255,255,255,0.25)] py-[15px] text-[15px] font-medium cursor-pointer bg-white text-[#BB0E00]">
            Test Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSecurityCard;