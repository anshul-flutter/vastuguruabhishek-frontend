import React, { useEffect, useState } from "react";
import SEO from "../components/SEO";
import { Navigate, useLocation } from "react-router-dom";
import CourseHeader from "../components/StudentCourses/CourseHeader";
import CourseContainer from "../components/StudentCourses/CourseContainer";
import { useAppSelector } from "../store/hooks";
import { selectCurrentUser } from "../store/slices/authSlice";
import { ROLES } from "../utils/constants";

const Course = () => {
  const user = useAppSelector(selectCurrentUser);
  const role = user?.role;

  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const price = (params.get("price") || "").toLowerCase();
    if (price === "free" || price === "paid") {
      setPriceFilter(price);
    }
  }, [location.search]);

  // ✅ FIXED ROLE CHECK
  if (role === ROLES.ADMIN || role === ROLES.ASTROLOGER) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <>
<SEO
  title="Courses | Learn Vastu, Astrology & Numerology"
  description="Join certified courses on Vastu Shastra, Astrology and Numerology and become a professional consultant."
  keywords="vastu courses, astrology courses, numerology courses, vastu training"
  canonical="https://vastuguru.cloud/courses"
/>

      <CourseHeader
        onFilterChange={setFilter}
        onSearchChange={setSearchTerm}
        priceFilter={priceFilter}
        onPriceFilterChange={setPriceFilter}
      />

      <CourseContainer
        filter={filter}
        searchTerm={searchTerm}
        priceFilter={priceFilter}
      />
    </>
  );
};

export default Course;
