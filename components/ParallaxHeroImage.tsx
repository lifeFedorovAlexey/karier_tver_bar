"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function ParallaxHeroImage() {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (!image || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const heroHeight = image.parentElement?.clientHeight ?? 400;
      const offset = Math.min(window.scrollY * 0.22, heroHeight * 0.14);
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

  return (
    <Image
      ref={imageRef}
      className="heroParallaxImage"
      src="/images/karier-hero-final.png"
      alt="Кафе и баня «Карьер» на берегу Константиновского карьера"
      fill
      priority
      sizes="100vw"
    />
  );
}
