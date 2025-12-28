import { FaStar } from "react-icons/fa";
function CommentSection() {
  return (
    <>
      {/* Comments Section */}
      <div className="w-[75%] mx-auto mt-10 ">
        <h1>Comments</h1>
        <div className="border border-[#f5f5f5] bg-[#FCFCFC] p-4 rounded-[10px] ">
          {[1, 2].map((item, index) => (
            <div key={index} className="mb-5">
              <div className="flex items-center gap-5 mb-2">
                <img
                  src="/images/Men.png"
                  alt="User"
                  className="w-[60px] h-[60px]"
                />
                <div>
                  <h4>Varun B</h4>
                  <span className="inline-flex items-center gap-1">
                    <FaStar size={10} color="#FF8C00" />
                    <FaStar size={10} color="#FF8C00" />
                    <FaStar size={10} color="#FF8C00" />
                    <FaStar size={10} color="#FF8C00" />
                    <FaStar size={10} color="#FF8C00" />
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#333]">
                Lorem ipsum, dolor sit amet consectetur. <br />
                Possimus in deleniti rerum
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default CommentSection;
