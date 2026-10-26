import type { Metadata } from "next";
import Image from "next/image";
import { BookingBand } from "@/components/BookingBand";
import { ButtonLink } from "@/components/ButtonLink";
import { Header } from "@/components/Header";
import { ImageGallery } from "@/components/ImageGallery";
import { JsonLd, serviceJsonLd } from "@/components/JsonLd";
import { ParallaxHeroImage } from "@/components/ParallaxHeroImage";
import { site } from "@/lib/site";
import { LeafIcon, SteamIcon, WaterIcon } from "@/components/icons";
import styles from "./bathhouse.module.css";

export const metadata: Metadata = {
  title: { absolute: "Баня «Карьер» в Твери — цены и бронирование" },
  description:
    "Баня на Константиновских карьерах в Твери: от 5 000 ₽ за 3 часа для компании до 6 гостей. С чаном и беседкой — от 7 000 ₽. Условия и онлайн-запись.",
  keywords: [
    "баня карьер тверь",
    "баня на карьерах тверь",
    "баня константиновский карьер",
    "баня константиновские карьеры",
    "константиновский карьер тверь баня",
    "константиновские карьеры",
    "константиновский карьер",
    "константиновские карьеры тверь",
    "константиновский карьер тверь",
  ],
  alternates: { canonical: "/bathhouse" },
  openGraph: {
    title: "Баня «Карьер» в Твери — цены и бронирование",
    description:
      "От 5 000 ₽ за 3 часа для компании до 6 гостей. Комплекс с чаном и беседкой — от 7 000 ₽. Цены и онлайн-запись.",
    url: "/bathhouse",
    siteName: "Карьер",
    locale: "ru_RU",
    type: "website",
    images: [{ url: "/images/bathhouse-ice-hole.webp", alt: "Баня «Карьер» у воды" }],
  },
};

export default function BathhousePage() {
  return (
    <main>
      <JsonLd
        data={serviceJsonLd(
          "Баня «Карьер»",
          "/bathhouse",
          "Дровяная баня на Константиновских карьерах в Твери с парной, зоной отдыха и выходом к воде.",
        )}
      />
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
            Баня «Карьер» в Твери — это дровяная печь, просторная парная, зона
            отдыха и собственный выход к воде. Всё, что нужно для правильного
            ритуала и долгого спокойного вечера.
          </p>
        </div>
      </section>
      <section className={`${styles.prices} pageWidth`} aria-labelledby="bathhouse-prices">
        <span className="eyebrow">Перед бронированием</span>
        <h2 id="bathhouse-prices">Стоимость аренды</h2>
        <p className={styles.intro}>
          Минимальный заказ — 3 часа. В стоимость входит компания до 6 гостей.
        </p>
        <div className={styles.cards}>
          <article className={styles.card}>
            <h3>Баня без чана</h3>
            <dl className={styles.rates}>
              <div><dt>Понедельник — четверг</dt><dd>5 000 ₽ <span>/ 3 часа</span></dd></div>
              <div><dt>Пятница — воскресенье</dt><dd>6 000 ₽ <span>/ 3 часа</span></dd></div>
            </dl>
            <p>Шапочки, тапочки и чай входят в стоимость.</p>
            <p className={styles.extension}>Продление — 1 500 ₽ за час.</p>
          </article>
          <article className={styles.card}>
            <h3>Баня, чан и беседка</h3>
            <dl className={styles.rates}>
              <div><dt>Понедельник — четверг</dt><dd>7 000 ₽ <span>/ 3 часа</span></dd></div>
              <div><dt>Пятница — воскресенье</dt><dd>9 000 ₽ <span>/ 3 часа</span></dd></div>
            </dl>
            <p>Сибирский чан на террасе, беседка с мангалом, шапочки, тапочки и чай.</p>
            <p className={styles.extension}>Продление: пн–чт — 2 000 ₽ за час, пт–вс — 2 500 ₽ за час.</p>
          </article>
        </div>
        <div className={styles.conditions}>
          <p>Свыше 6 гостей — доплата 300 ₽ за человека в час. Предоплата при записи — 30%.</p>
          <p>Тарифы опубликованы в нашей форме YCLIENTS. Итоговую стоимость и свободное время проверьте при записи.</p>
          <ButtonLink href={site.bookingUrl} variant="dark">Выбрать время</ButtonLink>
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
