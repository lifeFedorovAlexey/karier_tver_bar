import Script from "next/script";

export function Metrika() {
  const id = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  if (!id || !/^\d+$/.test(id)) return null;
  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
      >{`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(${id},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});document.addEventListener('click',function(event){if(!(event.target instanceof Element)){return}var target=event.target.closest('[data-metrika-goal]');if(!target){return}var goal=target.getAttribute('data-metrika-goal');if(goal){ym(${id},'reachGoal',goal)}});`}</Script>
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
