import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { ExperienceCards } from "@/components/ExperienceCards";
import { Header } from "@/components/Header";
import { HomeManifesto } from "@/components/HomeManifesto";
import { ParallaxHeroImage } from "@/components/ParallaxHeroImage";
import { PinIcon } from "@/components/icons";

export default function HomePage() {
  return <main>
    <section className="hero homeHero">
      <ParallaxHeroImage />
      <div className="heroShade" /><Header overlay />
      <div className="heroContent pageWidth"><h1 className="heroTitle"><Image className="heroTitleArtwork" src="/images/hero-title.png" alt="Отдых рядом с городом" width={1536} height={1024} priority /></h1><div className="heroActions"><ButtonLink href="/contacts">Забронировать</ButtonLink></div></div>
      <a href="#discover" className="scrollCue" aria-label="Перейти к следующему разделу"><span />листайте</a>
    </section>
    <section className="pageWidth homeCards" id="discover"><ExperienceCards /></section>
    <HomeManifesto />
    <section className="homePanorama" aria-label="Константиновский карьер">
      <Image src="/images/footer-panorama.png" alt="Закат над водой Константиновского карьера" fill sizes="100vw" />
      <span className="closingShade" />
      <p className="panoramaNote">Больше<br />чем просто пляж <i>♡</i></p>
      <div className="panoramaLocation"><PinIcon size={28} /><span>Константиновский<br />карьер, Тверь</span></div>
    </section>
  </main>;
}
