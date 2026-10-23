import Script from "next/script";
import { Suspense } from "react";
import { MetrikaNavigation } from "@/components/MetrikaNavigation";

export function Metrika() {
  const id = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  if (!id || !/^\d+$/.test(id)) return null;
  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
      >{`window.ym=window.ym||function(){(window.ym.a=window.ym.a||[]).push(arguments)};window.ym.l=Date.now();ym(${id},'init',{ssr:true,defer:true,clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true,ecommerce:'dataLayer'});window.__karierMetrikaUrl=location.href;ym(${id},'hit',location.href,{referer:document.referrer,title:document.title});window.dispatchEvent(new Event('karier:metrika-ready'));document.addEventListener('click',function(event){if(!(event.target instanceof Element)){return}var target=event.target.closest('[data-metrika-goal]');if(!target){return}var goal=target.getAttribute('data-metrika-goal');if(goal){ym(${id},'reachGoal',goal)}});`}</Script>
      {/* Queue views and goals immediately; fetch the tracker after page load. */}
      <Script
        id="yandex-metrika-loader"
        src={`https://mc.yandex.ru/metrika/tag.js?id=${id}`}
        strategy="lazyOnload"
      />
      <Suspense fallback={null}>
        <MetrikaNavigation counterId={Number(id)} />
      </Suspense>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element -- официальный noscript-пиксель Метрики */}
          <img
            src={`https://mc.yandex.ru/watch/${id}`}
            className="metrikaPixel"
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
