    // src/components/customer/CustomerCard.jsx


    import React from "react";
    import GradientButton from "../common/GradientButton";
    export default function CustomerCard({
    avatar,
    name,
    phone,
    location,
    customerId,
    onView,
    onEdit,
    }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-soft flex flex-col gap-3 min-w-0">
        {/* Top: avatar + name + meta */}
        <div className="flex items-center gap-3">
            <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full object-cover"
            />
            <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{name}</p>
            <div className="flex items-center gap-3 text-xs text-gray-600 mt-0.5 flex-wrap">
                <span className="flex items-center gap-1">
                <img src="/images/call.png" alt="call" className="w-3.5 h-3.5" />
                {phone}
                </span>
                <span className="flex items-center gap-1">
                <img src="/images/Location.png" alt="Location" className="w-3.5 h-3.5" />
                {location}
                </span>
            </div>
            </div>
        </div>

        {/* Row: CUST ID (left)  +  Actions (right) */}
        <div className="mt-1 flex items-center justify-between gap-2 flex-wrap">
            <div className="text-[11px] text-gray-500">CUST-{customerId}</div>

            <div className="flex items-center gap-2">
            {/* View: solid gradient fill (#BB0E00 -> #B94400) */}
            <button
                onClick={onView}
                className="
                px-3 py-1.5 text-xs rounded-md text-white
                bg-gradient-to-r from-[#BB0E00] to-[#B94400]
                hover:opacity-90 active:opacity-100 transition
                "
            >
                View
            </button>

            {/* Edit: gradient border (#BB0E00 -> #B94400) */}
            <div className="rounded-md p-[1px] bg-gradient-to-r from-[#BB0E00] to-[#B94400]">
                <button
                onClick={onEdit}
                className="
                    px-3 py-1.5 text-xs rounded-[5px]
                    bg-white text-[#BB0E00] hover:bg-red-50 transition
                "
                >
                Edit
                </button>
            </div>
            </div>
        </div>
        </div>
    );
    }
