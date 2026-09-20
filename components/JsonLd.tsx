import { site, siteUrl } from "@/lib/site";

export type JsonLdData = Record<string, unknown>;

const organizationId = `${siteUrl}/#organization`;

export function websiteJsonLd(): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: site.name,
        url: siteUrl,
        telephone: site.phoneLabel,
        sameAs: site.socialUrls,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: site.name,
        inLanguage: "ru-RU",
        publisher: { "@id": organizationId },
      },
    ],
  };
}

export function restaurantJsonLd(): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${siteUrl}/cafe#restaurant`,
    name: "Кафе «Карьер»",
    url: `${siteUrl}/cafe`,
    menu: `${siteUrl}/menu`,
    image: `${siteUrl}/images/cafe-hero.webp`,
    description:
      "Кафе «Карьер» на Константиновских карьерах в Твери.",
    telephone: site.phoneLabel,
    openingHours: "Mo-Su 10:00-22:00",
    servesCuisine: "Современная русская кухня",
    priceRange: "₽₽",
    acceptsReservations: true,
    parentOrganization: { "@id": organizationId },
    potentialAction: {
      "@type": "ReserveAction",
      target: site.bookingUrl,
    },
  };
}

export function serviceJsonLd(
  name: string,
  path: "/bathhouse" | "/rental",
  description: string,
): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}${path}#service`,
    name,
    url: `${siteUrl}${path}`,
    description,
    areaServed: { "@type": "City", name: "Тверь" },
    provider: { "@id": organizationId },
  };
}

export function JsonLd({ data }: { data: JsonLdData }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
