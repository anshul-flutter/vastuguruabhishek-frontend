import React, { useState, useEffect } from "react";
import axios from "axios";
import { ServiceCard } from "../components/common/cards";
import { useAppSelector } from "../store/hooks";
import { selectCurrentUser } from "../store/slices/authSlice";
import { ROLES } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useAddToCartMutation, useCartQuery } from "../hooks/useCartApi";
import toast from "react-hot-toast";
import SEO from "../components/SEO";

/* =====================================================
   🔹 SERVICE-WISE SEO CONFIG (HAR PAGE ALAG)
   ===================================================== */
const SERVICE_SEO_CONFIG = {
  "vastu-for-home": {
    title: "Vastu for Home | Peace, Health & Prosperity",
    description:
      "Get expert Vastu for home consultation to improve peace, health, relationships and financial prosperity.",
    keywords:
      "vastu for home, home vastu consultation, residential vastu, vastu expert for house",
  },

  "vastu-for-office": {
    title: "Vastu for Office | Growth, Success & Productivity",
    description:
      "Professional Vastu for office consultation to enhance business growth, leadership and employee productivity.",
    keywords:
      "vastu for office, office vastu consultation, corporate vastu, business vastu expert",
  },

  "vastu-for-factory-commercial-units": {
    title: "Vastu for Factory & Commercial Units | Business Expansion",
    description:
      "Specialized Vastu consultation for factories, warehouses and commercial units to boost profits and stability.",
    keywords:
      "factory vastu, commercial vastu, industrial vastu, warehouse vastu consultant",
  },

  "numerologyconsultation": {
    title: "Numerology Consultation | Life Path & Destiny Analysis",
    description:
      "Personalized numerology consultation to understand destiny numbers, career direction and life opportunities.",
    keywords:
      "numerology consultation, numerology expert, destiny number, name numerology",
  },

  "astrology-consultation": {
    title: "Astrology Consultation | Horoscope & Life Guidance",
    description:
      "Accurate astrology consultation for career, marriage, health and important life decisions.",
    keywords:
      "astrology consultation, astrologer, horoscope reading, vedic astrology expert",
  },
};

/* =====================================================
   🔹 MAIN COMPONENT
   ===================================================== */
const ServicePackagesPage = ({
  title,
  serviceType = "package",
  category = "astrology",
  subCategory = null,
}) => {
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
  const isAdmin =
    currentUser?.role === ROLES.ASTROLOGER ||
    currentUser?.role === ROLES.ADMIN;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCartId, setAddingToCartId] = useState(null);

  /* =====================================================
     🔹 SEO LOGIC (URL SLUG BASED)
     ===================================================== */
  const getSeoData = () => {
    const slug = window.location.pathname.replace("/", "");
    const seo = SERVICE_SEO_CONFIG[slug];

    return {
      title: seo?.title || `${title} | Vastu Guru`,
      description:
        seo?.description ||
        `Book ${title.toLowerCase()} with expert guidance for growth and success.`,
      keywords:
        seo?.keywords ||
        `${category} consultation, ${category} expert, online ${category} consultation`,
      canonical: `https://vastuguru.cloud/${slug}`,
    };
  };

  const seo = getSeoData();

  /* =====================================================
     🔹 CART
     ===================================================== */
  const { mutate: addToCart } = useAddToCartMutation();
  const { data: cartData } = useCartQuery(undefined, {
    skip: !currentUser || isAdmin,
  });

  const isServiceInCart = (serviceId) => {
    const items = cartData?.items;
    if (!items || !serviceId) return false;
    return items.some(
      (item) =>
        (item.productId === serviceId || item.itemId === serviceId) &&
        (item.kind === "Service" || item.itemType === "Service")
    );
  };

  /* =====================================================
     🔹 FETCH SERVICES
     ===================================================== */
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          serviceType,
          category,
          isActive: "true",
        });

        if (subCategory) {
          params.append("subCategory", subCategory);
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/services?${params.toString()}`
        );

        const sortedServices = (response.data.data || []).sort(
          (a, b) => a.price - b.price
        );

        setServices(sortedServices);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load services. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [title, serviceType, category, subCategory]);

  /* =====================================================
     🔹 ADD TO CART
     ===================================================== */
  const handleAddToCart = (service) => {
    if (!currentUser) {
      toast("Please log in to continue", { icon: "🔐" });
      navigate("/auth/login", {
        state: { from: { pathname: window.location.pathname } },
      });
      return;
    }

    if (isServiceInCart(service._id)) {
      navigate("/cart");
      return;
    }

    setAddingToCartId(service._id);

    addToCart(
      {
        itemId: service._id,
        itemType: "Service",
        quantity: 1,
      },
      {
        onSuccess: () => setAddingToCartId(null),
        onError: () => {
          setAddingToCartId(null);
          toast.error("Failed to add to cart");
        },
      }
    );
  };

  /* =====================================================
     🔹 UI STATES
     ===================================================== */
  if (loading) {
    return (
      <>
        <SEO {...seo} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-red-600 rounded-full"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEO {...seo} />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      </>
    );
  }

  /* =====================================================
     🔹 MAIN RENDER
     ===================================================== */
  return (
    <>
      <SEO
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonical={seo.canonical}
      />

      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-10">{title}</h1>

          <div className="flex flex-wrap justify-center gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                isAdmin={isAdmin}
                onAddToCart={handleAddToCart}
                isAddingToCart={addingToCartId === service._id}
                isInCart={isServiceInCart(service._id)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicePackagesPage;
