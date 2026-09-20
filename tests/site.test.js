import assert from "node:assert/strict";
import test from "node:test";
import { navLabels, routes } from "../lib/site.test-data.js";

test("сайт содержит шесть уникальных публичных маршрутов", () => {
  assert.equal(routes.length, 6);
  assert.equal(new Set(routes).size, routes.length);
  assert.ok(routes.includes("/menu"));
  assert.ok(routes.includes("/rental"));
  assert.deepEqual(navLabels, ["Главная", "Кафе", "Баня", "Прокат", "Контакты"]);
});

test("маршруты используют канонические URL без завершающего слеша", () => {
  assert.ok(routes.every((route) => route === "/" || !route.endsWith("/")));
});

test("страница проката содержит зимний и летний прайс", async () => {
  const fs = await import("node:fs/promises");
  const [page, seasons] = await Promise.all([
    fs.readFile(new URL("../app/rental/page.tsx", import.meta.url), "utf8"),
    fs.readFile(
      new URL("../components/RentalSeasons.tsx", import.meta.url),
      "utf8",
    ),
  ]);
  assert.match(page, /canonical: "\/rental"/);
  assert.match(page, /<RentalSeasons \/>/);
  assert.match(seasons, /useState<Season>\("winter"\)/);
  assert.match(seasons, /rental-winter-hero-v4\.png/);
  assert.match(seasons, /beach-panorama-2026\.webp/);
  assert.match(seasons, /title: "Коньки"/);
  assert.match(seasons, /title: "Лёд"/);
  assert.match(seasons, /title: "Лыжи"/);
  assert.match(seasons, /title: "Электросноуборд"/);
  assert.match(seasons, /title: "SUP-board"/);
  assert.match(seasons, /title: "Jet-board"/);
  assert.match(seasons, /Детский тариф — до 12 лет включительно/);
  assert.match(seasons, /Лёд включён · размеры 30–47/);
  assert.match(seasons, /Со своими коньками · без ограничения по времени/);
  assert.match(seasons, /title: "Электросноуборд"[\s\S]*notice:[\s\S]*При аренде коньков — лёд бесплатный\.[\s\S]*Аренда льда без ограничений по времени\./);
});

test("homepage uses the requested bathhouse artwork", async () => {
  const fs = await import("node:fs/promises");
  const page = await fs.readFile(
    new URL("../app/page.tsx", import.meta.url),
    "utf8",
  );
  const hero = await fs.readFile(
    new URL("../components/ParallaxHeroImage.tsx", import.meta.url),
    "utf8",
  );
  assert.match(page, /<ParallaxHeroImage[\s\S]*src="\/images\/karier-bathhouse-enhanced-4k\.png"/);
  assert.match(page, /className="heroTitleArtwork"[\s\S]*src="\/images\/hero-title\.png"/);
  assert.match(hero, /src=\{src\}/);
  assert.match(hero, /window\.scrollY \* 0\.12/);
  assert.doesNotMatch(page, /src="\/images\/karier-real-hero\.png"/);
  assert.match(page, /Выбрать дату и время/);
});

test("all image-led heroes use the shared parallax image", async () => {
  const fs = await import("node:fs/promises");
  const [cafe, bathhouse, contacts, rental] = await Promise.all([
    fs.readFile(new URL("../app/cafe/page.tsx", import.meta.url), "utf8"),
    fs.readFile(new URL("../app/bathhouse/page.tsx", import.meta.url), "utf8"),
    fs.readFile(new URL("../app/contacts/page.tsx", import.meta.url), "utf8"),
    fs.readFile(new URL("../components/RentalSeasons.tsx", import.meta.url), "utf8"),
  ]);
  for (const page of [cafe, bathhouse, contacts, rental]) {
    assert.match(page, /<ParallaxHeroImage/);
  }
});

test("all top banners share the same responsive height", async () => {
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/hero-heights.css", import.meta.url), "utf8");
  assert.match(css, /\.homeHero,[\s\S]*\.innerHero,[\s\S]*\.rentalHero[\s\S]*height:\s*620px/);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*height:\s*570px/);
});

