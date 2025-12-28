import React from "react";
import SEO from "../components/SEO";
import ContactComponent from "../components/Contact/Contact";

const Contact = () => {
  return (
    <>
      <SEO
        title="Contact Us | Book Vastu, Astrology & Numerology Consultation"
        description="Contact us to book Vastu, Astrology or Numerology consultation with expert guidance."
        keywords="contact vastu consultant, astrology consultation contact, numerology expert"
        canonical="https://vastuguru.cloud/contact"
      />

      {/* ORIGINAL DESIGN – untouched */}
      <ContactComponent />
    </>
  );
};

export default Contact;
