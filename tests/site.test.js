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
  const page = await (await import("node:fs/promises")).readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /src="\/images\/karier-hero-final\.png"/);
  assert.doesNotMatch(page, /src="\/images\/karier-real-hero\.png"/);
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
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*?\.homeHero\s*\{[^}]*height:\s*min\(300px,\s*100svh\)/);
});

test("hero content does not keep a large top gap at any breakpoint", async () => {
  const css = await (await import("node:fs/promises")).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(css, /@media \(min-width: 1101px\)[\s\S]*?\.homeHero \.heroContent\s*\{[^}]*padding-top:\s*clamp\(28px,\s*8svh,\s*96px\)/);
  assert.match(css, /@media \(min-width: 801px\) and \(max-width: 1100px\)[\s\S]*?\.homeHero \.heroContent\s*\{[^}]*padding-top:\s*clamp\(24px,\s*7svh,\s*72px\)/);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*?\.homeHero \.heroContent\s*\{[^}]*padding-top:\s*clamp\(18px,\s*5svh,\s*32px\)/);
});

test("panorama has no decorative white transition overlays", async () => {
  const css = await (await import("node:fs/promises")).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(css, /\.homePanorama::before,\s*\.homePanorama::after\s*\{[^}]*content:\s*none\s*!important;[^}]*display:\s*none\s*!important;/s);
  assert.match(css, /\.panoramaNote::after\s*\{[^}]*content:\s*none\s*!important;[^}]*display:\s*none\s*!important;/s);
});

test("header booking button uses the same brush treatment as hero CTA", async () => {
  const css = await (await import("node:fs/promises")).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(css, /\.headerBooking \.button::before/);
  assert.match(css, /\.headerBooking \.button[^,{]*,\s*\.heroActions \.button:not\(\.button-dark\)/s);
});

test("social buttons match the compact outline reference", async () => {
  const fs = await import("node:fs/promises");
  const css = await fs.readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  const footer = await fs.readFile(new URL("../components/Footer.tsx", import.meta.url), "utf8");
  assert.match(footer, /BiLogoVk/);
  assert.match(footer, /FaTelegramPlane/);
  assert.match(css, /\.footerSocials \.footerSocial\s*\{[^}]*width:\s*28px;[^}]*height:\s*28px;[^}]*border:\s*1px/s);
  assert.match(css, /\.footerSocials \.footerSocial svg\s*\{[^}]*width:\s*14px;[^}]*height:\s*14px/s);
});

test("experience cards use the reference frames while keeping brush CTAs", async () => {
  const css = await (await import("node:fs/promises")).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(css, /\.homeCards \.experienceCard\s*\{[^}]*aspect-ratio:\s*2\.75\s*\/\s*1;[^}]*clip-path:\s*polygon/s);
  assert.match(css, /\.homeCards \.textLink::before/);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*?\.homeCards \.experienceCard\s*\{[^}]*aspect-ratio:\s*1\.03\s*\/\s*1;[^}]*padding:\s*8px/s);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*?\.homeCards \.experienceCardLink\s*\{[^}]*inset:\s*8px/s);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*?\.homeCards \.experienceContent h3\s*\{[^}]*display:\s*block/s);
});

test("homepage includes the manifesto strip between cards and panorama", async () => {
  const page = await (await import("node:fs/promises")).readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const manifesto = await (await import("node:fs/promises")).readFile(new URL("../components/HomeManifesto.tsx", import.meta.url), "utf8");
  const css = await (await import("node:fs/promises")).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(page, /<section className="pageWidth homeCards"[\s\S]*<HomeManifesto \/>[\s\S]*<section className="homePanorama"/);
  assert.match(manifesto, /ПРИРОДА\. ХОРОШИЕ ЛЮДИ\.[\s\S]*ВКУСНЫЕ МОМЕНТЫ\./);
  assert.match(manifesto, /Константиновский карьер/);
  assert.match(css, /\.homeManifesto\s*\{[^}]*background:\s*var\(--paper\)/s);
});

test("medium desktop cards keep the final frame and stable text flow", async () => {
  const css = await (await import("node:fs/promises")).readFile(new URL("../app/design-corrections.css", import.meta.url), "utf8");
  assert.match(css, /@media \(min-width: 801px\) and \(max-width: 1100px\)[\s\S]*?\.homeCards \.experienceCard\s*\{[^}]*aspect-ratio:\s*2\.75\s*\/\s*1;[^}]*border:\s*0;[^}]*clip-path:\s*polygon/s);
  assert.match(css, /@media \(min-width: 801px\) and \(max-width: 1100px\)[\s\S]*?\.homeCards \.experienceContent\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*align-items:\s*flex-start/s);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*?\.manifestoNote\s*\{[^}]*grid-column:\s*auto;/s);
});
