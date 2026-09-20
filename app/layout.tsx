import type { Metadata, Viewport } from "next";
import { Manrope, Marck_Script, Oswald } from "next/font/google";
import { Footer } from "@/components/Footer";
import { JsonLd, websiteJsonLd } from "@/components/JsonLd";
import { Metrika } from "@/components/Metrika";
import { siteUrl } from "@/lib/site";
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
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Константиновские карьеры в Твери — кафе, баня и прокат",
    template: "%s | Карьер",
  },
  description:
    "Кафе, баня и сезонный прокат на Константиновских карьерах в Твери. Меню, цены, режим работы и онлайн-бронирование.",
  keywords: [
    "константиновские карьеры тверь",
    "кафе карьер тверь",
    "баня карьер тверь",
  ],
  applicationName: "Карьер",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Константиновские карьеры в Твери — кафе, баня и прокат",
    description:
      "Кафе, баня и сезонный прокат на Константиновских карьерах в Твери.",
    url: "/",
    siteName: "Карьер",
    locale: "ru_RU",
    type: "website",
    images: [{ url: "/images/cafe-hero.webp", alt: "Кафе «Карьер» у воды" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/cafe-hero.webp"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#17241f" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body className={`${script.variable} ${sans.variable} ${condensed.variable}`}><JsonLd data={websiteJsonLd()} />{children}<Footer /><Metrika /></body></html>;
}
