import { ButtonLink } from "./ButtonLink";

export function BookingBand({ type = "отдых" }: { type?: string }) {
  return <section className="bookingBand"><div><span className="eyebrow">Оставьте заботы на берегу</span><h2>Запланируйте {type}<br />у воды</h2></div><div><p>Выберите удобный день — мы свяжемся с вами, ответим на вопросы и подтвердим детали.</p><ButtonLink href="/contacts" variant="dark">Оставить заявку</ButtonLink></div></section>;
}
