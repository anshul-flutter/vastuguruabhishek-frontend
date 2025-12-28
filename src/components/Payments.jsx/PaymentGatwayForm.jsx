import { useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { FaGripVertical } from "react-icons/fa6";
import AdminLayout from "../../Layout/AdminLayout";

export default function PaymentGatewayForm() {
  const [status, setStatus] = useState(false);

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="p-6 bg-white shadow-lg rounded-xl mt-7">
          <h2 className="text-xl font-semibold mb-4">
            Enter The Details To Create Payment Gateway
          </h2>

          <p className="text-black mb-1">Add Payment Details:</p>
          <div className="flex items-center mb-4">
            <FaGripVertical className="text-gray-400 w-5 h-5 mr-3 cursor-grab" />
            <div className="flex-1 px-3 py-2 rounded-lg shadow-sm bg-white">
              <select className="w-full outline-none bg-transparent text-gray-500">
                <option>Add Gateway Option</option>
                <option>Stripe</option>
                <option>PayPal</option>
                <option>Razorpay</option>
              </select>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <FaGripVertical className="text-gray-400 w-5 h-5 mr-3 cursor-grab" />
            <div className="flex-1 flex items-center px-3 py-2 rounded-lg shadow-sm bg-white">
              <input
                type="text"
                placeholder="Enter Card Number"
                className="w-full outline-none bg-transparent"
              />
              <FiEdit className="text-gray-500 cursor-pointer mx-2 hover:text-blue-600" />
              <FiTrash className="text-gray-500 cursor-pointer hover:text-red-600" />
            </div>
          </div>
          <div className="flex items-center mb-4">
            <FaGripVertical className="text-gray-400 w-5 h-5 mr-3 cursor-grab" />
            <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-lg shadow-sm bg-white">
              <span className="text-gray-500 font-medium">Status</span>
              <button
                onClick={() => setStatus(!status)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  status ? "bg-red-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                    status ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </button>
            </div>
          </div>

          <div className="flex items-center mb-4">
            <FaGripVertical className="text-gray-400 w-5 h-5 mr-3 cursor-grab" />
            <div className="flex-1 flex items-center px-3 py-2 rounded-lg shadow-sm bg-white">
              <input
                type="text"
                placeholder="Add API Key Number"
                className="w-full outline-none bg-transparent"
              />
              <FiEdit className="text-gray-500 cursor-pointer mx-2 hover:text-blue-600" />
              <FiTrash className="text-gray-500 cursor-pointer hover:text-red-600" />
            </div>
          </div>

          <div className="flex items-center">
            <FaGripVertical className="text-gray-400 w-5 h-5 mr-3 cursor-grab" />
            <div className="flex-1 px-3 py-2 rounded-lg shadow-sm bg-white">
              <select className="w-full outline-none bg-transparent text-gray-500">
                <option className="w-50">Create Mode</option>
                <option>Test</option>
                <option>Live</option>
              </select>
            </div>
          </div>
        </div>

        <button className="mt-4 w-40 py-3 bg-gradient-to-r from-[#b73d00] to-[#bb2001] text-white font-medium rounded-lg shadow-md hover:cursor-pointer">
          Save and Update
        </button>
      </div>
    </AdminLayout>
  );
}
