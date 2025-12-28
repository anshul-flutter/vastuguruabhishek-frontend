import React from "react";
import { BiSolidQuoteAltLeft } from "react-icons/bi";

const vastuData = [
  {
    name: "Vastu Abhishek",
    title: "Authorized Franchise",
    services: "Numerology, Vastu, Residential",
    rating: 4.9,
    reviews: 5,
    image: "/images/astrologer-avatar.png",
  },
  {
    name: "Vastu Abhishek",
    title: "Authorized Franchise",
    services: "Numerology, Vastu, Residential",
    rating: 4.9,
    reviews: 5,
    image: "/images/astrologer-avatar.png",
  },
  {
    name: "Vastu Abhishek",
    title: "Authorized Franchise",
    services: "Numerology, Vastu, Residential",
    rating: 4.9,
    reviews: 5,
    image: "/images/astrologer-avatar.png",
  },
];

const VastuSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-3xl font-bold mb-2">
          Consult with <span className="text-red-600">Vastu Abhishek's</span>
        </h2>
        <p className="text-gray-600 mb-12">Authorized Franchise</p>

        {/* Cards */}
        <div className="flex justify-center gap-[3rem] flex-wrap">
          {vastuData.map((item, index) => (
            <div className="flex justify-center bg-gradient-to-b from-[#BB0E00] to-[#FFFFFF] p-[2px] shadow-2xl rounded-2xl transition-transform duration-300 hover:-translate-y-2 w-fit">
              {" "}
              <div
                key={index}
                className=" p-4 bg-white  w-[280px] rounded-2xl flex flex-col justify-between"
              >
                {/* Top content */}
                <div className="flex flex-col items-center flex-grow">
                  {/* Profile Image */}
                  <div className="w-24 h-24 mb-4 rounded-full border-2 red-shadow border-[#BB0E00] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-bold text-[#BB0E00] mb-1">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{item.title}</p>

                  {/* Services */}
                  <p className="text-gray-800 mb-4 text-center">
                    {item.services}
                  </p>
                  <div className="h-[1px] w-full bg-gray-300 mb-[.5rem]" />

                  {/* Rating */}
                  <div className="flex justify-center items-center mb-4 text-yellow-500">
                    <span className="mr-1">⭐</span>
                    <span className="font-semibold">{item.rating}</span>
                    <span className="text-gray-500 ml-1">
                      ({item.reviews} reviews)
                    </span>
                  </div>
                </div>

                {/* Button (inside box) */}
                <div className="flex justify-center">
                  <button className="bg-[#BB0E00] cursor-pointer hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VastuSection;
