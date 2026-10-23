"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type ParallaxHeroImageProps = {
  src: string;
  alt: string;
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
  sources?: { avifSrcSet: string; webpSrcSet: string };
};

export function ParallaxHeroImage({
  src,
  alt,
  fetchPriority = "high",
  sizes = "100vw",
  sources,
}: ParallaxHeroImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (!image || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const heroHeight = image.closest("section")?.clientHeight ?? 400;
      const offset = Math.min(window.scrollY * 0.12, heroHeight * 0.05);
      image.style.setProperty("--hero-parallax", `${offset}px`);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  if (sources) {
    return (
      <picture>
        <source type="image/avif" srcSet={sources.avifSrcSet} sizes={sizes} />
        {/* Pre-encoded responsive files bypass runtime transforms for LCP. */}
        <img
          ref={imageRef}
          className="heroParallaxImage"
          src={src}
          srcSet={sources.webpSrcSet}
          sizes={sizes}
          width={1920}
          height={1920}
          alt={alt}
          loading={fetchPriority === "high" ? "eager" : "lazy"}
          fetchPriority={fetchPriority}
          decoding="async"
        />
      </picture>
    );
  }

  return (
    <Image
      ref={imageRef}
      className="heroParallaxImage"
      src={src}
      alt={alt}
      fill
      loading={fetchPriority === "high" ? "eager" : undefined}
      fetchPriority={fetchPriority}
      sizes={sizes}
    />
  );
}
