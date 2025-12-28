// import styles from "./PrivacyPolicyPage.module.css"
// import { MdInsertDriveFile } from "react-icons/md";
// function PrivacyPolicyPage(){
//  return(
//     <div className={styles.Parent}>
//         <div className={styles.Heading}>
//            <p>Legal</p>
//         </div>
//         <div className={styles.Policy}>
//            <div className={styles.CombinedDiv}>
//                <div className={styles.LeftAlign}>
//                  <MdInsertDriveFile size={20} color="#BB0E00"/>
//                </div>
//                <div className={styles.RightAlign}>
//                   <p style={{fontSize:"16px",fontStyle:"normal",fontWeight:"510",lineHeight:"22px"}}> Privacy Policy </p>
//                   <p style={{color:"rgba(0, 0, 0, 0.56)",fontSize:"12px",fontWeight:"400",lineHeight:"22px"}}> Effective July 2025</p>
//                </div>
//            </div>

//             <div className={styles.CombinedDiv}>
//                <div className={styles.LeftAlign}>
//                  <MdInsertDriveFile size={20} color="#BB0E00"/>
//                </div>
//                <div className={styles.RightAlign}>
//                   <p style={{fontSize:"16px",fontStyle:"normal",fontWeight:"510",lineHeight:"22px"}}> Terms & Conditions </p>
//                   <p style={{color:"rgba(0, 0, 0, 0.56)",fontSize:"12px",fontWeight:"400",lineHeight:"22px"}}> Effective July 2025</p>
//                </div>
//            </div>
//         </div>
//     </div>
//  )
// }

// export default PrivacyPolicyPage

import { MdInsertDriveFile } from "react-icons/md";

function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col items-start gap-[25px] pl-3 sm:pl-5 mr-[15px]">
      {/* Heading */}
      <div>
        <p className="text-[18px] sm:text-[20px] font-medium leading-[26px]">Legal</p>
      </div>

      {/* Policy Section */}
      <div className="flex flex-col items-start gap-[15px] self-stretch">
        {/* Privacy Policy */}
        <div className="flex items-center gap-[10px] self-stretch rounded-[15px] border border-[#EEE] bg-white shadow-[0_0_14.7px_0_rgba(0,0,0,0.08)] px-[5px] py-[15px]">
          <div className="flex w-[40px] h-[40px] sm:w-[49px] sm:h-[49px] justify-center items-center rounded-[10px] bg-[#FFD7D4] ml-[5px]">
             <MdInsertDriveFile size={18} sm:size={20} color="#BB0E00" />
          </div>
          <div className="flex flex-col items-start gap-[4px]">
            <p className="text-[14px] sm:text-[16px] font-medium leading-[22px]">Privacy Policy</p>
            <p className="text-[11px] sm:text-[12px] font-normal leading-[22px] text-[rgba(0,0,0,0.56)]">
              Effective July 2025
            </p>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-center gap-[10px] self-stretch rounded-[15px] border border-[#EEE] bg-white shadow-[0_0_14.7px_0_rgba(0,0,0,0.08)] px-[5px] py-[15px]">
          <div className="flex w-[40px] h-[40px] sm:w-[49px] sm:h-[49px] justify-center items-center rounded-[10px] bg-[#FFD7D4]  ml-[5px]">
            <MdInsertDriveFile size={18} sm:size={20} color="#BB0E00" />
          </div>
          <div className="flex flex-col items-start gap-[4px]">
            <p className="text-[14px] sm:text-[16px] font-medium leading-[22px]">Terms & Conditions</p>
            <p className="text-[11px] sm:text-[12px] font-normal leading-[22px] text-[rgba(0,0,0,0.56)]">
              Effective July 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
