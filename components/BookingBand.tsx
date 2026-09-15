import { ButtonLink } from "./ButtonLink";
import { site } from "@/lib/site";

export function BookingBand({ type = "отдых" }: { type?: string }) {
  return <section className="bookingBand"><div><span className="eyebrow">Оставьте заботы на берегу</span><h2>Запланируйте {type}<br />у воды</h2></div><div><p>Выберите удобный день и оформите запись онлайн в несколько шагов.</p><ButtonLink href={site.bookingUrl} variant="dark">Записаться онлайн</ButtonLink></div></section>;
}
