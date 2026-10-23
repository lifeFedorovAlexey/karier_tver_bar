import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

async function loadComponent(file, context, imports) {
  const source = await readFile(new URL(`../components/${file}`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  });
  const exports = {};
  runInNewContext(outputText, { ...context, exports, require: (name) => {
    assert.ok(name in imports, `unexpected import: ${name}`);
    return imports[name];
  } });
  return exports;
}

test("Metrika queues the first view, SPA navigation and goals before the deferred tracker loads", async () => {
  const listeners = new Map();
  const location = { href: "https://tverplazh.ru/?utm_source=test" };
  const document = {
    title: "Карьер", referrer: "https://yandex.ru/", scripts: [],
    createElement: () => { assert.fail("bootstrap must not start a tracker download"); },
    addEventListener: (name, handler) => listeners.set(name, handler),
  };
  const window = {
    location,
    addEventListener: (name, handler) => listeners.set(name, handler),
    removeEventListener: (name) => listeners.delete(name),
    dispatchEvent: (event) => listeners.get(event.type)?.(),
  };
  class Element { closest() { return this; } getAttribute() { return "booking_click"; } }
  const context = { window, document, location, Element, Event: class { constructor(type) { this.type = type; } } };
  const jsx = (type, props) => ({ type, props });
  const { Metrika } = await loadComponent("Metrika.tsx", {
    process: { env: { NEXT_PUBLIC_YANDEX_METRIKA_ID: "113267829" } },
  }, {
    "next/script": { default: "script" },
    react: { Suspense: "suspense" },
    "react/jsx-runtime": { jsx, jsxs: jsx },
    "@/components/MetrikaNavigation": { MetrikaNavigation: "navigation" },
  });
  const children = Metrika().props.children;
  const script = children.find((child) => child.props.id === "yandex-metrika");
  const loader = children.find((child) => child.props.id === "yandex-metrika-loader");
  assert.equal(script.props.strategy, "afterInteractive");
  assert.equal(loader.props.strategy, "lazyOnload");
  assert.equal(loader.props.src, "https://mc.yandex.ru/metrika/tag.js?id=113267829");
  // Browser globals expose window properties on the global object.
  Object.defineProperty(context, "ym", { get: () => window.ym });
  runInNewContext(script.props.children, context);
  const calls = () => Array.from(window.ym.a, (args) => Array.from(args));
  assert.equal(calls()[0][0], 113267829);
  assert.equal(calls()[0][1], "init");
  assert.equal(calls()[0][2].defer, true);
  assert.equal(calls().filter((call) => call[1] === "hit").length, 1);

  let effect;
  const { MetrikaNavigation } = await loadComponent("MetrikaNavigation.tsx", context, {
    react: { useEffect: (callback) => { effect = callback; } },
    "next/navigation": { usePathname: () => new URL(location.href).pathname, useSearchParams: () => new URL(location.href).searchParams },
  });
  MetrikaNavigation({ counterId: 113267829 });
  let cleanup = effect();
  assert.equal(calls().filter((call) => call[1] === "hit").length, 1);
  cleanup();
  cleanup = effect();
  assert.equal(calls().filter((call) => call[1] === "hit").length, 1);
  cleanup();
  location.href = "https://tverplazh.ru/bathhouse";
  document.title = "Баня «Карьер»";
  MetrikaNavigation({ counterId: 113267829 });
  cleanup = effect();
  const hit = calls().filter((call) => call[1] === "hit").at(-1);
  assert.equal(hit[2], location.href);
  assert.equal(hit[3].referer, "https://tverplazh.ru/?utm_source=test");
  assert.equal(hit[3].title, document.title);
  assert.equal(calls().filter((call) => call[1] === "hit").length, 2);
  listeners.get("click")({ target: new Element() });
  assert.deepEqual(calls().at(-1), [113267829, "reachGoal", "booking_click"]);
  cleanup();
});
