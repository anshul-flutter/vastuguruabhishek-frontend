

//  import React, { useState } from "react";
//  import { MdOutlineKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";

//  const PermissionsData = [
//    { feature: "View Dashboard", admin: "Access", astrologer: "Access", student: "Access", customer: "Access", action: "Edit Roles" },
//    { feature: "Add Courses", admin: "Access", astrologer: "Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
//    { feature: "Payment Reports", admin: "Access", astrologer: "Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
//    { feature: "Manage Consultations", admin: "Access", astrologer: "Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
//    { feature: "Post Reviews", admin: "Not Access", astrologer: "Not Access", student: "Access", customer: "Access", action: "Edit Roles" },
//    { feature: "Manage Users", admin: "Access", astrologer: "Not Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
//    { feature: "View Orders", admin: "Access", astrologer: "Not Access", student: "Access", customer: "Access", action: "Edit Roles" },
//    { feature: "Book Sessions", admin: "Access", astrologer: "Not Access", student: "Access", customer: "Access", action: "Edit Roles" },
//    { feature: "Upload Content", admin: "Access", astrologer: "Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
//    { feature: "Manage Inventory", admin: "Access", astrologer: "Not Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
//    { feature: "View Profile", admin: "Access", astrologer: "Access", student: "Access", customer: "Access", action: "Edit Roles" },
//    { feature: "Edit Profile", admin: "Access", astrologer: "Access", student: "Access", customer: "Access", action: "Edit Roles" },
//    { feature: "Delete Account", admin: "Access", astrologer: "Not Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
//    { feature: "Send Notifications", admin: "Access", astrologer: "Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
//    { feature: "Download Reports", admin: "Access", astrologer: "Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
//    { feature: "Message Support", admin: "Access", astrologer: "Access", student: "Access", customer: "Access", action: "Edit Roles" },
//    { feature: "Schedule Events", admin: "Access", astrologer: "Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
//    { feature: "View Certificates", admin: "Access", astrologer: "Access", student: "Access", customer: "Not Access", action: "Edit Roles" },
//    { feature: "Generate Coupons", admin: "Access", astrologer: "Not Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
//    { feature: "Access Library", admin: "Access", astrologer: "Access", student: "Access", customer: "Access", action: "Edit Roles" },
//  ];

//  function PermissionsManager() {
//    const [currentPage, setCurrentPage] = useState(1);
//    const [permissions, setPermissions] = useState(PermissionsData);
//    const [editingIndex, setEditingIndex] = useState(null);
//    const [editedRow, setEditedRow] = useState({});

//    const rowsPerPage = 9;
//    const totalPages = Math.ceil(permissions.length / rowsPerPage);

//    const indexOfLastItem = currentPage * rowsPerPage;
//    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
//    const currentItems = permissions.slice(indexOfFirstItem, indexOfLastItem);

//    const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
//    const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//    const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

//    const handleEdit = (index, item) => {
//      setEditingIndex(index);
//      setEditedRow({ ...item });
//    };

//    const handleChange = (role, value) => {
//      setEditedRow((prev) => ({ ...prev, [role]: value }));
//    };

//    const handleSave = (index) => {
//      const updated = [...permissions];
//      updated[index + indexOfFirstItem] = editedRow;
//      setPermissions(updated);
//      setEditingIndex(null);
//      setEditedRow({});
//    };

//    const renderRoleCell = (value, roleKey, isEditing) => {
//      return isEditing ? (
//        <select
//          value={editedRow[roleKey]}
//          onChange={(e) => handleChange(roleKey, e.target.value)}
//          className="border rounded px-2 py-1 text-sm"
//        >
//          <option>Access</option>
//          <option>Not Access</option>
//        </select>
//      ) : (
//        <p
//          className={`w-[70px] font-[530] text-[13px] text-start  ${
//            value === "Access" ? "text-[#189200]" : "text-[#BB0E00]"
//          }`}
//        >
//          {value === "Not Access" ? (
//           <span className="flex flex-col  leading-tight">
//              <span>Not</span>
//              <span>Access</span>
//           </span>
//          ) : (
//            value
//          )}
//        </p>
//      );
//    };

//    return (
//      <>
//        <div className="border border-[#E1E1E1] rounded-[15px] bg-[#F8F8F8] shadow-[0_0_15px_rgba(0,0,0,0.1)] p-[15px]">
//          <div className="border border-[#E1E1E1] rounded-[15px] bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] flex flex-col justify-center items-center">
//            {/* Header */}
//            <div className="flex flex-row justify-between items-center h-[47px] self-stretch border-b border-[#E1E1E1] px-[15px]">
//              <h3 className="flex justify-center items-center">Feature</h3>
//              <h3 className="flex justify-center items-center pl-[60px]">Admin</h3>
//              <h3 className="flex justify-center items-center pl-[25px]">Astrologer</h3>
//              <h3 className="flex justify-center items-center pr-[15px]">Student</h3>
//              <h3 className="flex justify-center items-center">Customer</h3>
//              <h3 className="flex justify-center items-center mr-[50px]">Action</h3>
//            </div>

