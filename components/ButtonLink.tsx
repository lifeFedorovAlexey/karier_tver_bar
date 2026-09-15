import Link from "next/link";

export function ButtonLink({ href, children, variant = "cream" }: { href: string; children: React.ReactNode; variant?: "cream" | "dark" | "outline" }) {
  const external = /^https?:\/\//.test(href);
  return <Link href={href} className={`button button-${variant}`} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{children}</Link>;
}
