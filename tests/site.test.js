import assert from "node:assert/strict";
import test from "node:test";
import { navLabels, routes } from "../lib/site.test-data.js";

test("сайт содержит пять уникальных публичных маршрутов", () => {
  assert.equal(routes.length, 5);
  assert.equal(new Set(routes).size, routes.length);
  assert.ok(routes.includes("/menu"));
  assert.deepEqual(navLabels, ["Главная", "Кафе", "Баня", "Контакты"]);
});

test("маршруты используют канонические URL без завершающего слеша", () => {
  assert.ok(routes.every((route) => route === "/" || !route.endsWith("/")));
});

test("homepage uses the final hero artwork", async () => {
  const fs = await import("node:fs/promises");
  const page = await fs.readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const hero = await fs.readFile(new URL("../components/ParallaxHeroImage.tsx", import.meta.url), "utf8");
  assert.match(page, /<ParallaxHeroImage \/>/);
  assert.match(hero, /src="\/images\/karier-hero-final\.png"/);
  assert.match(hero, /window\.scrollY \* 0\.22/);
  assert.doesNotMatch(page, /src="\/images\/karier-real-hero\.png"/);
});

test("mobile layout does not force a desktop minimum width", async () => {
  const css = await (await import("node:fs/promises")).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
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
  assert.match(cafe, /src="\/images\/cafe-hero\.webp"/);
  assert.match(cafe, /src="\/images\/cafe-interior\.webp"/);
  assert.match(bathhouse, /src="\/images\/bathhouse-hero\.webp"/);
  assert.match(bathhouse, /src="\/images\/bathhouse-room\.webp"/);
  assert.match(home, /src="\/images\/footer-panorama\.png"/);
  assert.match(site, /image: "\/images\/cafe-card\.webp"/);
  assert.match(site, /image: "\/images\/karier-real-bathhouse\.png"/);
});

test("hero content does not reserve the full hero height", async () => {
  const css = await (await import("node:fs/promises")).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(css, /\.homeHero \.heroContent\s*\{[^}]*height:\s*auto;/s);
  assert.match(css, /\.homeHero \.heroContent\s*\{[^}]*min-height:\s*0;/s);
});

test("homepage hero uses compact responsive height", async () => {
  const fs = await import("node:fs/promises");
  const css = (await Promise.all([
    "../app/design-corrections.css",
    "../app/pixel-perfect.css",
    "../app/reference-design.css",
  ].map((file) => fs.readFile(new URL(file, import.meta.url), "utf8")))).join("\n");
  assert.doesNotMatch(css, /height:\s*min\(760px,\s*100svh\)/);
  assert.doesNotMatch(css, /height:\s*min\(700px,\s*100svh\)/);
  assert.match(css, /@media \(min-width: 1101px\)[\s\S]*?\.homeHero\s*\{[^}]*height:\s*min\(400px,\s*72svh\)/);
  assert.match(css, /@media \(min-width: 801px\) and \(max-width: 1100px\)[\s\S]*?\.homeHero\s*\{[^}]*height:\s*min\(360px,\s*68svh\)/);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*?\.homeHero\s*\{[^}]*height:\s*min\(320px,\s*100svh\)/);
});

test("hero content does not keep a large top gap at any breakpoint", async () => {
  const css = await (await import("node:fs/promises")).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(css, /@media \(min-width: 1101px\)[\s\S]*?\.homeHero \.heroContent\s*\{[^}]*padding-top:\s*clamp\(28px,\s*8svh,\s*96px\)/);
  assert.match(css, /@media \(min-width: 801px\) and \(max-width: 1100px\)[\s\S]*?\.homeHero \.heroContent\s*\{[^}]*padding-top:\s*clamp\(24px,\s*7svh,\s*72px\)/);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*?\.homeHero \.heroContent\s*\{[^}]*padding-top:\s*clamp\(18px,\s*5svh,\s*32px\)/);
});

