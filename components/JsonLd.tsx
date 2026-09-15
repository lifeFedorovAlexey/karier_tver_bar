import { site } from "@/lib/site";

export function JsonLd() {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://example.ru";
  const data = { "@context": "https://schema.org", "@type": "Restaurant", name: site.name, description: "Кафе и баня у воды на Константиновском карьере", url: origin, telephone: site.phoneLabel, address: { "@type": "PostalAddress", addressLocality: "Тверь", streetAddress: site.address, addressCountry: "RU" }, servesCuisine: "Современная русская кухня", priceRange: "₽₽" };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
