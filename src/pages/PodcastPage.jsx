import React from "react";
import SEO from "../components/SEO";
import Podcasts from "../components/Podcasts/Podcasts";

const PodcastPage = () => {
  return (
    <>
      {/* ===== SEO ===== */}
      <SEO
        title="Podcast | Vastu, Astrology & Numerology Talks"
        description="Listen to powerful podcasts on Vastu, Astrology and Numerology for personal and professional growth."
        keywords="vastu podcast, astrology podcast, numerology podcast, spiritual podcast"
        canonical="https://vastuguru.cloud/podcast"
      />

      {/* ===== REAL PODCAST VIDEOS ===== */}
      <Podcasts isHomePage={false} />
    </>
  );
};

export default PodcastPage;
