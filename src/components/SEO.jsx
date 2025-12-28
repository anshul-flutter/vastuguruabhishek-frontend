import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "Vastu Abhishek",
  description = "Expert vastu consultation for home, office and business.",
  keywords = "vastu, vastu consultant, vastu shastra",
  canonical = "",
}) => {
  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
};

export default SEO;
