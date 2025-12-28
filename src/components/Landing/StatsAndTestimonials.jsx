// Main/src/components/Landing/StatsAndTestimonials.jsx
import React from "react";
import { BiSolidQuoteAltLeft } from "react-icons/bi";
import { IoIosStar } from "react-icons/io";

const stats = [
  { value: "10K +", label: "Completed Projects" },
  { value: "20K +", label: "Student Trained" },
  { value: "5K +", label: "Order Products" },
  { value: "150 +", label: "Franchise" },
];

const testimonials = [
  {
    name: "Lorem ipsum",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
    image: "/images/astrologer-avatar.png",
    stars: 5,
    colorFrom: "from-blue-400",
    colorTo: "to-red-500",
  },
  {
    name: "Lorem ipsum",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
    image: "/images/astrologer-avatar.png",
    stars: 5,
    colorFrom: "from-red-400",
    colorTo: "to-orange-500",
  },
  {
    name: "Lorem ipsum",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
    image: "/images/astrologer-avatar.png",
    stars: 5,
    colorFrom: "from-red-400",
    colorTo: "to-orange-500",
  },
  {
    name: "Lorem ipsum",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
    image: "/images/astrologer-avatar.png",
    stars: 5,
    colorFrom: "from-red-400",
    colorTo: "to-orange-500",
  },
];

const StatsAndTestimonials = () => {
  return (
    <div className="bg-white">
      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Video */}
          <div className="w-full overflow-hidden rounded-2xl shadow-lg transform transition-transform duration-300">
            <iframe
              className="w-full h-64 md:h-80"
              src="https://www.youtube.com/embed/N6X8ZRJTXKs"
              title="Astro Vastu Course"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          {/* Stats */}
          <div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat, idx) => (
                <div key={idx}>
                  <p className="text-[#BB0E00] text-2xl font-bold">
                    {stat.value}
                  </p>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <img
          src="/images/bottomcurve.png"
          alt=""
          className="absolute bottom-0"
        />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-center text-3xl font-bold mb-12">Testimonials</h2>
          <div className="grid gap-4 max-[450px]:grid-cols-1 max-[800px]:grid-cols-2 max-[1200px]:grid-cols-3  min-[1200px]:grid-cols-4">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-3 hover:shadow-2xl relative"
              >
                <BiSolidQuoteAltLeft
                  size={"3rem"}
                  className={
                    idx % 2 === 0 ? "text-[#cf271a]" : "text-[#188bce]"
                  }
                />
                <img
                  src={`/images/curve${idx % 2 === 0 ? "1" : "2"}.png`}
                  alt=""
                  className="absolute bottom-0 max-[450px]:-bottom-[10%]"
                />
                <div className="p-3 flex flex-col items-center text-center z-1">
                  <p className="text-gray-600 mb-4 z-1">{t.text}</p>
                  <div className="w-16 h-16 rounded-full z-1 overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-white mt-4 font-bold z-1">{t.name}</h4>
                  <div className="flex justify-center mt-2 text-yellow-500 z-1">
                    {[...Array(t.stars)].map((_, i) => (
                      <span key={i}>
                        <IoIosStar size={22} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StatsAndTestimonials;
