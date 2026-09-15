import type { Metadata } from "next";
import Image from "next/image";
import { BookingBand } from "@/components/BookingBand";
import { ButtonLink } from "@/components/ButtonLink";
import { Header } from "@/components/Header";
import { ImageGallery } from "@/components/ImageGallery";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Кафе у воды", description: "Сезонная кухня и просторная терраса на берегу Константиновского карьера в Твери.", alternates: { canonical: "/cafe" } };

export default function CafePage() {
  return <main><section className="innerHero"><Image src="/images/cafe-card.webp" alt="Панорамный зал кафе «Карьер» с видом на воду" fill priority sizes="100vw"/><div className="heroShade"/><Header overlay/><div className="innerHeroContent pageWidth"><span className="eyebrow light">Кафе у воды</span><h1>Вкус,<br /><em>которому идёт закат</em></h1><p>Понятная еда, сезонные продукты и вид,<br />который не хочется торопить.</p><ButtonLink href={site.bookingUrl}>Забронировать стол</ButtonLink></div></section>
    <section className="story pageWidth"><div><span className="eyebrow">Про кухню</span><h2>Просто. Свежо.<br />С характером.</h2></div><div><p className="storyLead">Мы готовим еду, за которой хочется возвращаться: щедрую, честную и понятную.</p><p>В меню — сезонные овощи, блюда на огне, свежая выпечка и лёгкие десерты. Для неспешного завтрака, семейного обеда и длинного вечера с друзьями.</p></div></section>
    <ImageGallery label="Кафе и вид на воду" images={[{ src: "/images/cafe-hero.webp", alt: "Зал кафе с панорамными окнами" }, { src: "/images/cafe-interior.webp", alt: "Интерьер кафе у воды" }, { src: "/images/karier-real-cafe.png", alt: "Пространство кафе «Карьер»" }]} />
    <section className="menuPreview pageWidth"><div className="menuPhoto"><Image src="/images/karier-cafe-final.png" alt="Интерьер кафе «Карьер» с видом на пляж и воду" fill sizes="(max-width: 760px) 100vw, 55vw"/></div><div className="menuList"><span className="eyebrow">Кухня и бар</span><h2>Выберите по вкусу</h2><p>Откройте полное меню кафе с актуальными блюдами, напитками и ценами.</p><ButtonLink href="/menu">Открыть меню</ButtonLink></div></section>
    <BookingBand type="ужин" />
  </main>;
}
