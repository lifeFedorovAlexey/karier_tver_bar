import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { JsonLd, restaurantJsonLd } from "@/components/JsonLd";
import { Logo } from "@/components/Logo";
import { MenuBook } from "@/components/MenuBook";
import { site } from "@/lib/site";

const menuPages = [1, 3, 4, 5, 6, 7].map((sourcePage, index, pages) => ({
  src: `/images/source/menu/m${sourcePage}.jpg`,
  alt: `Меню кафе «Карьер», страница ${index + 1} из ${pages.length}`,
}));

type MenuItem = { name: string; portion?: string; price: string };
type MenuGroup = { title: string; items: MenuItem[] };

const menuGroups: MenuGroup[] = [
  {
    title: "Завтраки",
    items: [
      { name: "Скрэмбл на тостовом хлебе", portion: "200 г", price: "520 ₽" },
      { name: "Тост с авокадо и яйцом пашот", portion: "200 г", price: "580 ₽" },
      { name: "Творог с ягодами", portion: "210 г", price: "380 ₽" },
    ],
  },
  {
    title: "Салаты",
    items: [
      { name: "Нисуаз с тунцом", portion: "240 г", price: "860 ₽" },
      { name: "С хрустящим баклажаном", portion: "250 г", price: "540 ₽" },
      { name: "Цезарь", portion: "250 г", price: "640 ₽" },
    ],
  },
  {
    title: "Закуски",
    items: [
      { name: "Креветки с чесноком и зеленью", portion: "190 г", price: "1 120 ₽" },
      { name: "Куриные крылья на мангале", portion: "270 г", price: "580 ₽" },
      { name: "Копчёные сыры", portion: "160 г", price: "550 ₽" },
      { name: "Гренки на компанию", portion: "260 г", price: "620 ₽" },
    ],
  },
  {
    title: "Мангал",
    items: [
      { name: "Шашлык из свиной шеи", portion: "335 г", price: "840 ₽" },
      { name: "Шашлык из куриного филе", portion: "335 г", price: "740 ₽" },
      { name: "Шашлык из куриного бедра", portion: "335 г", price: "680 ₽" },
      { name: "Шашлык из скумбрии", portion: "380 г", price: "860 ₽" },
      { name: "Дорадо", portion: "450 г", price: "1 380 ₽" },
      { name: "Овощи на гриле", portion: "500 г", price: "700 ₽" },
    ],
  },
  {
    title: "Супы и горячее",
    items: [
      { name: "Куриный бульон с лапшой", portion: "330 г", price: "480 ₽" },
      { name: "Куриная грудка су-вид с кукурузой", portion: "200 г", price: "740 ₽" },
      { name: "Цыплёнок с картофельным пюре", portion: "290 г", price: "920 ₽" },
      { name: "Стейк из форели с брокколи", portion: "230 г", price: "1 260 ₽" },
      { name: "Сом, томлённый в горшочке", portion: "250 г", price: "960 ₽" },
    ],
  },
  {
    title: "Паста и гарниры",
    items: [
      { name: "Паста с говядиной и томатами черри", portion: "330 г", price: "860 ₽" },
      { name: "Карбонара", portion: "250 г", price: "660 ₽" },
      { name: "Паста с сыром пармезан", portion: "200 г", price: "560 ₽" },
      { name: "Картофельное пюре", portion: "130 г", price: "360 ₽" },
      { name: "Картофель бэби", portion: "130 г", price: "480 ₽" },
      { name: "Картофель фри", portion: "100 г", price: "380 ₽" },
    ],
  },
  {
    title: "Пицца",
    items: [
      { name: "Маргарита", portion: "400 г", price: "820 ₽" },
      { name: "Цезарь", portion: "495 г", price: "860 ₽" },
      { name: "Четыре сыра", portion: "475 г", price: "1 060 ₽" },
      { name: "Барбекю", portion: "515 г", price: "1 240 ₽" },
      { name: "С форелью с/с и творожным сыром", portion: "400 г", price: "1 360 ₽" },
      { name: "Пепперони", portion: "460 г", price: "940 ₽" },
    ],
  },
  {
    title: "Чай и кофе",
    items: [
      { name: "Авторский чай", portion: "500 / 1000 мл", price: "400 / 700 ₽" },
      { name: "Классический чай", portion: "500 / 1000 мл", price: "от 300 / 500 ₽" },
      { name: "Эспрессо", portion: "40 мл", price: "150 ₽" },
      { name: "Американо", portion: "170 мл", price: "200 ₽" },
      { name: "Флэт уайт", portion: "200 мл", price: "250 ₽" },
      { name: "Капучино", portion: "200 мл", price: "250 ₽" },
      { name: "Латте", portion: "200 мл", price: "280 ₽" },
      { name: "Раф", portion: "200 мл", price: "300 ₽" },
    ],
  },
];

export const metadata: Metadata = {
  title: { absolute: "Меню кафе «Карьер» в Твери — блюда и цены" },
  description:
    "Актуальное меню кафе «Карьер» в Твери: завтраки, салаты, горячие блюда, пицца, напитки и цены.",
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

      <section className="menuText" aria-labelledby="menu-text-title">
        <div className="menuTextHeading">
          <div>
            <span>Кафе «Карьер»</span>
            <h2 id="menu-text-title">Блюда и цены</h2>
          </div>
          <p>Цены указаны в рублях и соответствуют опубликованному меню.</p>
        </div>
        <div className="menuTextGrid">
          {menuGroups.map((group) => (
            <section className="menuTextGroup" key={group.title}>
              <h3>{group.title}</h3>
              <dl>
                {group.items.map((item) => (
                  <div key={`${group.title}-${item.name}`}>
                    <dt>
                      {item.name}
                      {item.portion && <small>{item.portion}</small>}
                    </dt>
                    <dd>{item.price}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
        <div className="menuTextBooking">
          <p>Забронируйте столик на удобное время.</p>
          <ButtonLink href={site.bookingUrl} goal="booking_click">
            Забронировать стол
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
