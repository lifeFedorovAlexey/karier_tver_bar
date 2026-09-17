"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

type MenuPage = {
  src: string;
  alt: string;
};

type Turn = {
  from: number;
  to: number;
  direction: "next" | "previous";
};

function MenuPageImage({ page, className = "" }: { page: MenuPage; className?: string }) {
  return (
    <figure className={`menuBookPage ${className}`}>
      <Image src={page.src} alt={page.alt} fill loading="eager" sizes="(max-width: 600px) 100vw, 50vw" />
    </figure>
  );
}

function MenuSpread({ pages, index, mobile, className = "" }: { pages: MenuPage[]; index: number; mobile: boolean; className?: string }) {
  const spreadPages = pages.slice(index, index + (mobile ? 1 : 2));

  return (
    <div className={`menuBookSpread ${className}`}>
      {spreadPages.map((page) => <MenuPageImage key={page.src} page={page} />)}
      {!mobile && spreadPages.length === 1 && <div className="menuBookPage menuBookBlank" aria-hidden="true" />}
    </div>
  );
}

export function MenuBook({ pages }: { pages: MenuPage[] }) {
  const [mobile, setMobile] = useState(false);
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState<Turn | null>(null);
  const pointerStart = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 600px)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const step = mobile ? 1 : 2;
  const lastIndex = Math.max(0, pages.length - (mobile ? 1 : 2));
  const canGoPrevious = index > 0;
  const canGoNext = index < lastIndex;

  function goTo(nextIndex: number, direction: Turn["direction"]) {
    if (turn || nextIndex < 0 || nextIndex > lastIndex) return;
    setTurn({ from: index, to: nextIndex, direction });
    window.setTimeout(() => {
      setIndex(nextIndex);
      setTurn(null);
    }, 520);
  }

  function goNext() {
    goTo(Math.min(index + step, lastIndex), "next");
  }

  function goPrevious() {
    goTo(Math.max(index - step, 0), "previous");
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLElement>) {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(distance) < 45) return;
    if (distance < 0) goNext();
    else goPrevious();
  }

  const currentPageNumber = index + 1;
  const lastPageNumber = Math.min(index + (mobile ? 1 : 2), pages.length);
  const turningPage = turn
    ? pages[mobile ? turn.from : turn.direction === "next" ? turn.from + 1 : turn.from]
    : null;
  const turningBackPage = turn
    ? (() => {
        const backIndex = mobile ? turn.to : turn.to + 1;
        return backIndex < pages.length ? pages[backIndex] : null;
      })()
    : null;

  return (
    <div className="menuBook">
      <div
        className={`menuBookStage ${mobile ? "is-mobile" : ""}`}
        tabIndex={0}
        role="region"
        aria-label="Листаемое меню"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") goNext();
          if (event.key === "ArrowLeft") goPrevious();
        }}
        onPointerDown={(event) => { pointerStart.current = event.clientX; }}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { pointerStart.current = null; }}
      >
        {turn ? (
          <>
            <MenuSpread pages={pages} index={turn.to} mobile={mobile} className="menuBookSpreadBehind" />
            {!mobile && (
              <div className={`menuBookStationary menuBookStationary-${turn.direction}`}>
                <MenuPageImage
                  page={pages[turn.direction === "next" ? turn.from : turn.from + 1]}
                />
                <MenuPageImage
                  page={pages[turn.direction === "next" ? turn.to : turn.to + 1]}
                  className="menuBookStationaryNext"
                />
              </div>
            )}
            {turningPage && (
              <div className={`menuBookTurn menuBookTurn-${turn.direction}`}>
                <MenuPageImage page={turningPage} className="menuBookTurnFront" />
                {turningBackPage && <MenuPageImage page={turningBackPage} className="menuBookTurnBack" />}
              </div>
            )}
          </>
        ) : (
          <MenuSpread pages={pages} index={index} mobile={mobile} />
        )}

        <button
          type="button"
          className="menuBookEdge menuBookEdge-previous"
          onClick={goPrevious}
          disabled={!canGoPrevious || Boolean(turn)}
          aria-label="Предыдущая страница"
        />
        <button
          type="button"
          className="menuBookEdge menuBookEdge-next"
          onClick={goNext}
          disabled={!canGoNext || Boolean(turn)}
          aria-label="Следующая страница"
        />
      </div>

      <div className="menuBookControls">
        <button type="button" onClick={goPrevious} disabled={!canGoPrevious || Boolean(turn)} aria-label="Предыдущая страница">
          Назад
        </button>
        <output aria-live="polite">{currentPageNumber}{!mobile && lastPageNumber !== currentPageNumber ? `–${lastPageNumber}` : ""} / {pages.length}</output>
        <button type="button" onClick={goNext} disabled={!canGoNext || Boolean(turn)} aria-label="Следующая страница">
          Далее
        </button>
      </div>
    </div>
  );
}
