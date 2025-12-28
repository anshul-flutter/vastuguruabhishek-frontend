     
 import ToggleSwitch from "./ToggleSwitch";

 function SecuritySettings() {
   return (
     <div className="w-full">
       <div className="border border-[#E1E1E1] rounded-[15px] bg-[#F8F8F8] shadow-[0_0_10px_0_rgba(0,0,0,0.15)] flex flex-col gap-[20px] p-[15px] mx-[15px] overflow-hidden">
         <div>
           <p className="text-[18px] leading-[22px]">Data Encryption</p>
         </div>

         <div className="flex flex-row justify-between items-center self-stretch">
           <p className="text-[15px] flex-1 pr-4 truncate">AES-256</p>
           <ToggleSwitch />
         </div>

         <div className="flex flex-row justify-between items-center self-stretch">
           <p className="text-[15px] flex-1 pr-4 truncate">2FA for Admin Login</p>
           <ToggleSwitch />
         </div>
       </div>
     </div>
   );
 }

 export default SecuritySettings;
