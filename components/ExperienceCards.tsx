import Image from "next/image";
import Link from "next/link";
import { experiences } from "@/lib/site";

export function ExperienceCards() {
  return <div className="experienceGrid">{experiences.map((item) => (
    <article className="experienceCard" key={item.href}>
      <Link className="experienceCardLink" href={item.href} aria-label={`Открыть раздел «${item.title}»`}>
        <Image src={item.image} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" />
        <span className="cardShade" />
      </Link>
      <div className="experienceContent"><span className="eyebrow">{item.eyebrow}</span><h3>{item.title}</h3><p>{item.description}</p><Link className="textLink" href={item.ctaHref} data-metrika-goal={item.ctaHref === "/menu" ? "menu_open" : "booking_click"}>{item.cta}</Link></div>
    </article>
  ))}</div>;
}
