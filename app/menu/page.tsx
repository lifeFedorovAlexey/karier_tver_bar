import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, restaurantJsonLd } from "@/components/JsonLd";
import { Logo } from "@/components/Logo";
import { MenuBook } from "@/components/MenuBook";

const menuPages = [1, 3, 4, 5, 6, 7].map((sourcePage, index, pages) => ({
  src: `/images/source/menu/m${sourcePage}.jpg`,
  alt: `Меню кафе «Карьер», страница ${index + 1} из ${pages.length}`,
}));

export const metadata: Metadata = {
  title: { absolute: "Меню кафе «Карьер» в Твери — блюда и цены" },
  description:
    "Актуальное меню кафе «Карьер» в Твери: завтраки, салаты, горячие блюда, пицца, напитки и цены.",
  keywords: [
    "меню кафе карьер тверь",
    "константиновский карьер кафе",
    "кафе константиновский карьер",
    "кафе карьер тверь меню",
    "карьер тверь заволжский район меню",
    "кафе карьер тверь",
    "кафе на карьерах тверь",
    "константиновские карьеры тверь",
    "константиновский карьер тверь",
  ],
  alternates: { canonical: "/menu" },
  openGraph: {
    title: "Меню кафе «Карьер» в Твери — блюда и цены",
    description: "Блюда, напитки и цены кафе «Карьер» в Твери.",
    url: "/menu",
    siteName: "Карьер",
    locale: "ru_RU",
    type: "website",
    images: [menuPages[0].src],
  },
};

export default function MenuPage() {
  return (
    <main className="qrMenu">
      <JsonLd data={restaurantJsonLd()} />
      <header className="qrMenuHeader">
        <Logo />
        <div>
          <span>Кафе у воды</span>
          <h1>Меню</h1>
        </div>
        <Link className="qrMenuBack" href="/cafe">О кафе</Link>
      </header>

      <MenuBook pages={menuPages} />
    </main>
  );
}
