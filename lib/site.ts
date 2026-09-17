export const site = {
  name: "Карьер",
  descriptor: "кафе у воды",
  phoneLabel: "+7 (967) 777-37-71",
  phoneHref: "tel:+79677773771",
  address: "Тверь, Константиновский карьер, центральный пляж",
  hours: "Ежедневно с 10:00 до 22:00",
  bookingUrl:
    process.env.NEXT_PUBLIC_YCLIENTS_URL || "https://n1129088.yclients.ru",
} as const;

export const navigation = [
  { href: "/", label: "Главная" },
  { href: "/cafe", label: "Кафе" },
  { href: "/bathhouse", label: "Баня" },
  { href: "/rental", label: "Прокат" },
  { href: "/contacts", label: "Контакты" },
] as const;

export const experiences = [
  {
    href: "/cafe",
    eyebrow: "Вкус начинается с места",
    title: "Кафе",
    description: "Вкусная еда и хорошая атмосфера у воды.",
    image: "/images/cafe-card.webp",
    cta: "Посмотреть меню",
    ctaHref: "/menu",
  },
  {
    href: "/bathhouse",
    eyebrow: "Тепло внутри. Простор вокруг",
    title: "Баня",
    description: "Пар, отдых, перезагрузка.",
    image: "/images/karier-real-bathhouse.png",
    cta: "Забронировать",
    ctaHref: site.bookingUrl,
  },
] as const;
