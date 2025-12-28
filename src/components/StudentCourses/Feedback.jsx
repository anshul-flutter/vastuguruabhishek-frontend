import React from "react";
import { GoDotFill } from "react-icons/go";
import { IoIosStar } from "react-icons/io";

const Feedback = ({ crsDetails }) => {
  const instructor = crsDetails?.instructors?.[0];
  const review = instructor?.reviews?.[0];

  if (!instructor) {
    return (
      <div className="m-[1.5rem]">
        <h2 className="text-lg font-semibold">Feedback</h2>
        <p className="text-gray-500">No feedback available.</p>
      </div>
    );
  }

  return (
    <div className="m-[1.5rem]">
      {/* Rating + Students */}
      <div className="flex items-center gap-[5px] text-lg max-w-[600px] border-b-2 border-gray-400 mb-[5px]">
        <IoIosStar className="text-yellow-500 mb-[5px]" size={23} />{" "}
        <span className="font-semibold">{instructor.rating || 0}</span>
        Ratings
        <GoDotFill className="text-gray-400" />
        <span className="font-semibold">{instructor.students || 0}</span>{" "}
        Students
      </div>

      {/* First Review */}
      {review ? (
        <div className="flex flex-col mt-[1rem]">
          <p className="font-semibold text-gray-700 leading-tight">
            {review.reviewer}
          </p>
          <p className="text-gray-700 leading-tight">{review.comment}</p>
          <span>
            {[...Array(review.rating || 0)].map((_, i) => (
              <IoIosStar
                key={i}
                className="text-yellow-500 inline-block leading-tight"
              />
            ))}
          </span>
        </div>
      ) : (
        <p className="text-gray-500 mt-[1rem]">No reviews yet.</p>
      )}
    </div>
  );
};

export default Feedback;
