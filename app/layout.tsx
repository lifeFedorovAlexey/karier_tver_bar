import type { Metadata, Viewport } from "next";
import { Manrope, Marck_Script, Oswald } from "next/font/google";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Metrika } from "@/components/Metrika";
import "./globals.css";
import "./image-framing.css";
import "./home-bottom.css";
import "./reference-design.css";
import "./footer-match.css";
import "./pixel-perfect.css";
import "./design-corrections.css";
import "./rental.css";
import "./hero-heights.css";
import "./content-widths.css";

const sans = Manrope({ subsets: ["cyrillic", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans", display: "swap" });
const script = Marck_Script({ subsets: ["cyrillic", "latin"], weight: "400", variable: "--font-script", display: "swap" });
const condensed = Oswald({ subsets: ["cyrillic", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-condensed", display: "swap" });
const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://example.ru";

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: { default: "Карьер — кафе и баня у воды в Твери", template: "%s | Карьер" },
  description: "Кафе с сезонной кухней и баня на берегу Константиновского карьера в Твери. Отдых, вкус и настоящий пар у воды.",
  applicationName: "Карьер",
  alternates: { canonical: "/" },
  openGraph: { title: "Карьер — кафе и баня у воды", description: "Место у воды, куда хочется возвращаться.", url: "/", siteName: "Карьер", locale: "ru_RU", type: "website", images: [{ url: "/images/karier-bathhouse-enhanced-4k.png", width: 4096, height: 4096 }] },
  twitter: { card: "summary_large_image", images: ["/images/karier-bathhouse-enhanced-4k.png"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#17241f" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body className={`${script.variable} ${sans.variable} ${condensed.variable}`}><JsonLd />{children}<Footer /><Metrika /></body></html>;
}
