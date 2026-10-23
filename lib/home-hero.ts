import avif640 from "@/public/images/optimized/home-hero-640.avif";
import avif828 from "@/public/images/optimized/home-hero-828.avif";
import avif1280 from "@/public/images/optimized/home-hero-1280.avif";
import avif1920 from "@/public/images/optimized/home-hero-1920.avif";
import webp640 from "@/public/images/optimized/home-hero-640.webp";
import webp828 from "@/public/images/optimized/home-hero-828.webp";
import webp1280 from "@/public/images/optimized/home-hero-1280.webp";
import webp1920 from "@/public/images/optimized/home-hero-1920.webp";

// Static imports give every variant a content hash and immutable caching.
const srcSet = (images: { src: string; width: number }[]) =>
  images.map(({ src, width }) => `${src} ${width}w`).join(", ");

export const homeHero = {
  src: webp1920.src,
  avifSrc: avif1920.src,
  // Turbopack emits AVIF files but returns placeholder dimensions. Use the
  // matching WebP dimensions, which are read from the actual encoded files.
  avifSrcSet: srcSet([
    { src: avif640.src, width: webp640.width },
    { src: avif828.src, width: webp828.width },
    { src: avif1280.src, width: webp1280.width },
    { src: avif1920.src, width: webp1920.width },
  ]),
  webpSrcSet: srcSet([webp640, webp828, webp1280, webp1920]),
};