test("mobile layout does not force a desktop minimum width", async () => {
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.doesNotMatch(css, /(?:html|body)[^{]*\{[^}]*min-width:\s*460px/s);
});

test("uploaded cafe, bathhouse, and beach photos are assigned to the right sections", async () => {
  const fs = await import("node:fs/promises");
  const [home, cafe, bathhouse, site] = await Promise.all([
    fs.readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    fs.readFile(new URL("../app/cafe/page.tsx", import.meta.url), "utf8"),
    fs.readFile(new URL("../app/bathhouse/page.tsx", import.meta.url), "utf8"),
    fs.readFile(new URL("../lib/site.ts", import.meta.url), "utf8"),
  ]);
  assert.match(
    cafe,
    /className="innerHero"[\s\S]*src="\/images\/cafe-hero-enhanced\.png"/,
  );
  assert.match(
    cafe,
    /ImageGallery[\s\S]*cafe-hero\.webp[\s\S]*cafe-interior\.webp[\s\S]*karier-real-cafe\.png/,
  );
  assert.match(
    bathhouse,
    /className="innerHero bathHero"[\s\S]*src="\/images\/karier-real-bathhouse\.png"/,
  );
  assert.match(
    bathhouse,
    /ImageGallery[\s\S]*bathhouse-ice-hole\.webp[\s\S]*bathhouse-room\.png[\s\S]*bathhouse-hero\.png/,
  );
  assert.match(home, /src="\/images\/footer-panorama\.png"/);
  assert.match(site, /image: "\/images\/cafe-card\.webp"/);
  assert.match(site, /image: "\/images\/karier-real-bathhouse\.png"/);
});

test("hero content does not reserve the full hero height", async () => {
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(css, /\.homeHero \.heroContent\s*\{[^}]*height:\s*auto;/s);
  assert.match(css, /\.homeHero \.heroContent\s*\{[^}]*min-height:\s*0;/s);
});

test("homepage hero uses compact responsive height", async () => {
  const fs = await import("node:fs/promises");
  const css = (
    await Promise.all(
      [
        "../app/design-corrections.css",
        "../app/pixel-perfect.css",
        "../app/reference-design.css",
      ].map((file) => fs.readFile(new URL(file, import.meta.url), "utf8")),
    )
  ).join("\n");
  assert.doesNotMatch(css, /height:\s*min\(760px,\s*100svh\)/);
  assert.doesNotMatch(css, /height:\s*min\(700px,\s*100svh\)/);
  assert.match(
    css,
    /@media \(min-width: 1101px\)[\s\S]*?\.homeHero\s*\{[^}]*height:\s*min\(560px,\s*78svh\)/,
  );
  assert.match(
    css,
    /@media \(min-width: 801px\) and \(max-width: 1100px\)[\s\S]*?\.homeHero\s*\{[^}]*height:\s*min\(480px,\s*74svh\)/,
  );
  assert.match(
    css,
    /@media \(max-width: 800px\)[\s\S]*?\.homeHero\s*\{[^}]*height:\s*min\(430px,\s*100svh\)/,
  );
});

test("hero content keeps the desktop header, message, and action visually separated", async () => {
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(
    css,
    /@media \(min-width: 1101px\)[\s\S]*?\.homeHero \.heroContent\s*\{[^}]*padding-top:\s*clamp\(178px,\s*24svh,\s*205px\)/,
  );
  assert.match(
    css,
    /@media \(min-width: 801px\) and \(max-width: 1100px\)[\s\S]*?\.homeHero \.heroContent\s*\{[^}]*padding-top:\s*clamp\(108px,\s*17svh,\s*128px\)/,
  );
  assert.match(
    css,
    /@media \(min-width: 801px\) and \(max-width: 1100px\)[\s\S]*?\.homeHero \.heroActions\s*\{[^}]*margin-top:\s*26px/,
  );
  assert.match(
    css,
    /@media \(min-width: 1101px\)[\s\S]*?\.homeHero \.heroContent\s*\{[^}]*padding-left:\s*0/,
  );
  assert.match(
    css,
    /@media \(min-width: 801px\) and \(max-width: 1100px\)[\s\S]*?\.homeHero \.heroContent\s*\{[^}]*padding-left:\s*0/,
  );
  assert.match(
    css,
    /@media \(max-width: 800px\)[\s\S]*?\.homeHero \.heroContent\s*\{[^}]*padding-top:\s*clamp\(18px,\s*5svh,\s*32px\)/,
  );
});

test("panorama has no decorative white transition overlays", async () => {
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(css, /--paper:\s*#f6f2e9/);
  assert.match(
    css,
    /\.homePanorama::before,\s*\.homePanorama::after\s*\{[^}]*content:\s*none\s*!important;[^}]*display:\s*none\s*!important;/s,
  );
  assert.match(
    css,
    /\.panoramaNote::after\s*\{[^}]*content:\s*none\s*!important;[^}]*display:\s*none\s*!important;/s,
  );
  assert.match(
    css,
    /\.homePanorama \.closingShade\s*\{[^}]*linear-gradient\(/s,
  );
  assert.match(css, /\.footer\s*\{[^}]*box-shadow:\s*0 -14px 30px/s);
  assert.match(
    css,
    /\.homePanorama\s*\{[^}]*height:\s*clamp\(390px,\s*33\.34vw,\s*520px\)/s,
  );
});

test("header booking button uses the same brush treatment as hero CTA", async () => {
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(css, /^\.button-cream::before\s*\{/m);
  assert.match(
    css,
    /^\.button-cream\s*\{[^}]*position:\s*relative;[^}]*background:\s*transparent;/ms,
  );
});

test("all shared cream ButtonLink CTAs use the common brush frame", async () => {
  const fs = await import("node:fs/promises");
  const css = await fs.readFile(
    new URL("../app/design-corrections.css", import.meta.url),
    "utf8",
  );
  const legacyCss = await fs.readFile(
    new URL("../app/pixel-perfect.css", import.meta.url),
    "utf8",
  );
  assert.match(
    css,
    /^\.button-cream::before\s*\{[\s\S]*?inset:\s*-7px\s+-12px;/ms,
  );
  assert.match(
    css,
    /^\.button-cream\s*\{[^}]*position:\s*relative;[^}]*background:\s*transparent;[^}]*clip-path:\s*none;[^}]*isolation:\s*isolate;/ms,
  );
  assert.doesNotMatch(
    legacyCss,
    /\.homeHero \.heroActions \.button\s*\{[^}]*clip-path:\s*polygon/s,
  );
  assert.doesNotMatch(
    legacyCss,
    /\.homeCards \.textLink\s*\{[^}]*clip-path:\s*polygon/s,
  );
});

