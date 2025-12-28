import React from "react";
import SEO from "../components/SEO";
import BookOverview from "../components/BookService/BookOverview";

const Books = () => {
  return (
    <>
      {/* ===== SEO ===== */}
      <SEO
        title="Occult, Vastu, Astrology & Numerology Books"
        description="Explore authentic books including The Journey Of Vastu Shastra, 45 Energy Fields Of Vastu Purush Mandala, Numero Sutras, Vastu Tips And Remedies, and Chaldean Numerology And Lo Shu Grid."
        keywords="vastu books, numerology books, occult books, chaldean numerology, lo shu grid"
        canonical="https://vastuguru.cloud/occult-vastu-astro-numero-books"
      />

      {/* ===== ORIGINAL WORKING BOOKS UI ===== */}
      <BookOverview />
    </>
  );
};

export default Books;
