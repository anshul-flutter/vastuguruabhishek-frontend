import React from "react";

const FinancialManagement = () => {
  const cards = [
    {
      title: "Full Moon Healing Meditation",
      eventsHeld: 3,
      ticketRevenue: "₹29,000",
      attendees: 92,
    },
    {
      title: "Full Moon Healing Meditation",
      eventsHeld: 3,
      ticketRevenue: "₹29,000",
      attendees: 92,
    },
    {
      title: "Full Moon Healing Meditation",
      eventsHeld: 3,
      ticketRevenue: "₹29,000",
      attendees: 92,
    },
    {
      title: "Full Moon Healing Meditation",
      eventsHeld: 3,
      ticketRevenue: "₹29,000",
      attendees: 92,
    },
    {
      title: "Full Moon Healing Meditation",
      eventsHeld: 3,
      ticketRevenue: "₹29,000",
      attendees: 92,
    },
    {
      title: "Full Moon Healing Meditation",
      eventsHeld: 3,
      ticketRevenue: "₹29,000",
      attendees: 92,
    },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {cards.map((card, index) => (
          <div
            key={index}
            className=" shadow-md p-5 relative 
             rounded-tl-[14.53px] rounded-tr-[14.53px]"
          >
            <h2 className="text-lg font-semibold mb-4 ">{card.title}</h2>
            <div className="space-y-2 text-gray-700">
              <p className="flex justify-between">
                <span>Events Held:</span>
                <span className="font-semibold">{card.eventsHeld}</span>
              </p>
              <p className="flex justify-between">
                <span>Ticket Revenue:</span>
                <span className="font-semibold">{card.ticketRevenue}</span>
              </p>
              <p className="flex justify-between">
                <span>Total Attendees:</span>
                <span className="font-semibold">{card.attendees}</span>
              </p>
            </div>
            <button
              className="w-full mt-4 bg-gradient-to-b from-[#BB0E00] to-[#B94400] text-white font-semibold text-sm py-2 rounded-md 
     shadow-inner border border-[#BB0E00] hover:opacity-90 transition"
            >
              Download Breakdown
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialManagement;