test("panorama has no decorative white transition overlays", async () => {
  const css = await (await import("node:fs/promises")).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(css, /--paper:\s*#f6f2e9/);
  assert.match(css, /\.homePanorama::before,\s*\.homePanorama::after\s*\{[^}]*content:\s*none\s*!important;[^}]*display:\s*none\s*!important;/s);
  assert.match(css, /\.panoramaNote::after\s*\{[^}]*content:\s*none\s*!important;[^}]*display:\s*none\s*!important;/s);
  assert.match(css, /\.homePanorama \.closingShade\s*\{[^}]*linear-gradient\(/s);
  assert.match(css, /\.footer\s*\{[^}]*box-shadow:\s*0 -14px 30px/s);
});

test("header booking button uses the same brush treatment as hero CTA", async () => {
  const css = await (await import("node:fs/promises")).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(css, /^\.button-cream::before\s*\{/m);
  assert.match(css, /^\.button-cream\s*\{[^}]*position:\s*relative;[^}]*background:\s*transparent;/ms);
});

test("all shared cream ButtonLink CTAs use the common brush frame", async () => {
  const fs = await import("node:fs/promises");
  const css = await fs.readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  const legacyCss = await fs.readFile(new URL("../app/pixel-perfect.css", import.meta.url), "utf8");
  assert.match(css, /^\.button-cream::before\s*\{[\s\S]*?inset:\s*-7px\s+-12px;/ms);
  assert.match(css, /^\.button-cream\s*\{[^}]*position:\s*relative;[^}]*background:\s*transparent;[^}]*clip-path:\s*none;[^}]*isolation:\s*isolate;/ms);
  assert.doesNotMatch(legacyCss, /\.homeHero \.heroActions \.button\s*\{[^}]*clip-path:\s*polygon/s);
  assert.doesNotMatch(legacyCss, /\.homeCards \.textLink\s*\{[^}]*clip-path:\s*polygon/s);
});

test("dark ButtonLink CTAs use the same brush frame without losing their color", async () => {
  const css = await (await import("node:fs/promises")).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(css, /^\.button-dark::before\s*\{[\s\S]*?inset:\s*-7px\s+-12px;[\s\S]*?background:\s*var\(--ink\);/ms);
  assert.match(css, /^\.button-dark\s*\{[^}]*position:\s*relative;[^}]*background:\s*transparent;[^}]*clip-path:\s*none;[^}]*isolation:\s*isolate;/ms);
});

test("social buttons match the compact outline reference", async () => {
  const fs = await import("node:fs/promises");
  const css = await fs.readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  const footer = await fs.readFile(new URL("../components/Footer.tsx", import.meta.url), "utf8");
  assert.match(footer, /BiLogoVk/);
  assert.match(footer, /FaTelegramPlane/);
  assert.match(css, /\.footerSocials \.footerSocial\s*\{[^}]*width:\s*38px;[^}]*height:\s*38px;[^}]*border:\s*1\.5px/s);
  assert.match(css, /\.footerSocials \.footerSocial svg\s*\{[^}]*width:\s*20px;[^}]*height:\s*20px/s);
  assert.match(css, /@media \(max-width: 800px\)\s*\{[\s\S]*?\.footerMain\s*\{[^}]*flex-direction:\s*column;[^}]*align-items:\s*center;[^}]*text-align:\s*center/s);
});

test("experience cards keep the portrait two-column reference geometry", async () => {
  const css = await (await import("node:fs/promises")).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(css, /\.homeCards \.experienceGrid\s*\{[^}]*grid-template-columns:\s*repeat\(2,/s);
  assert.match(css, /\.homeCards \.experienceCard\s*\{[^}]*aspect-ratio:\s*1\.1\s*\/\s*1;/s);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*?\.homeCards \.experienceCard\s*\{[^}]*aspect-ratio:\s*0\.74\s*\/\s*1;/s);
  assert.match(css, /\.homeCards \.experienceContent h3\s*\{[^}]*display:\s*block/s);
  assert.match(css, /\.homeCards \.textLink\s*\{[^}]*display:\s*none/s);
  assert.match(css, /\.homeCards \.experienceCardLink\s*\{[^}]*inset:\s*0;[^}]*overflow:\s*hidden/s);
  assert.match(css, /@media \(max-width: 600px\)[\s\S]*?\.homeCards \.experienceGrid\s*\{[^}]*grid-template-columns:\s*1fr/s);
});

