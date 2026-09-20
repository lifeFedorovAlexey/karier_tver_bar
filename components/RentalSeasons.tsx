"use client";

import { useState } from "react";
import { ButtonLink } from "./ButtonLink";
import { ParallaxHeroImage } from "./ParallaxHeroImage";
import { site } from "@/lib/site";

type Season = "winter" | "summer";

type PriceRow = {
  label: string;
  price: string;
  note?: string;
};

type PriceCard = {
  title: string;
  rows: PriceRow[];
  featured?: boolean;
  footer?: string;
  notice?: string[];
};

const winterPrices: PriceCard[] = [
  {
    title: "Коньки",
    rows: [
      { label: "Будни · взрослые", price: "300 ₽", note: "час" },
      { label: "Будни · дети", price: "200 ₽", note: "час" },
      { label: "Выходные · взрослые", price: "400 ₽", note: "час" },
      { label: "Выходные · дети", price: "300 ₽", note: "час" },
    ],
    footer: "Лёд включён · размеры 30–47",
  },
  {
    title: "Лёд",
    rows: [
      { label: "Будни · взрослые", price: "300 ₽", note: "день" },
      { label: "Будни · дети", price: "200 ₽", note: "день" },
      { label: "Выходные · взрослые", price: "400 ₽", note: "день" },
      { label: "Выходные · дети", price: "300 ₽", note: "день" },
    ],
    footer: "Со своими коньками · без ограничения по времени",
  },
  {
    title: "Лыжи",
    rows: [
      { label: "Будни · взрослые", price: "400 ₽", note: "час" },
      { label: "Будни · дети", price: "300 ₽", note: "час" },
      { label: "Выходные · взрослые", price: "500 ₽", note: "час" },
      { label: "Выходные · дети", price: "400 ₽", note: "час" },
    ],
  },
  {
    title: "Электросноуборд",
    featured: true,
    rows: [{ label: "Катание", price: "от 1 000 ₽" }],
    notice: [
      "При аренде коньков — лёд бесплатный.",
      "Аренда льда без ограничений по времени.",
    ],
  },
];

const summerPrices: PriceCard[] = [
  {
    title: "SUP-board",
    rows: [
      { label: "30 минут", price: "600 ₽" },
      { label: "1 час", price: "1 000 ₽" },
    ],
  },
  {
    title: "Jet-board",
    rows: [
      { label: "10 минут", price: "2 000 ₽" },
      { label: "20 минут", price: "3 500 ₽" },
      { label: "30 минут", price: "4 500 ₽" },
    ],
  },
  {
    title: "Гриль-лодка",
    rows: [{ label: "1 час", price: "2 500 ₽" }],
  },
  {
    title: "Блоб-катапульта",
    rows: [
      { label: "10 минут · с человека", price: "500 ₽" },
      { label: "30 минут · с человека", price: "1 000 ₽" },
    ],
  },
  {
    title: "Катание",
    rows: [
      { label: "Катер · от 2 человек", price: "2 000 ₽", note: "7–10 мин" },
      { label: "Водные лыжи", price: "2 000 ₽" },
      {
        label: "Водная ватрушка · 2 человека",
        price: "2 000 ₽",
        note: "5–7 мин",
      },
      { label: "Wake board", price: "2 000 ₽", note: "10 мин" },
      { label: "Катамаран", price: "1 200 / 2 000 ₽", note: "30 мин / час" },
    ],
  },
  {
    title: "Летняя акция",
    featured: true,
    rows: [
      {
        label: "При заказе от 2 000 ₽ в кафе",
        price: "−20%",
        note: "по чеку",
      },
    ],
  },
];

function PriceCardView({ card }: { card: PriceCard }) {
  return (
    <article
      className={`rentalPriceCard${card.featured ? " rentalPriceCardFeatured" : ""}`}
    >
      <h3>{card.title}</h3>
      <div className="rentalPriceRows">
        {card.rows.map((row) => (
          <div className="rentalPriceRow" key={`${row.label}-${row.price}`}>
            <span>
              {row.label}
              {row.note && <small>{row.note}</small>}
            </span>
            <b>{row.price}</b>
          </div>
        ))}
      </div>
      {card.notice && (
        <p className="rentalCardNotice" role="note">
          {card.notice.map((line) => <strong key={line}>{line}</strong>)}
        </p>
      )}
      {card.footer && <p className="rentalCardFooter">{card.footer}</p>}
    </article>
  );
}

export function RentalSeasons() {
  const [season, setSeason] = useState<Season>("winter");
  const isWinter = season === "winter";
  const prices = isWinter ? winterPrices : summerPrices;

  return (
    <>
      <section
        className={`rentalHero ${isWinter ? "rentalHeroWinter" : "rentalHeroSummer"}`}
      >
        <ParallaxHeroImage
          key={season}
          src={
            isWinter
              ? "/images/rental-winter-hero-v4.png"
              : "/images/beach-panorama-2026.webp"
          }
          alt={
            isWinter
              ? "Зимний прокат на замёрзшем карьере"
              : "Летний пляж на Константиновском карьере"
          }
          fetchPriority="high"
          sizes="100vw"
        />
        <div className="rentalHeroShade" />
        <div className="rentalHeroContent pageWidth">
          <span className="eyebrow light">Прокат у воды</span>
          <h1>Прокат</h1>
          <p>
            {isWinter
              ? "Коньки · лыжи · лёд · электросноуборд"
              : "SUP · jet-board · катание · отдых на воде"}
          </p>
          <div
            className="rentalSeasonTabs"
            role="tablist"
            aria-label="Выбор сезона"
          >
            <button
              type="button"
              role="tab"
              aria-selected={isWinter}
              className={isWinter ? "active" : undefined}
              onClick={() => setSeason("winter")}
            >
              Зима
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isWinter}
              className={!isWinter ? "active" : undefined}
              onClick={() => setSeason("summer")}
            >
              Лето
            </button>
          </div>
        </div>
      </section>

      <section
        className={`rentalBoard pageWidth ${isWinter ? "rentalBoardWinter" : "rentalBoardSummer"}`}
      >
        <div className="rentalBoardHeading">
          <div>
            <span className="eyebrow">Сезонный прайс</span>
            <h2>{isWinter ? "Зимний прокат" : "Летний прокат"}</h2>
          </div>
          <p>
            {isWinter
              ? "Детский тариф — до 12 лет включительно"
              : "Больше движения — больше лета"}
          </p>
        </div>

        <div className="rentalPriceGrid">
          {prices.map((card) => (
            <PriceCardView card={card} key={card.title} />
          ))}
        </div>
      </section>

      <section className="rentalContact pageWidth">
        <div>
          <span className="eyebrow light">Перед поездкой</span>
          <h2>Уточните наличие</h2>
        </div>
        <ButtonLink href={site.phoneHref}>{site.phoneLabel}</ButtonLink>
      </section>
    </>
  );
}
