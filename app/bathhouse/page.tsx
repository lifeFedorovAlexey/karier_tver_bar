import type { Metadata } from "next";
import Image from "next/image";
import { BookingBand } from "@/components/BookingBand";
import { ButtonLink } from "@/components/ButtonLink";
import { Header } from "@/components/Header";
import { ImageGallery } from "@/components/ImageGallery";
import { ParallaxHeroImage } from "@/components/ParallaxHeroImage";
import { site } from "@/lib/site";
import { LeafIcon, SteamIcon, WaterIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Баня на берегу",
  description:
    "Дровяная баня на берегу Константиновского карьера: парная, выход к воде и отдых среди сосен.",
  alternates: { canonical: "/bathhouse" },
};

export default function BathhousePage() {
  return (
    <main>
      <section className="innerHero bathHero">
        <ParallaxHeroImage
          src="/images/karier-real-bathhouse.png"
          alt="Баня «Карьер» с купелью на берегу"
          fetchPriority="high"
          sizes="100vw"
        />
        <div className="heroShade" />
        <Header overlay />
        <div className="innerHeroContent pageWidth">
          <span className="eyebrow light">Баня на берегу</span>
          <h1>
            Глубокий вдох.
            <br />
            <em>Настоящий пар.</em>
          </h1>
          <p>
            Жар парной, аромат берёзы
            <br />и прохладная вода в нескольких шагах.
          </p>
          <ButtonLink href={site.bookingUrl}>Выбрать время</ButtonLink>
        </div>
      </section>
      <section className="story pageWidth">
        <div>
          <span className="eyebrow">Перезагрузка у воды</span>
          <h2>
            Тепло внутри.
            <br />
            Простор вокруг.
          </h2>
        </div>
        <div>
          <p className="storyLead">
            Отдельная баня для вашей компании — без спешки и посторонних.
          </p>
          <p>
            Дровяная печь, просторная парная, зона отдыха и собственный выход к
            воде. Всё, что нужно для правильного ритуала и долгого спокойного
            вечера.
          </p>
        </div>
      </section>
      <ImageGallery
        label="Баня и пространство для отдыха"
        images={[
          {
            src: "/images/bathhouse-ice-hole.webp",
            alt: "Лестница в зимнюю прорубь у бани «Карьер»",
          },
          {
            src: "/images/bathhouse-room.png",
            alt: "Комната отдыха с видом на воду",
          },
          {
            src: "/images/bathhouse-hero.png",
            alt: "Баня «Карьер» на берегу",
          },
        ]}
      />
      <section className="ritual pageWidth">
        <div className="ritualPhoto">
          <Image
            src="/images/bathhouse-ritual.webp"
            alt="Купель с лепестками на берегу Константиновского карьера"
            fill
            sizes="(max-width: 760px) 100vw, 60vw"
          />
        </div>
        <div className="ritualFeatures">
          <div>
            <SteamIcon />
            <h3>Живой пар</h3>
            <p>Мягкий жар дровяной печи и аромат свежих веников.</p>
          </div>
          <div>
            <WaterIcon />
            <h3>Выход к воде</h3>
            <p>От парной до прохладного карьера — всего несколько шагов.</p>
          </div>
          <div>
            <LeafIcon />
            <h3>Тишина сосен</h3>
            <p>Приватное пространство для компании и никакой суеты.</p>
          </div>
        </div>
      </section>
      <BookingBand type="баню" />
    </main>
  );
}
