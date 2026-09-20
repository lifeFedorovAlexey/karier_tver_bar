import Link from "next/link";

export function ButtonLink({
  href,
  children,
  variant = "cream",
  goal,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "cream" | "dark" | "outline";
  goal?: "booking_click" | "phone_click" | "menu_open";
}) {
  const external = /^https?:\/\//.test(href);
  const metrikaGoal =
    goal ??
    (href.startsWith("tel:")
      ? "phone_click"
      : href === "/menu"
        ? "menu_open"
        : external
          ? "booking_click"
          : undefined);

  return <Link href={href} className={`button button-${variant}`} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} data-metrika-goal={metrikaGoal}>{children}</Link>;
}
