import { absoluteUrl, businessInfo, siteDescription, siteName, siteUrl } from "@/lib/site";

/**
 * Site-wide JSON-LD. Rendered once in the root layout so every page carries a
 * `LocalBusiness` (the card Google shows for local searches like "aluguel de
 * plataforma 360 São José dos Campos") plus a `WebSite` node.
 */
export function StructuredData() {
  const businessId = `${siteUrl}/#business`;

  const address: Record<string, string> = {
    "@type": "PostalAddress",
    addressLocality: businessInfo.address.locality,
    addressRegion: businessInfo.address.region,
    addressCountry: businessInfo.address.country,
  };
  if (businessInfo.address.streetAddress) address.streetAddress = businessInfo.address.streetAddress;
  if (businessInfo.address.postalCode) address.postalCode = businessInfo.address.postalCode;

  const graph = [
    {
      "@type": "LocalBusiness",
      "@id": businessId,
      name: siteName,
      legalName: businessInfo.legalName,
      description: siteDescription,
      url: siteUrl,
      telephone: businessInfo.telephone,
      image: absoluteUrl("/images/logo/logo-fl.png"),
      logo: absoluteUrl("/images/logo/logo-fl.png"),
      priceRange: "$$",
      address,
      geo: {
        "@type": "GeoCoordinates",
        latitude: businessInfo.geo.latitude,
        longitude: businessInfo.geo.longitude,
      },
      areaServed: businessInfo.areaServed.map((city) => ({
        "@type": "City",
        name: city,
      })),
      openingHours: businessInfo.openingHours,
      sameAs: businessInfo.sameAs,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Atrações para festas e eventos",
        itemListElement: [
          "Plataforma 360",
          "Cama elástica",
          "Fotografia profissional para eventos",
          "Totem fotográfico",
        ].map((service) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: service },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      inLanguage: "pt-BR",
      publisher: { "@id": businessId },
    },
  ];

  const json = { "@context": "https://schema.org", "@graph": graph };

  return (
    <script
      type="application/ld+json"
      // Content is fully static and built from our own config — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