//            {/* Rows */}
//            {currentItems.map((item, index) => {
//              const isEditing = editingIndex === index;
//              return (
//                <div
//                  key={index}
//                  className="flex flex-row justify-between items-center h-[47px] self-stretch border-b border-[#E1E1E1] px-[15px]"
//                >
//                  {/* Feature name */}
//                  <p className="w-[120px] text-[rgba(0,0,0,0.70)] font-normal text-[13px] leading-[17px]">
//                    {item.feature}
//                  </p>

//                  {/* Admin */}
//                  {renderRoleCell(item.admin, "admin", isEditing)}

//                  {/* Astrologer */}
//                  {renderRoleCell(item.astrologer, "astrologer", isEditing)}

//                  {/* Student */}
//                  {renderRoleCell(item.student, "student", isEditing)}

//                  {/* Customer */}
//                  {renderRoleCell(item.customer, "customer", isEditing)}

//                  {/* Action */}
//                  {isEditing ? (
//                    <button
//                      onClick={() => handleSave(index)}
//                      className="border border-[#BB0E00] rounded-[5px] bg-gradient-to-b from-[#BB0E00] to-[#B94400] text-white text-[12px] leading-[16px] px-4 py-1 w-[96px] h-[31px] flex justify-center items-center"
//                    >
//                      Save
//                    </button>
//                  ) : (
//                    <button
//                      onClick={() => handleEdit(index, item)}
//                      className="border border-[#BB0E00] rounded-[5px] bg-gradient-to-b from-[#BB0E00] to-[#B94400] text-white text-[12px] leading-[16px] px-4 py-1 w-[96px] h-[31px] flex justify-center items-center"
//                    >
//                      Edit Roles
//                    </button>
//                  )}
//                </div>
//              );
//            })}
//          </div>
//        </div>

//        {/* Pagination Controls */}
//        <div className="flex justify-center my-[20px]">
//          <button
//            onClick={handlePrev}
//            disabled={currentPage === 1}
//            className="disabled:bg-[#ddd] disabled:cursor-not-allowed"
//          >
//            <MdKeyboardArrowLeft size={40} />
//          </button>
//          {Array.from({ length: totalPages }, (_, i) => (
//            <button
//              key={i}
//              onClick={() => handlePageClick(i + 1)}
//              className={`${
//                currentPage === i + 1
//                  ? "bg-[#BB0E00] text-white border-none px-[20px] py-[10px] mx-[5px] cursor-pointer rounded-[5px]"
//                  : "bg-[#E2E1E1] text-white border-none px-[20px] py-[10px] mx-[5px] cursor-pointer rounded-[5px]"
//              }`}
//            >
//              {i + 1}
//            </button>
//          ))}
//          <button
//            onClick={handleNext}
//            disabled={currentPage === totalPages}
//            className="disabled:bg-[#ddd] disabled:cursor-not-allowed"
//          >
//            <MdOutlineKeyboardArrowRight size={40} />
//          </button>
//        </div>
//      </>
//    );
//  }

//  export default PermissionsManager;


