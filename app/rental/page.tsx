import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { JsonLd, serviceJsonLd } from "@/components/JsonLd";
import { RentalSeasons } from "@/components/RentalSeasons";

export const metadata: Metadata = {
  title: { absolute: "Прокат на Константиновских карьерах в Твери" },
  description:
    "Летний и зимний прокат на Константиновских карьерах в Твери: SUP, водные развлечения, коньки, лыжи и актуальные цены.",
  keywords: [
    "прокат на Константиновских карьерах",
    "прокат SUP Тверь",
    "зимний прокат Тверь",
  ],
  alternates: { canonical: "/rental" },
  openGraph: {
    title: "Прокат на Константиновских карьерах в Твери",
    description:
      "Летний и зимний прокат: водные развлечения, коньки, лыжи и цены.",
    url: "/rental",
    siteName: "Карьер",
    locale: "ru_RU",
    type: "website",
    images: [{ url: "/images/beach-panorama-2026.webp", alt: "Прокат на Константиновских карьерах" }],
  },
};

export default function RentalPage() {
  return (
    <main className="rentalPage">
      <JsonLd
        data={serviceJsonLd(
          "Сезонный прокат на Константиновских карьерах",
          "/rental",
          "Летний и зимний прокат в Твери: водные развлечения, коньки и лыжи.",
        )}
      />
      <Header overlay />
      <RentalSeasons />
    </main>
  );
}
