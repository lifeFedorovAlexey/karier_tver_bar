import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";

const menuPages = Array.from({ length: 7 }, (_, index) => ({
  src: `/images/source/menu/m${index + 1}.jpg`,
  alt: `Меню кафе «Карьер», страница ${index + 1} из 7`,
}));

export const metadata: Metadata = {
  title: "Меню кафе",
  description: "Актуальное меню кафе «Карьер» на берегу Константиновского карьера в Твери.",
  alternates: { canonical: "/menu" },
  openGraph: {
    title: "Меню кафе «Карьер»",
    description: "Блюда и напитки кафе «Карьер» у воды.",
    url: "/menu",
    images: [menuPages[0].src],
  },
};

export default function MenuPage() {
  return (
    <main className="qrMenu">
      <header className="qrMenuHeader">
        <Logo />
        <div>
          <span>Кафе у воды</span>
          <h1>Меню</h1>
        </div>
        <Link className="qrMenuBack" href="/cafe">О кафе</Link>
      </header>

      <section className="qrMenuPages" aria-label="Страницы меню">
        {menuPages.map((page, index) => (
          <figure className="qrMenuPage" key={page.src}>
            <Image
              src={page.src}
              alt={page.alt}
              width={904}
              height={1280}
              priority={index === 0}
              sizes="(max-width: 960px) 100vw, 904px"
            />
          </figure>
        ))}
      </section>
    </main>
  );
}
