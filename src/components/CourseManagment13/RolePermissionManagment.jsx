
function RolePermissionManagment() {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between px-3 gap-3 sm:gap-0">
        <div className="text-center sm:text-left">
          <p className="mt-[10px] text-black font-[SF Pro] text-lg sm:text-[24px] not-italic font-medium leading-normal">
            User Role Permissions
          </p>
        </div>
        <div className="rounded-[5px] bg-white shadow-[inset_0px_4px_12.4px_0px_rgba(255,255,255,0.25)] flex h-[49px] p-[15px] justify-center items-center w-full sm:w-auto">
          <button className="border border-[#BB0E00] p-[15px] rounded-[5px] text-[#BB0E00] text-[15px] not-italic font-semibold leading-5 cursor-pointer whitespace-nowrap">
            + Add New Role
          </button>
        </div>
      </div>
    </>
  );
}

export default RolePermissionManagment;