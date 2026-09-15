import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { ClockIcon, PinIcon, PhoneIcon } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Контакты", description: "Адрес, часы работы и бронирование кафе и бани «Карьер» в Твери.", alternates: { canonical: "/contacts" } };

export default function ContactsPage() {
  return <main><Header/><section className="contactsHero pageWidth"><span className="eyebrow">Будем рады видеть</span><h1>Встретимся<br /><em>у воды</em></h1><p>Напишите или позвоните — поможем выбрать столик, время для бани и ответим на вопросы.</p></section>
    <section className="contactGrid pageWidth"><div className="contactPanel"><a href={site.phoneHref}><PhoneIcon/><span><small>Телефон</small><b>{site.phoneLabel}</b></span></a><div><PinIcon/><span><small>Адрес</small><b>{site.address}</b></span></div><div><ClockIcon/><span><small>Режим работы</small><b>{site.hours}</b></span></div><a href={`mailto:${site.email}`}><span className="atIcon">@</span><span><small>Почта</small><b>{site.email}</b></span></a><p className="dataNotice">Телефон, адрес на карте и почта сейчас используются как макетные данные — заменим после подтверждения.</p></div>
    <form className="bookingForm" action={`mailto:${site.email}`} method="post" encType="text/plain"><span className="eyebrow">Заявка</span><h2>Оставьте контакты</h2><label>Как к вам обращаться<input name="name" autoComplete="name" required placeholder="Ваше имя"/></label><label>Телефон<input name="phone" type="tel" autoComplete="tel" required placeholder="+7 900 000-00-00"/></label><label>Что хотите забронировать<select name="type" defaultValue=""><option value="" disabled>Выберите вариант</option><option>Столик в кафе</option><option>Баню</option><option>Хочу уточнить</option></select></label><label>Комментарий<textarea name="comment" rows={3} placeholder="Желаемые дата и время"/></label><button className="button button-dark" type="submit">Отправить заявку <span>→</span></button><small>Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</small></form></section>
    <section className="mapPlaceholder"><div><PinIcon size={34}/><b>Константиновский карьер</b><span>Точная точка появится после подтверждения адреса</span></div></section>
  </main>;
}
