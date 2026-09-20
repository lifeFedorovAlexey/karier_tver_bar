import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { ExperienceCards } from "@/components/ExperienceCards";
import { Header } from "@/components/Header";
import { HomeManifesto } from "@/components/HomeManifesto";
import { ParallaxHeroImage } from "@/components/ParallaxHeroImage";
import { PinIcon } from "@/components/icons";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <main>
      <section className="hero homeHero">
            <ParallaxHeroImage
              src="/images/karier-bathhouse-enhanced-4k.png"
              alt="Кафе и баня «Карьер» на берегу Константиновского карьера"
            />
        <div className="heroShade" />
        <Header overlay />
        <div className="heroContent pageWidth">
          <h1 className="heroTitle">
            <span className="visuallyHidden">
              Отдых на Константиновских карьерах в Твери
            </span>
            <Image
              className="heroTitleArtwork"
              src="/images/hero-title.webp"
              alt=""
              aria-hidden="true"
              width={1536}
              height={1024}
              sizes="(max-width: 800px) 86vw, 330px"
              loading="eager"
            />
          </h1>
          <div className="heroActions">
            <ButtonLink href={site.bookingUrl}>Выбрать дату и время</ButtonLink>
          </div>
        </div>
        <a
          href="#discover"
          className="scrollCue"
          aria-label="Перейти к следующему разделу"
        >
          <span />
          листайте
        </a>
      </section>
      <section className="pageWidth homeCards" id="discover">
        <ExperienceCards />
      </section>
      <HomeManifesto />
      <section className="homePanorama" aria-label="Константиновский карьер">
        <Image
          src="/images/footer-panorama.png"
          alt="Закат над водой Константиновского карьера"
          fill
          sizes="100vw"
        />
        <span className="closingShade" />
        <p className="panoramaNote">
          Больше
          <br />
          чем просто пляж{" "}
        </p>
        <div className="panoramaLocation">
          <PinIcon size={28} />
          <span>
            Центральный пляж
            <br />
            Тверь
          </span>
        </div>
      </section>
    </main>
  );
}
