import Link from "next/link";
import Image from "next/image";

export function Logo({ light = false, variant = "default" }: { light?: boolean; variant?: "default" | "footer" }) {
  const artwork = variant === "footer" ? "/images/logo-karier-footer.png" : "/images/logo-karier.png";
  const dimensions = variant === "footer" ? { width: 2172, height: 724 } : { width: 1448, height: 1086 };

  return (
    <Link className={`logo ${light ? "logoLight" : ""} ${variant === "footer" ? "logoFooter" : ""}`} href="/" aria-label="Карьер — на главную">
      <Image className="logoArtwork" src={artwork} alt="" {...dimensions} priority={light} unoptimized={variant === "footer"} />
    </Link>
  );
}
