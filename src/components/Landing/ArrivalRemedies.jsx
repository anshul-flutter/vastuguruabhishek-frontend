import React from "react";

const ArrivalRemedies = () => {
  const cards = [
    {
      color: "#b10000",
      bg: "#FFC9C9",
      image: "/images/bracellete.png",
    },
    {
      color: "#0064b1",
      bg: "#C9E7FF",
      image: "/images/bracellete.png",
    },
    {
      color: "#b17600",
      bg: "#FFF1C9",
      image: "/images/bracellete.png",
    },
  ];

  return (
    <section className="py-16 px-5 bg-white">
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          New Arrival Remedies
        </h2>
      </div>

      {/* Full frame */}
      <div className="flex flex-wrap justify-center gap-[30px] max-w-[977.89px] mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            className="relative rounded-[7.02px] p-5 flex flex-col justify-center text-center shadow-[0_8px_20px_rgba(0,0,0,0.1)] overflow-hidden transform-gpu transition-transform duration-500 ease-in-out hover:scale-105 hover:rotate-y-[5deg] hover:shadow-[0_25px_45px_rgba(0,0,0,0.2)] [transform-style:preserve-3d] items-center"
            style={{
              width: "305.96px",
              height: "261.05px",
              background: card.bg,
            }}
          >
            {/* Group 2 (rotated translucent shape) */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: "150px",
                height: "150px",
                bottom: "0px",
                right: "0px",
                background: "rgba(255,255,255,0.33)",
                transform: "rotate(180deg)",
              }}
            >
              <img
                src={card.image}
                alt="Bracelet"
                className="w-[100px] mt-2 z-10 opacity-80"
              />
            </div>

            {/* Group 3 (top translucent shape) */}
            <div
              className="absolute pointer-events-none p-6"
              style={{
                width: "150px",
                height: "150px",
                top: "0px",
                left: "0px",
                background: "rgba(255,255,255,0.33)",
              }}
            >
              <img
                src={card.image}
                alt="Bracelet"
                className="w-[100px] h-auto mt-2 z-10 opacity-80"
              />
            </div>

            {/* Text content */}
            <div className="backdrop-blur-[2px] bg-white/30 h-[80%] w-[80%] rounded-md flex flex-col justify-center">
              <h4
                className="text-gray-800 font-semibold text-sm mb-1 relative z-10"
                style={{ color: card.color }}
              >
                BRACELETS
              </h4>
              <h2
                className="text-3xl font-bold text-gray-900 mb-1 relative z-10"
                style={{ color: card.color }}
              >
                <span>30</span> – <span>60</span>{" "}
                <span
                  className="text-sm font-normal text-gray-600"
                  style={{ color: card.color }}
                >
                  %
                </span>{" "}
                <span className="text-sm">OFF</span>
              </h2>
              <p
                className="text-sm text-gray-600 mb-2 relative z-10"
                style={{ color: card.color }}
              >
                Starting ₹500
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ArrivalRemedies;