test("homepage includes the manifesto strip between cards and panorama", async () => {
  const page = await (await import("node:fs/promises")).readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const manifesto = await (await import("node:fs/promises")).readFile(new URL("../components/HomeManifesto.tsx", import.meta.url), "utf8");
  const css = await (await import("node:fs/promises")).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(page, /<section className="pageWidth homeCards"[\s\S]*<HomeManifesto \/>[\s\S]*<section className="homePanorama"/);
  assert.match(manifesto, /ПРИРОДА\. ХОРОШИЕ ЛЮДИ\.[\s\S]*ВКУСНЫЕ МОМЕНТЫ\./);
  assert.match(manifesto, /Константиновский карьер/);
  assert.doesNotMatch(manifesto, /LuTrees/);
  assert.match(css, /\.homeManifesto\s*\{[^}]*background:\s*transparent/s);
  assert.match(css, /\.homeManifesto::after\s*\{[^}]*content:\s*none;[^}]*display:\s*none;/s);
  assert.match(css, /\.homeManifesto \.manifestoNote\s*\{[^}]*grid-column:\s*1;/s);
  assert.match(css, /\.homeManifesto\s*\{[^}]*grid-template-columns:\s*auto auto;[^}]*justify-content:\s*center/s);
  assert.match(css, /\.homeManifesto \.manifestoNote::before\s*\{[^}]*background:\s*var\(--cream\);[^}]*manifesto-brush\.png/s);
  assert.match(css, /\.homeManifesto \.manifestoNote svg\s*\{[^}]*width:\s*0\.95em;[^}]*height:\s*0\.95em;[^}]*stroke-width:\s*2\.4/s);
});

test("medium desktop cards keep stable text flow", async () => {
  const css = await (await import("node:fs/promises")).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(css, /@media \(min-width: 801px\) and \(max-width: 1100px\)[\s\S]*?\.homeCards \.experienceContent\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*align-items:\s*flex-start/s);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*?\.manifestoNote\s*\{[^}]*grid-column:\s*auto;/s);
});

test("large desktop cards do not reintroduce percentage side cuts", async () => {
  const css = await (await import("node:fs/promises")).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.doesNotMatch(css, /99%\s+17%[\s\S]*97%\s+30%[\s\S]*100%\s+43%/);
  assert.doesNotMatch(css, /@media \(min-width: 801px\)[\s\S]*?\.homeCards \.experienceCard\s*\{[^}]*clip-path:\s*polygon/s);
});

test("experience card frame is shared across every breakpoint", async () => {
  const fs = await import("node:fs/promises");
  const css = await (await import("node:fs/promises")).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  const legacyCss = await fs.readFile(new URL("../app/pixel-perfect.css", import.meta.url), "utf8");
  assert.match(css, /\.homeCards \.experienceCard\s*\{[^}]*padding:\s*0;[^}]*border:\s*0;[^}]*border-radius:\s*10px;[^}]*background:\s*transparent;[^}]*overflow:\s*hidden;[^}]*clip-path:\s*none/s);
  assert.match(css, /\.homeCards \.experienceCard\s*\{[^}]*box-shadow:[^}]*0 12px 28px/s);
  assert.match(css, /\.homeCards \.experienceCard:hover\s*\{[^}]*translateY\(-3px\);[^}]*0 18px 38px/s);
  assert.match(css, /\.homeCards \.experienceContent::before\s*\{[^}]*background:\s*rgba\(18, 29, 25, 0\.82\);[^}]*manifesto-brush\.png/s);
  assert.doesNotMatch(css, /\.homeCards \.experienceCard\s*\{[^}]*border:\s*[678]px/si);
  assert.match(css, /\.homeCards \.experienceCard::before\s*\{[^}]*content:\s*none;[^}]*display:\s*none;/s);
  assert.match(css, /\.homeCards \.experienceCardLink\s*\{[^}]*inset:\s*0;[^}]*overflow:\s*hidden/s);
  assert.doesNotMatch(legacyCss, /\.homeCards \.experienceCard\s*\{[^}]*border:/s);
  assert.doesNotMatch(legacyCss, /\.homeCards \.experienceCard\s*\{[^}]*clip-path:/s);
});