test("dark ButtonLink CTAs use the same brush frame without losing their color", async () => {
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(
    css,
    /^\.button-dark::before\s*\{[\s\S]*?inset:\s*-7px\s+-12px;[\s\S]*?background:\s*var\(--ink\);/ms,
  );
  assert.match(
    css,
    /^\.button-dark\s*\{[^}]*position:\s*relative;[^}]*background:\s*transparent;[^}]*clip-path:\s*none;[^}]*isolation:\s*isolate;/ms,
  );
});

test("social buttons match the compact outline reference", async () => {
  const fs = await import("node:fs/promises");
  const css = await fs.readFile(
    new URL("../app/design-corrections.css", import.meta.url),
    "utf8",
  );
  const footer = await fs.readFile(
    new URL("../components/Footer.tsx", import.meta.url),
    "utf8",
  );
  assert.match(footer, /BiLogoVk/);
  assert.match(footer, /FaTelegramPlane/);
  assert.match(
    css,
    /\.footerSocials \.footerSocial\s*\{[^}]*width:\s*38px;[^}]*height:\s*38px;[^}]*border:\s*1\.5px/s,
  );
  assert.match(
    css,
    /\.footerSocials \.footerSocial svg\s*\{[^}]*width:\s*20px;[^}]*height:\s*20px/s,
  );
  assert.match(
    css,
    /@media \(max-width: 800px\)\s*\{[\s\S]*?\.footerMain\s*\{[^}]*flex-direction:\s*column;[^}]*align-items:\s*center;[^}]*text-align:\s*center/s,
  );
});

