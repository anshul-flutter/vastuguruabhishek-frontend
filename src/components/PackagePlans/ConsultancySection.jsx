import Consultancy from "./Consultancy";

export default function ConsultancySection() {
  return (
    <div className="">
      <h1 className="text-2xl font-bold text-center sm:text-left sm:pl-10">
        Consult with{" "}
        <span className="bg-gradient-to-b from-[#620000] to-[#ac100e] bg-clip-text text-transparent">
          Vastu Abhishek’s
        </span>
      </h1>
      <p className="text-md text-gray-600 mb-4 text-center sm:text-left sm:pl-10">
        Authorized Franchise
      </p>

      <h2 className="text-xl font-semibold mb-4 text-center sm:text-left sm:pl-10">
        For Astrology
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 justify-items-center gap-6 mb-6 sm:pl-10">
        {[...Array(5)].map((_, i) => (
          <Consultancy key={`astro-${i}`} />
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4 text-center sm:text-left sm:pl-10 ">
        For Numerology
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 justify-items-center gap-6 mb-6 sm:pl-10">
        {[...Array(5)].map((_, i) => (
          <Consultancy key={`num-${i}`} />
        ))}
      </div>
      <h2 className="text-xl font-semibold mb-4 text-center sm:text-left sm:pl-10">
        For Vastu
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 justify-items-center gap-6 mb-6 sm:pl-10">
        {[...Array(5)].map((_, i) => (
          <Consultancy key={`vastu-${i}`} />
        ))}
      </div>
    </div>
  );
}
