export const site = {
  name: "Карьер",
  descriptor: "кафе у воды",
  phoneLabel: "+7 (900) 123-45-67",
  phoneHref: "tel:+79001234567",
  address: "Константиновский карьер, Тверь",
  hours: "Ежедневно с 10:00 до 22:00",
  email: "hello@karier-tver.ru",
} as const;

export const navigation = [
  { href: "/", label: "Главная" },
  { href: "/cafe", label: "Кафе" },
  { href: "/bathhouse", label: "Баня" },
  { href: "/contacts", label: "Контакты" },
] as const;

export const experiences = [
  {
    href: "/cafe",
    eyebrow: "Вкус начинается с места",
    title: "Кафе",
    description: "Вкусная еда и хорошая атмосфера у воды.",
    image: "/images/karier-cafe-final.png",
    cta: "Посмотреть меню",
    ctaHref: "/menu",
  },
  {
    href: "/bathhouse",
    eyebrow: "Тепло внутри. Простор вокруг",
    title: "Баня",
    description: "Пар, отдых, перезагрузка.",
    image: "/images/karier-bathhouse-final.png",
    cta: "Забронировать",
    ctaHref: "/contacts",
  },
] as const;
