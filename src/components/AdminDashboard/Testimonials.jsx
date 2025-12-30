import React, { useState } from "react";
import { FaStar, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import testimonialImg from "../../assets/testimonial.svg";
import {
  useAdminTestimonialsQuery,
  useDeleteTestimonialMutation,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
} from "../../hooks/useTestimonialsApi";

const Testimonials = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    to: "Vastu Abhishek",
    rating: 5,
    feedback: "",
    image: "",
  });

  const {
    data: testimonials = [],
    isLoading,
    error,
  } = useAdminTestimonialsQuery();
  const deleteMutation = useDeleteTestimonialMutation();
  const createMutation = useCreateTestimonialMutation();
  const updateMutation = useUpdateTestimonialMutation();

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      to: testimonial.to,
      rating: testimonial.rating,
      feedback: testimonial.feedback,
      image: testimonial.image || "",
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingTestimonial(null);
    setFormData({
      name: "",
      to: "Vastu Abhishek",
      rating: 5,
      feedback: "",
      image: "",
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTestimonial) {
      updateMutation.mutate(
        { id: editingTestimonial._id, testimonialData: formData },
        {
          onSuccess: () => {
            setShowModal(false);
            setEditingTestimonial(null);
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setShowModal(false);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BB0E00] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">
            Error loading testimonials: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Testimonials Management
          </h1>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-[#BB0E00] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            <FaPlus /> Add Testimonial
          </button>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-7xl mx-auto">
        {testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No testimonials found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className="bg-white max-w-75 rounded-lg shadow-md p-5 text-center border border-gray-200 mx-auto relative"
              >
                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    title="Edit"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial._id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                    title="Delete"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>

                {testimonial.image && (
                  <img
                    src={testimonial.image || testimonialImg}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full mx-auto mb-3 object-cover mt-6"
                  />
                )}
                <h3 className="font-semibold text-base">{testimonial.name}</h3>
                <p className="text-center text-[12px] text-black/70 font-normal leading-[12.56px] font-sans">
                  To: {testimonial.to}
                </p>

                <div className="flex justify-center my-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < testimonial.rating
                          ? "text-[#ffaa00]"
                          : "text-gray-300"
                      } w-4 h-4`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-xs mb-3 line-clamp-3">
                  "{testimonial.feedback}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md m-4">
            <h2 className="text-xl font-bold mb-4">
              {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB0E00]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Provider
                </label>
                <input
                  type="text"
                  required
                  value={formData.to}
                  onChange={(e) =>
                    setFormData({ ...formData, to: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB0E00]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rating: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB0E00]"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feedback
                </label>
                <textarea
                  required
                  rows="4"
                  value={formData.feedback}
                  onChange={(e) =>
                    setFormData({ ...formData, feedback: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB0E00]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB0E00]"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTestimonial(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="flex-1 px-4 py-2 bg-[#BB0E00] text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : editingTestimonial
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
