import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { routes } from "../lib/site.test-data.js";

// Inspect the actual production output, not the source metadata declarations.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
const output = new URL("../.next/server/app/", import.meta.url);
const readOutput = (name) => readFile(new URL(name, output), "utf8");

function meta(html, name) {
  return html.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`))?.[1];
}

test("production pages have unique titles, descriptions and canonical URLs", async () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const route of routes) {
    const html = await readOutput(`${route === "/" ? "index" : route.slice(1)}.html`);
    const url = `${siteUrl}${route === "/" ? "" : route}`;
    const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)];
    assert.equal(canonicals.length, 1, route);
    assert.equal(canonicals[0][1], url, route);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    const description = meta(html, "description");
    assert.ok(title && description, route);
    assert.ok(!titles.has(title), `duplicate title: ${route}`);
    assert.ok(!descriptions.has(description), `duplicate description: ${route}`);
    titles.add(title);
    descriptions.add(description);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, route);
    assert.equal(meta(html, "og:url"), url, route);
    assert.equal(meta(html, "twitter:image"), meta(html, "og:image"), route);
    assert.match(meta(html, "robots"), /index, follow/);
    assert.doesNotMatch(meta(html, "robots"), /noindex/);
    const structuredData = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.ok(structuredData.length > 0, route);
    for (const [, data] of structuredData) {
      assert.equal(JSON.parse(data)["@context"], "https://schema.org");
      assert.ok(data.includes(siteUrl), route);
      assert.doesNotMatch(data, /http:\/\/147\.45\.189\.80/);
    }
  }
});

test("sitemap and robots expose all six canonical pages", async () => {
  const sitemap = await readOutput("sitemap.xml.body");
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(urls.sort(), routes.map((route) => `${siteUrl}${route === "/" ? "" : route}`).sort());
  const robots = await readOutput("robots.txt.body");
  assert.ok(robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`));
  assert.doesNotMatch(robots, /^Disallow:\s*\/\s*$/m);
});

test("mirrors redirect permanently while the canonical host and health checks do not", async () => {
  const manifest = JSON.parse(await readFile(new URL("../.next/routes-manifest.json", import.meta.url), "utf8"));
  const hostRedirects = manifest.redirects.filter((rule) => rule.has?.some((condition) => condition.type === "host"));
  for (const host of ["www.tverplazh.ru", "147.45.189.80"]) {
    const rule = hostRedirects.find((rule) => rule.has.some((condition) => new RegExp(`^${condition.value}$`).test(host)));
    assert.ok(rule, host);
    assert.equal(rule.statusCode, 308);
    assert.equal(rule.destination, "https://tverplazh.ru/:path*");
  }
  for (const host of ["tverplazh.ru", "127.0.0.1", "localhost", "wwwXtverplazhXru"]) {
    assert.ok(!hostRedirects.some((rule) => rule.has.some((condition) => new RegExp(`^${condition.value}$`).test(host))), host);
  }
});

test("Yandex ownership verification is shipped as a public HTML file", async () => {
  const html = await readFile(new URL("../public/yandex_30d979d06d403ed8.html", import.meta.url), "utf8");
  assert.match(html, /<body>Verification: 30d979d06d403ed8<\/body>/);
});
