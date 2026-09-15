"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation, site } from "@/lib/site";
import { Logo } from "./Logo";
import { PhoneIcon } from "./icons";
import { ButtonLink } from "./ButtonLink";

export function Header({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();

  return (
    <header className={`siteHeader ${overlay ? "siteHeaderOverlay" : ""}`}>
      <div className="headerInner">
        <Logo light={overlay} />
        <nav aria-label="Основная навигация" className="desktopNav">
          {navigation.map((item) => <Link key={item.href} href={item.href} className={item.href === pathname ? "active" : undefined} aria-current={item.href === pathname ? "page" : undefined}>{item.label}</Link>)}
        </nav>
        <a className="phoneLink" href={site.phoneHref}><PhoneIcon size={16} /> {site.phoneLabel}</a>
        <div className="headerBooking"><ButtonLink href="/contacts">Забронировать</ButtonLink></div>
        <details className="mobileMenu">
          <summary aria-label="Открыть меню"><span /><span /><span /></summary>
          <nav aria-label="Мобильная навигация">
            {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </nav>
        </details>
      </div>
    </header>
  );
}
