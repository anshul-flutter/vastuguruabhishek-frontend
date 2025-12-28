import React, { useState, useEffect } from "react";

const AboutVastu = () => {
  const StatsCounter = ({ target, suffix }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const increment = target / 100;
      const timer = setInterval(() => {
        setCount((prev) => {
          if (prev >= target) {
            clearInterval(timer);
            return target;
          }
          return prev + increment;
        });
      }, 20);

      return () => clearInterval(timer);
    }, [target]);

    return (
      <div className="stats-counter">
        {Math.floor(count)}
        {suffix}
      </div>
    );
  };

  return (
    <>
      <section id="about" className="py-20 bg-white">
        {/* About Content */}
        <div className="max-w-7xl flex mx-auto items-center gap-[2rem] max-[750px]:flex-col px-[1rem]">
          {/* Left Card */}
          <div className="bg-gradient-to-br from-red-600 to-orange-400 rounded-xl text-white text-center bg-red-600 max-[500px]:w-[300px] max-[500px]:h-[300px] w-[400px] h-[400px]">
            <img
              src="/images/aboutus.png"
              alt=""
              className="w-full h-full object-contain border-black"
            />
          </div>

          {/* Right Text + Stats */}
          <div className="flex-1/2">
            <h2 className="font-bold text-3xl mb-[1rem]">
              About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#610908] to-[#c41210]">
                Vastu Abhishek
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-tight">
              Dr. Abhishek is a renowned Vastu consultant with over 15 years of
              experience in transforming lives through the ancient science of
              Vastu Shastra. His unique approach combines traditional wisdom
              with modern practicality, making Vastu accessible and effective
              for contemporary living.
            </p>

            {/* Stats Grid */}
            {/* <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <StatsCounter target={10} suffix="k+" />
                <p className="text-gray-500 mt-2">✅ Consulted</p>
              </div>
              <div className="text-center">
                <StatsCounter target={20} suffix="k+" />
                <p className="text-gray-500 mt-2">✅ Students</p>
              </div>
              <div className="text-center">
                <StatsCounter target={50} suffix="k+" />
                <p className="text-gray-500 mt-2">✅ Products</p>
              </div>
              <div className="text-center">
                <StatsCounter target={150} suffix="+" />
                <p className="text-gray-500 mt-2">✅ Countries</p>
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutVastu;
