import { useState } from "react";

function Thumbnail() {
  const [image, setImage] = useState(null);

  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);
    }
  };

  // Trigger file input when button is clicked
  const handleButtonClick = () => {
    document.getElementById("thumbnailInput").click();
  };

  return (
    <div className="border-[1.5px] border-dashed border-[#BB0E00] mt-4 xs:mt-6 sm:mt-8 lg:mt-[45px] flex justify-center py-6 xs:py-8 sm:py-12 lg:py-[63px] mx-2 xs:mx-3 sm:mx-4 lg:mx-0">
      <div className="w-full max-w-[100px] xs:max-w-[110px] sm:max-w-[120px] lg:max-w-[130px] flex flex-col items-center gap-2 xs:gap-2.5 sm:gap-3 lg:gap-[15px]">
        <input
          id="thumbnailInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {image ? (
          <img
            src={image}
            alt="Thumbnail"
            className="w-12 xs:w-14 sm:w-16 lg:w-[73px] h-auto rounded-[8px] xs:rounded-[9px] sm:rounded-[10px] lg:rounded-[10px] object-cover"
          />
        ) : (
          <button
            onClick={handleButtonClick}
            className="border border-red-500 w-12 xs:w-14 sm:w-16 lg:w-[73px] h-9 xs:h-11 sm:h-12 lg:h-[55px] px-2 xs:px-3 sm:px-4 lg:px-[15px] py-2 xs:py-2.5 sm:py-3 lg:py-[12px] rounded-[8px] xs:rounded-[9px] sm:rounded-[10px] lg:rounded-[10px] hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-200 text-red-500 font-semibold text-base xs:text-lg sm:text-xl lg:text-2xl"
          >
            +
          </button>
        )}

        <p className="text-[#BB0E00] text-xs xs:text-sm sm:text-base lg:text-[18px] font-medium leading-tight xs:leading-normal sm:leading-relaxed lg:leading-[22px] text-center">
          Add Thumbnail
        </p>
      </div>
    </div>
  );
}

export default Thumbnail;