test("experience cards keep the portrait two-column reference geometry", async () => {
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(
    css,
    /\.homeCards \.experienceGrid\s*\{[^}]*grid-template-columns:\s*repeat\(2,/s,
  );
  assert.match(
    css,
    /\.homeCards \.experienceCard\s*\{[^}]*aspect-ratio:\s*1\.1\s*\/\s*1;/s,
  );
  assert.match(
    css,
    /@media \(max-width: 800px\)[\s\S]*?\.homeCards \.experienceCard\s*\{[^}]*aspect-ratio:\s*0\.74\s*\/\s*1;/s,
  );
  assert.match(
    css,
    /\.homeCards \.experienceContent h3\s*\{[^}]*display:\s*block/s,
  );
  assert.match(css, /\.homeCards \.textLink\s*\{[^}]*display:\s*none/s);
  assert.match(
    css,
    /\.homeCards \.cardShade\s*\{[^}]*rgba\(10, 17, 14, 0\.28\)[^}]*transparent 82%[^}]*rgba\(10, 17, 14, 0\.16\)/s,
  );
  assert.match(
    css,
    /\.homeCards \.experienceCard:hover img\s*\{[^}]*scale\(1\.015\)/s,
  );
  assert.match(
    css,
    /\.homeCards \.experienceCardLink\s*\{[^}]*inset:\s*0;[^}]*overflow:\s*hidden/s,
  );
  assert.match(
    css,
    /@media \(max-width: 600px\)[\s\S]*?\.homeCards \.experienceGrid\s*\{[^}]*grid-template-columns:\s*1fr/s,
  );
});

test("homepage includes the manifesto strip between cards and panorama", async () => {
  const page = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const manifesto = await (
    await import("node:fs/promises")
  ).readFile(
    new URL("../components/HomeManifesto.tsx", import.meta.url),
    "utf8",
  );
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(
    page,
    /<section className="pageWidth homeCards"[\s\S]*<HomeManifesto \/>[\s\S]*<section className="homePanorama"/,
  );
  assert.match(manifesto, /ПРИРОДА\. ХОРОШИЕ ЛЮДИ\.[\s\S]*ВКУСНЫЕ МОМЕНТЫ\./);
  assert.match(manifesto, /Константиновский карьер/);
  assert.doesNotMatch(manifesto, /LuTrees/);
  assert.match(css, /\.homeManifesto\s*\{[^}]*background:\s*transparent/s);
  assert.match(
    css,
    /\.homeManifesto::after\s*\{[^}]*content:\s*none;[^}]*display:\s*none;/s,
  );
  assert.match(
    css,
    /\.homeManifesto \.manifestoNote\s*\{[^}]*grid-column:\s*1;/s,
  );
  assert.match(
    css,
    /\.homeManifesto\s*\{[^}]*grid-template-columns:\s*auto auto;[^}]*justify-content:\s*center/s,
  );
  assert.match(
    css,
    /\.homeManifesto \.manifestoNote::before\s*\{[^}]*background:\s*var\(--cream\);[^}]*manifesto-brush\.png/s,
  );
  assert.match(
    css,
    /\.homeManifesto \.manifestoNote svg\s*\{[^}]*width:\s*0\.95em;[^}]*height:\s*0\.95em;[^}]*stroke-width:\s*2\.4/s,
  );
});

test("medium desktop cards keep stable text flow", async () => {
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(
    css,
    /@media \(min-width: 801px\) and \(max-width: 1100px\)[\s\S]*?\.homeCards \.experienceContent\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*align-items:\s*flex-start/s,
  );
  assert.match(
    css,
    /@media \(max-width: 800px\)[\s\S]*?\.manifestoNote\s*\{[^}]*grid-column:\s*auto;/s,
  );
});

test("large desktop cards do not reintroduce percentage side cuts", async () => {
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.doesNotMatch(css, /99%\s+17%[\s\S]*97%\s+30%[\s\S]*100%\s+43%/);
  assert.doesNotMatch(
    css,
    /@media \(min-width: 801px\)[\s\S]*?\.homeCards \.experienceCard\s*\{[^}]*clip-path:\s*polygon/s,
  );
});

