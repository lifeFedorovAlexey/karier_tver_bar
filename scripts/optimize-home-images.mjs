import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Keep the original artwork. Publish pre-encoded sizes so the LCP image never
// waits for the runtime image optimizer after a release or a cache eviction.
const source = new URL("../public/images/karier-bathhouse-enhanced-4k.png", import.meta.url);
const output = new URL("../public/images/optimized/", import.meta.url);
await mkdir(output, { recursive: true });

for (const width of [640, 828, 1280, 1920]) {
  for (const format of ["avif", "webp"]) {
    const { size } = await sharp(fileURLToPath(source))
      .resize({ width, withoutEnlargement: true })
      [format]({ quality: format === "avif" ? 45 : 75, effort: 6 })
      .toFile(fileURLToPath(new URL(`home-hero-${width}.${format}`, output)));
    console.log(`home-hero-${width}.${format}: ${size} bytes`);
  }
}

// Preserve the full-resolution alpha channel used by the CSS masks.
const { size } = await sharp(fileURLToPath(new URL("../public/images/manifesto-brush.webp", import.meta.url)))
  .webp({ quality: 75, alphaQuality: 100, effort: 6 })
  .toFile(fileURLToPath(new URL("manifesto-brush.webp", output)));
console.log(`manifesto-brush.webp: ${size} bytes`);
