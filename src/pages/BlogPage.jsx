import React from "react";
import SEO from "../components/SEO";
import BlogsComponent from "../components/Blogs/Blogs";

const BlogPage = () => {
  return (
    <>
      {/* ===== SEO ONLY ===== */}
      <SEO
        title="Vastu Blog | Vastu, Astrology & Numerology Insights"
        description="Read expert blogs on Vastu Shastra, Astrology and Numerology for home, office and life balance."
        keywords="vastu blog, vastu shastra articles, astrology blog, numerology blog"
        canonical="https://vastuguru.cloud/vastu-blog"
      />

      {/* ===== ORIGINAL BLOG DESIGN ===== */}
      <BlogsComponent />
    </>
  );
};

export default BlogPage;
