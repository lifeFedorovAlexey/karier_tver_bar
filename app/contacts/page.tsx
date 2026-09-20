import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { Header } from "@/components/Header";
import { ParallaxHeroImage } from "@/components/ParallaxHeroImage";
import { ClockIcon, PinIcon, PhoneIcon } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Контакты «Карьер» — телефон, режим работы и карта",
  },
  description:
    "Телефон, режим работы, карта и онлайн-бронирование кафе и бани «Карьер» в Твери.",
  keywords: [
    "константиновский карьер тверь",
    "кафе карьер тверь контакты",
    "баня карьер тверь",
  ],
  alternates: { canonical: "/contacts" },
  openGraph: {
    title: "Контакты кафе и бани «Карьер»",
    description: "Телефон, режим работы, карта и онлайн-бронирование.",
    url: "/contacts",
    siteName: "Карьер",
    locale: "ru_RU",
    type: "website",
    images: [{ url: "/images/beach-panorama-2026.webp", alt: "Кафе «Карьер» в Твери" }],
  },
};

export default function ContactsPage() {
  return (
    <main className="contactsPage">
      <section className="innerHero contactsVisualHero">
        <ParallaxHeroImage
          src="/images/beach-panorama-2026.webp"
          alt="Барная стойка кафе «Карьер»"
          fetchPriority="high"
          sizes="100vw"
        />
        <div className="heroShade" />
        <Header overlay />
        <div className="innerHeroContent pageWidth">
          <span className="eyebrow light">Будем рады видеть</span>
          <h1>
            Встретимся
            <br />
            <em>у воды</em>
          </h1>
          <p>
            Кафе, баня и спокойный отдых
            <br />в нескольких минутах от Твери.
          </p>
        </div>
      </section>
      <section className="contactGrid contactGridDesigned pageWidth">
        <div className="contactPanel">
          <span className="eyebrow">Контакты</span>
          <a href={site.phoneHref} data-metrika-goal="phone_click">
            <PhoneIcon />
            <span>
              <small>Телефон</small>
              <b>{site.phoneLabel}</b>
            </span>
          </a>
          <div>
            <PinIcon />
            <span>
              <small>Адрес</small>
              <b>{site.address}</b>
            </span>
          </div>
          <div>
            <ClockIcon />
            <span>
              <small>Режим работы</small>
              <b>{site.hours}</b>
            </span>
          </div>
        </div>
        <div className="contactBookingCard">
          <span className="eyebrow light">Онлайн-запись</span>
          <h2>
            Выберите
            <br />
            <em>свой отдых</em>
          </h2>
          <p>
            Забронируйте столик или удобное время для бани через сервис
            YCLIENTS.
          </p>
          <ButtonLink href={site.bookingUrl}>Перейти к записи</ButtonLink>
        </div>
      </section>
      <section className="mapSection" aria-label="Расположение на карте">
        <iframe
          src="https://yandex.ru/map-widget/v1/?ll=35.995277%2C56.846352&z=16&pt=35.995277%2C56.846352%2Cpm2rdm"
          title="Карьер на Яндекс Картах"
          loading="lazy"
          allowFullScreen
        />
        <a
          className="mapLink"
          data-metrika-goal="map_open"
          href="https://yandex.ru/maps/?ll=35.995277%2C56.846352&mode=whatshere&whatshere%5Bpoint%5D=35.995277%2C56.846352&whatshere%5Bzoom%5D=16&z=16"
          target="_blank"
          rel="noreferrer"
        >
          <PinIcon size={18} /> Открыть в Яндекс Картах
        </a>
      </section>
    </main>
  );
}
