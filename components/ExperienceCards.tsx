import Image from "next/image";
import Link from "next/link";
import { experiences } from "@/lib/site";

// Match the content gutters, two-column gap and 1180px container in the CSS.
const cardSizes = "(max-width: 600px) calc(100vw - 32px), (max-width: 800px) calc(50vw - 16px - clamp(4px, 0.625vw, 9px)), (max-width: 1244px) calc(50vw - 32px - clamp(4px, 0.625vw, 9px)), 582px";

export function ExperienceCards() {
  return <div className="experienceGrid">{experiences.map((item) => (
    <article className="experienceCard" key={item.href}>
      <Link className="experienceCardLink" href={item.href} aria-label={`Открыть раздел «${item.title}»`}>
        <Image src={item.image} alt="" fill sizes={cardSizes} />
        <span className="cardShade" />
      </Link>
      <div className="experienceContent"><span className="eyebrow">{item.eyebrow}</span><h2>{item.title}</h2><p>{item.description}</p><Link className="textLink" href={item.ctaHref} data-metrika-goal={item.ctaHref === "/menu" ? "menu_open" : "booking_click"}>{item.cta}</Link></div>
    </article>
  ))}</div>;
}