test("experience card frame is shared across every breakpoint", async () => {
  const fs = await import("node:fs/promises");
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  const legacyCss = await fs.readFile(
    new URL("../app/pixel-perfect.css", import.meta.url),
    "utf8",
  );
  assert.match(
    css,
    /\.homeCards \.experienceCard\s*\{[^}]*padding:\s*0;[^}]*border:\s*0;[^}]*border-radius:\s*10px;[^}]*background:\s*transparent;[^}]*overflow:\s*hidden;[^}]*clip-path:\s*none/s,
  );
  assert.match(
    css,
    /\.homeCards \.experienceCard\s*\{[^}]*box-shadow:[^}]*0 12px 28px/s,
  );
  assert.match(
    css,
    /\.homeCards \.experienceCard:hover\s*\{[^}]*translateY\(-2px\);[^}]*0 18px 38px/s,
  );
  assert.match(
    css,
    /\.homeCards \.experienceContent::before\s*\{[^}]*inset:\s*-16px -38px -18px;[^}]*background:\s*rgba\(18, 29, 25, 0\.82\);[^}]*manifesto-brush\.png/s,
  );
  assert.doesNotMatch(
    css,
    /\.homeCards \.experienceCard\s*\{[^}]*border:\s*[678]px/is,
  );
  assert.match(
    css,
    /\.homeCards \.experienceCard::before\s*\{[^}]*content:\s*none;[^}]*display:\s*none;/s,
  );
  assert.match(
    css,
    /\.homeCards \.experienceCardLink\s*\{[^}]*inset:\s*0;[^}]*overflow:\s*hidden/s,
  );
  assert.doesNotMatch(
    legacyCss,
    /\.homeCards \.experienceCard\s*\{[^}]*border:/s,
  );
  assert.doesNotMatch(
    legacyCss,
    /\.homeCards \.experienceCard\s*\{[^}]*clip-path:/s,
  );
});

test("inner heroes use the shared three-font type system", async () => {
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(
    css,
    /\.innerHero h1\s*\{[^}]*font-family:\s*var\(--font-condensed\);[^}]*font-style:\s*normal;[^}]*text-transform:\s*uppercase/s,
  );
  assert.match(
    css,
    /\.innerHero h1 em\s*\{[^}]*font-family:\s*var\(--font-script\);[^}]*font-style:\s*normal;[^}]*text-transform:\s*none/s,
  );
  assert.match(
    css,
    /\.innerHeroContent > p\s*\{[^}]*font-family:\s*var\(--font-sans\)/s,
  );
});

test("contacts page embeds the confirmed Yandex map point", async () => {
  const page = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/contacts/page.tsx", import.meta.url), "utf8");
  assert.match(
    page,
    /yandex\.ru\/map-widget\/v1\/\?ll=35\.995277%2C56\.846352/,
  );
  assert.match(page, /pt=35\.995277%2C56\.846352/);
  assert.match(page, /Открыть в Яндекс Картах/);
  assert.doesNotMatch(page, /Точная точка появится после подтверждения адреса/);
});

test("booking CTAs share the configurable YCLIENTS destination", async () => {
  const fs = await import("node:fs/promises");
  const files = await Promise.all(
    [
      "../app/page.tsx",
      "../app/cafe/page.tsx",
      "../app/bathhouse/page.tsx",
      "../app/contacts/page.tsx",
      "../components/Header.tsx",
      "../components/BookingBand.tsx",
    ].map((file) => fs.readFile(new URL(file, import.meta.url), "utf8")),
  );
  assert.ok(files.every((file) => file.includes("site.bookingUrl")));
  const siteConfig = await fs.readFile(
    new URL("../lib/site.ts", import.meta.url),
    "utf8",
  );
  assert.match(
    siteConfig,
    /NEXT_PUBLIC_YCLIENTS_URL\s*\|\|\s*"https:\/\/n1129088\.yclients\.ru"/,
  );
  assert.match(siteConfig, /ctaHref:\s*site\.bookingUrl/);
});

test("contacts page uses the image-led booking layout instead of the mail form", async () => {
  const page = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/contacts/page.tsx", import.meta.url), "utf8");
  assert.match(page, /contactsVisualHero/);
  assert.match(page, /contactBookingCard/);
  assert.doesNotMatch(page, /<form|bookingForm/);
});

