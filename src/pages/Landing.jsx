import React, { Suspense, lazy } from "react";
import SEO from "../components/SEO";

import Hero from "../components/Landing/Hero";
import Services from "../components/Landing/Services";
import PremiumServices from "../components/Landing/PremiumServices";
import LazyLoadWrapper from "../components/Landing/LazyLoadWrapper";
import "../App.css";
import { useHomeContentQuery } from "../hooks/useHomeContentQuery";

// Lazy load components
const FreeServices = lazy(() => import("../components/Landing/FreeServices"));
const UpcomingEvents = lazy(() =>
  import("../components/Landing/UpcomingEvents")
);
const Podcasts = lazy(() => import("../components/Podcasts/Podcasts"));
const TestimonialsSection = lazy(() =>
  import("../components/Landing/TestimonialsSection")
);
const LetsTalk = lazy(() => import("../components/Landing/LetsTalk"));

// Loading skeleton
const SectionSkeleton = ({ height = "400px" }) => (
  <div
    className="animate-pulse bg-gray-200 rounded-lg mx-4 sm:mx-8 md:mx-16"
    style={{ height, minHeight: height }}
  >
    <div className="flex items-center justify-center h-full text-gray-500">
      Loading...
    </div>
  </div>
);

const Landing = () => {
  const { data: homeContent, isLoading, error } = useHomeContentQuery();

  const servicesData = homeContent?.servicesSection || null;
  const premiumData = homeContent?.premiumSection || null;
  const freeData = homeContent?.freeSection || null;

  return (
    <>
      {/* ===== SEO META TAGS ===== */}

<SEO
      title="Learn Vastu Shastra Online | Certified Vastu Expert | Vastu Abhishek"
      description="Learn Vastu Shastra online with Vastu Abhishek. Become a certified vastu expert and get professional consultation."
      keywords="learn vastu, vastu shastra course, vastu expert"
      canonical="https://vastuguru.cloud/"
    />
     
      {/* Visible sections */}
      <Hero />

      <Services
        content={servicesData}
        loading={isLoading}
        error={error?.message}
      />

      <PremiumServices
        content={premiumData}
        loading={isLoading}
        error={error?.message}
      />

      {/* Lazy loaded sections */}
      <LazyLoadWrapper fallback={<SectionSkeleton height="300px" />} delay={100}>
        <Suspense fallback={<SectionSkeleton height="300px" />}>
          <FreeServices
            content={freeData}
            loading={isLoading}
            error={error?.message}
          />
        </Suspense>
      </LazyLoadWrapper>

      <LazyLoadWrapper fallback={<SectionSkeleton height="450px" />} delay={200}>
        <Suspense fallback={<SectionSkeleton height="450px" />}>
          <UpcomingEvents />
        </Suspense>
      </LazyLoadWrapper>

      <LazyLoadWrapper fallback={<SectionSkeleton height="400px" />} delay={300}>
        <Suspense fallback={<SectionSkeleton height="400px" />}>
          <Podcasts isHomePage={true} />
        </Suspense>
      </LazyLoadWrapper>

      <LazyLoadWrapper fallback={<SectionSkeleton height="500px" />} delay={400}>
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <TestimonialsSection />
        </Suspense>
      </LazyLoadWrapper>

      <LazyLoadWrapper fallback={<SectionSkeleton height="600px" />} delay={500}>
        <Suspense fallback={<SectionSkeleton height="600px" />}>
          <LetsTalk />
        </Suspense>
      </LazyLoadWrapper>
    </>
  );
};

export default Landing;

