import React, { useMemo } from "react";
import { FaStar } from "react-icons/fa";
import { BiSolidQuoteAltLeft } from "react-icons/bi";
import { useTestimonialsQuery } from "../../hooks/useTestimonialsApi";
import testimonialImg from "../../assets/testimonial.svg";

const TestimonialsSection = () => {
  const { data: testimonials = [], isLoading, error } = useTestimonialsQuery();

  // Memoize filtered testimonials to prevent recalculation on every render
  const approvedTestimonials = useMemo(() => {
    return testimonials
      .filter((testimonial) => testimonial.status === "approved")
      .slice(0, 6);
  }, [testimonials]);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              What Our <span className="text-[#BB0E00]">Customers Say</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Read testimonials from our satisfied customers who have
              experienced transformation through our astrology and vastu
              services
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 rounded-lg h-64"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || approvedTestimonials.length === 0) {
    return null; // Don't show section if there's an error or no testimonials
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            What Our <span className="text-[#BB0E00]">Customers Say</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read testimonials from our satisfied customers who have experienced
            transformation through our astrology and vastu services
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {approvedTestimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-3 -left-3 bg-[#BB0E00] rounded-full p-2">
                <BiSolidQuoteAltLeft className="text-white text-xl" />
              </div>

              {/* Customer Info */}
              <div className="flex items-center mb-4 mt-2">
                {testimonial.image && (
                  <img
                    src={testimonial.image || testimonialImg}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                    loading="lazy"
                  />
                )}

                <div>
                  <h4 className="font-semibold text-gray-800">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">To: {testimonial.to}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < testimonial.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    } w-4 h-4 mr-1`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  ({testimonial.rating}/5)
                </span>
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 italic leading-relaxed">
                "{testimonial.feedback}"
              </p>
            </div>
          ))}
        </div>

        {/* View More Link (optional - could link to dedicated testimonials page) */}
        {testimonials.filter((t) => t.status === "approved").length > 6 && (
          <div className="text-center mt-12">
            <p className="text-gray-600">
              And many more satisfied customers...
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