test("navigation stays fixed and switches to a glass background after scrolling", async () => {
  const fs = await import("node:fs/promises");
  const [header, css] = await Promise.all([
    fs.readFile(new URL("../components/Header.tsx", import.meta.url), "utf8"),
    fs.readFile(
      new URL("../app/design-corrections.css", import.meta.url),
      "utf8",
    ),
  ]);
  assert.match(header, /window\.scrollY > 18/);
  assert.match(header, /siteHeaderScrolled/);
  assert.match(
    css,
    /\.siteHeader\s*\{[^}]*position:\s*fixed;[^}]*z-index:\s*50;[^}]*height:\s*96px/s,
  );
  assert.match(
    css,
    /\.siteHeaderScrolled\s*\{[^}]*backdrop-filter:\s*blur\(12px\)/s,
  );
  assert.match(
    css,
    /@media \(max-width: 800px\)[\s\S]*?\.siteHeader\s*\{[^}]*height:\s*76px/s,
  );
  assert.match(
    css,
    /@media \(max-width: 800px\)[\s\S]*?\.siteHeader \.logoArtwork\s*\{[^}]*width:\s*100px;[^}]*height:\s*52px;[^}]*object-fit:\s*contain/s,
  );
});

test("inner content cards keep rounded elevated frames", async () => {
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(
    css,
    /\.menuPreview\s*\{[^}]*overflow:\s*hidden;[^}]*border-radius:\s*12px;[^}]*box-shadow:/s,
  );
  assert.match(
    css,
    /\.ritualPhoto\s*\{[^}]*overflow:\s*hidden;[^}]*border-radius:\s*12px;[^}]*box-shadow:/s,
  );
});