import React, { useState } from "react";
import { MdOutlineKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";

const PermissionsData = [
  { feature: "View Dashboard", admin: "Access", astrologer: "Access", student: "Access", customer: "Access", action: "Edit Roles" },
  { feature: "Add Courses", admin: "Access", astrologer: "Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
  { feature: "Payment Reports", admin: "Access", astrologer: "Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
  { feature: "Manage Consultations", admin: "Access", astrologer: "Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
  { feature: "Post Reviews", admin: "Not Access", astrologer: "Not Access", student: "Access", customer: "Access", action: "Edit Roles" },
  { feature: "Manage Users", admin: "Access", astrologer: "Not Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
  { feature: "View Orders", admin: "Access", astrologer: "Not Access", student: "Access", customer: "Access", action: "Edit Roles" },
  { feature: "Book Sessions", admin: "Access", astrologer: "Not Access", student: "Access", customer: "Access", action: "Edit Roles" },
  { feature: "Upload Content", admin: "Access", astrologer: "Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
  { feature: "Manage Inventory", admin: "Access", astrologer: "Not Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
  { feature: "View Profile", admin: "Access", astrologer: "Access", student: "Access", customer: "Access", action: "Edit Roles" },
  { feature: "Edit Profile", admin: "Access", astrologer: "Access", student: "Access", customer: "Access", action: "Edit Roles" },
  { feature: "Delete Account", admin: "Access", astrologer: "Not Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
  { feature: "Send Notifications", admin: "Access", astrologer: "Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
  { feature: "Download Reports", admin: "Access", astrologer: "Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
  { feature: "Message Support", admin: "Access", astrologer: "Access", student: "Access", customer: "Access", action: "Edit Roles" },
  { feature: "Schedule Events", admin: "Access", astrologer: "Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
  { feature: "View Certificates", admin: "Access", astrologer: "Access", student: "Access", customer: "Not Access", action: "Edit Roles" },
  { feature: "Generate Coupons", admin: "Access", astrologer: "Not Access", student: "Not Access", customer: "Not Access", action: "Edit Roles" },
  { feature: "Access Library", admin: "Access", astrologer: "Access", student: "Access", customer: "Access", action: "Edit Roles" },
];

function PermissionsManager() {
  const [currentPage, setCurrentPage] = useState(1);
  const [permissions, setPermissions] = useState(PermissionsData);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedRow, setEditedRow] = useState({});

  const rowsPerPage = 9;
  const totalPages = Math.ceil(permissions.length / rowsPerPage);

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = permissions.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (index, item) => {
    setEditingIndex(index);
    setEditedRow({ ...item });
  };

  const handleChange = (role, value) => {
    setEditedRow((prev) => ({ ...prev, [role]: value }));
  };

  const handleSave = (index) => {
    const updated = [...permissions];
    updated[index + indexOfFirstItem] = editedRow;
    setPermissions(updated);
    setEditingIndex(null);
    setEditedRow({});
  };

  const renderRoleCell = (value, roleKey, isEditing) => {
    return isEditing ? (
      <select
        value={editedRow[roleKey]}
        onChange={(e) => handleChange(roleKey, e.target.value)}
        className="border rounded px-2 py-1 text-sm"
      >
        <option>Access</option>
        <option>Not Access</option>
      </select>
    ) : (
      <p
        className={`w-[70px] font-[530] text-[13px] text-start ${
          value === "Access" ? "text-[#189200]" : "text-[#BB0E00]"
        }`}
      >
        {value === "Not Access" ? (
          <span className="flex flex-col leading-tight">
            <span>Not</span>
            <span>Access</span>
          </span>
        ) : (
          value
        )}
      </p>
    );
  };

  return (
    <>
      <div className="border border-[#E1E1E1] rounded-[15px] bg-[#F8F8F8] shadow-[0_0_15px_rgba(0,0,0,0.1)] p-[15px]">
        <div className="border border-[#E1E1E1] rounded-[15px] bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Header */}
            <div className="flex flex-row justify-between items-center h-[47px] self-stretch border-b border-[#E1E1E1] px-[15px]">
              <h3 className="flex justify-center items-center">Feature</h3>
              <h3 className="flex justify-center items-center pl-[60px]">Admin</h3>
              <h3 className="flex justify-center items-center pl-[25px]">Astrologer</h3>
              <h3 className="flex justify-center items-center pr-[15px]">Student</h3>
              <h3 className="flex justify-center items-center">Customer</h3>
              <h3 className="flex justify-center items-center mr-[50px]">Action</h3>
            </div>

            {/* Rows */}
            {currentItems.map((item, index) => {
              const isEditing = editingIndex === index;
              return (
                <div
                  key={index}
                  className="flex flex-row justify-between items-center h-[47px] self-stretch border-b border-[#E1E1E1] px-[15px]"
                >
                  {/* Feature name */}
                  <p className="w-[120px] text-[rgba(0,0,0,0.70)] font-normal text-[13px] leading-[17px]">
                    {item.feature}
                  </p>

                  {/* Admin */}
                  {renderRoleCell(item.admin, "admin", isEditing)}

                  {/* Astrologer */}
                  {renderRoleCell(item.astrologer, "astrologer", isEditing)}

                  {/* Student */}
                  {renderRoleCell(item.student, "student", isEditing)}

                  {/* Customer */}
                  {renderRoleCell(item.customer, "customer", isEditing)}

                  {/* Action */}
                  {isEditing ? (
                    <button
                      onClick={() => handleSave(index)}
                      className="border border-[#BB0E00] rounded-[5px] bg-gradient-to-b from-[#BB0E00] to-[#B94400] text-white text-[12px] leading-[16px] px-4 py-1 w-[96px] h-[31px] flex justify-center items-center"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(index, item)}
                      className="border border-[#BB0E00] rounded-[5px] bg-gradient-to-b from-[#BB0E00] to-[#B94400] text-white text-[12px] leading-[16px] px-4 py-1 w-[96px] h-[31px] flex justify-center items-center"
                    >
                      Edit Roles
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center my-[20px]">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="disabled:bg-[#ddd] disabled:cursor-not-allowed"
        >
          <MdKeyboardArrowLeft size={40} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageClick(i + 1)}
            className={`${
              currentPage === i + 1
                ? "bg-[#BB0E00] text-white border-none px-[20px] py-[10px] mx-[5px] cursor-pointer rounded-[5px]"
                : "bg-[#E2E1E1] text-black border-none px-[20px] py-[10px] mx-[5px] cursor-pointer rounded-[5px]"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="disabled:bg-[#ddd] disabled:cursor-not-allowed"
        >
          <MdOutlineKeyboardArrowRight size={40} />
        </button>
      </div>
    </>
  );
}

export default PermissionsManager;