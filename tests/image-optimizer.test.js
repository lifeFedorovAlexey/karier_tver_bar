import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import test from "node:test";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { fetchInternalImage } = require("next/dist/server/image-optimizer");
const { serveStatic } = require("next/dist/server/serve-static");
const imagesRoot = fileURLToPath(new URL("../public/images/", import.meta.url));
const imageName = "hero-title.webp";

// Regression for https://github.com/vercel/next.js/issues/96538.
// A disconnected visitor must not leave a shared image transform pending.
for (const connected of [true, false]) {
  test(`image source completes when the requesting client is ${connected ? "connected" : "disconnected"}`, async () => {
    const source = await readFile(new URL(`../public/images/${imageName}`, import.meta.url));
    const socket = Object.assign(new EventEmitter(), {
      writable: connected,
      destroyed: !connected,
    });
    let deadline;

    try {
      const result = await Promise.race([
        fetchInternalImage(
          `/images/${imageName}`,
          { method: "GET", socket },
          {},
          1_000_000,
          (req, res) => serveStatic(req, res, imageName, { root: imagesRoot }),
        ),
        new Promise((_, reject) => {
          deadline = setTimeout(() => reject(new Error("Image source fetch hung after client disconnect")), 5_000);
        }),
      ]);

      assert.equal(result.contentType, "image/webp");
      assert.deepEqual(result.buffer, source);
    } finally {
      clearTimeout(deadline);
    }
  });
}