test("footer social links point to the confirmed venue profiles", async () => {
  const footer = await (
    await import("node:fs/promises")
  ).readFile(new URL("../components/Footer.tsx", import.meta.url), "utf8");
  assert.match(footer, /https:\/\/vk\.ru\/tverplazh/);
  assert.match(footer, /https:\/\/t\.me\/restinginthetver/);
  assert.match(footer, /https:\/\/www\.instagram\.com\/tverplazh\//);
});

test("panorama paper edge asset exists", async () => {
  const fs = await import("node:fs/promises");
  await fs.access(new URL("../public/images/paper-torn-edge.svg", import.meta.url));
});

test("confirmed venue contact details replace placeholder data", async () => {
  const fs = await import("node:fs/promises");
  const [siteConfig, contacts, jsonLd] = await Promise.all([
    fs.readFile(new URL("../lib/site.ts", import.meta.url), "utf8"),
    fs.readFile(new URL("../app/contacts/page.tsx", import.meta.url), "utf8"),
    fs.readFile(new URL("../components/JsonLd.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(siteConfig, /\+7 \(967\) 777-37-71/);
  assert.match(siteConfig, /tel:\+79677773771/);
  assert.match(siteConfig, /Константиновский карьер, центральный пляж/);
  assert.doesNotMatch(siteConfig, /900|123-45-67|hello@/);
  assert.doesNotMatch(contacts, /mailto:|макетные данные/);
  assert.doesNotMatch(jsonLd, /email:/);
});

test("contacts hero uses the current bar panorama", async () => {
  const page = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/contacts/page.tsx", import.meta.url), "utf8");
  assert.match(page, /\/images\/beach-panorama-2026\.webp/);
});

test("desktop footer contact details remain readable", async () => {
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(
    css,
    /@media \(min-width: 801px\)[\s\S]*?\.footerContacts\s*\{[^}]*font-size:\s*12px;[^}]*line-height:\s*1\.35/s,
  );
});

test("tablet layout uses a burger before the full header can overflow", async () => {
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(
    css,
    /\.homeHero\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*none/s,
  );
  assert.match(
    css,
    /@media \(min-width: 801px\) and \(max-width: 1100px\)[\s\S]*?\.siteHeader \.desktopNav,[\s\S]*?\.siteHeader \.headerBooking\s*\{[^}]*display:\s*none/s,
  );
  assert.match(
    css,
    /@media \(min-width: 801px\) and \(max-width: 1100px\)[\s\S]*?\.siteHeader \.mobileMenu\s*\{[^}]*display:\s*block/s,
  );
  assert.match(
    css,
    /@media \(min-width: 801px\) and \(max-width: 1100px\)[\s\S]*?\.contactGridDesigned\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/s,
  );
  assert.match(
    css,
    /@media \(min-width: 801px\) and \(max-width: 1100px\)[\s\S]*?\.footerContacts\s*\{[^}]*flex-wrap:\s*wrap/s,
  );
});

test("contact icons keep a consistent fixed size beside long text", async () => {
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(
    css,
    /\.contactGridDesigned \.contactPanel > a > svg,[\s\S]*?\.contactGridDesigned \.contactPanel > div > svg\s*\{[^}]*flex:\s*0 0 24px;[^}]*width:\s*24px;[^}]*height:\s*24px/s,
  );
});

test("mobile menu button has a clear hamburger and open state", async () => {
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(
    css,
    /\.siteHeader \.mobileMenu summary span\s*\{[^}]*width:\s*18px;[^}]*height:\s*2px/s,
  );
  assert.match(
    css,
    /\.mobileMenu\[open\] summary span:nth-child\(1\)[^{]*\{[^}]*rotate\(45deg\)/s,
  );
  assert.match(
    css,
    /\.mobileMenu\[open\] summary span:nth-child\(2\)[^{]*\{[^}]*opacity:\s*0/s,
  );
  assert.match(
    css,
    /\.siteHeader \.mobileMenu nav\s*\{[^}]*max-height:\s*calc\(100dvh - 92px\);[^}]*overflow-y:\s*auto/s,
  );
});

test("homepage and inner pages share one content width", async () => {
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/content-widths.css", import.meta.url), "utf8");
  assert.match(css, /\.pageWidth,[\s\S]*?\.headerInner,[\s\S]*?\.homeCards\s*\{/s);
  assert.match(css, /--site-content-width:\s*1180px/);
  assert.match(css, /width:\s*min\(var\(--site-content-width\),\s*calc\(100% - \(var\(--site-content-gutter\) \* 2\)\)\)/);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*?width:\s*calc\(100% - 32px\)/s);
});

test("menu pages can be turned from the page edges", async () => {
  const component = await (
    await import("node:fs/promises")
  ).readFile(new URL("../components/MenuBook.tsx", import.meta.url), "utf8");
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/menu/menu.css", import.meta.url), "utf8");
  assert.match(component, /className="menuBookEdge menuBookEdge-previous"[\s\S]*?onClick=\{goPrevious\}/s);
  assert.match(component, /className="menuBookEdge menuBookEdge-next"[\s\S]*?onClick=\{goNext\}/s);
  assert.match(css, /\.menuBookEdge\s*\{[^}]*position:\s*absolute;[^}]*width:\s*18%/s);
  assert.match(css, /\.menuBookControls\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*1fr auto 1fr/s);
});

test("menu controls use outlined pill buttons without visible arrows", async () => {
  const component = await (
    await import("node:fs/promises")
  ).readFile(new URL("../components/MenuBook.tsx", import.meta.url), "utf8");
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/menu/menu.css", import.meta.url), "utf8");
  assert.doesNotMatch(component, /<span aria-hidden="true">[←→]<\/span>/);
  assert.match(css, /\.menuBookControls button\s*\{[^}]*border:\s*1px solid[^}]*border-radius:\s*999px/s);
});

test("rental price cards do not render decorative number lines", async () => {
  const component = await (
    await import("node:fs/promises")
  ).readFile(new URL("../components/RentalSeasons.tsx", import.meta.url), "utf8");
  const css = await (
    await import("node:fs/promises")
  ).readFile(new URL("../app/rental.css", import.meta.url), "utf8");
  assert.doesNotMatch(component, /rentalCardTopline|0\{index \+ 1\}/);
  assert.doesNotMatch(css, /rentalCardTopline/);
  assert.match(css, /\.rentalPriceCard h3\s*\{[^}]*margin:\s*0 0 19px/s);
});
