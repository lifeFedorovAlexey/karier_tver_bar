import Link from "next/link";

export function ButtonLink({ href, children, variant = "cream" }: { href: string; children: React.ReactNode; variant?: "cream" | "dark" | "outline" }) {
  return <Link href={href} className={`button button-${variant}`}>{children}</Link>;
}
