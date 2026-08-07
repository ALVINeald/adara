"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CardCarouselProps {
  children: ReactNode;
}

// Touch swipe works natively on any horizontally-scrollable container
// with no extra code -- the arrows here are purely an added
// convenience for mouse/trackpad users on tablet and desktop, hidden
// on mobile since there's nothing for them to add there.
export default function CardCarousel({ children }: CardCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateArrowState() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    updateArrowState();
  }, [children]);

  function scrollByCard(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;

    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    const cardWidth = card ? card.offsetWidth + 20 : 300;

    el.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">

      {canScrollLeft && (
        <button
          onClick={() => scrollByCard("left")}
          className="absolute -left-4 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition hover:text-violet-600 md:flex"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={updateArrowState}
        className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-1"
      >
        {children}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scrollByCard("right")}
          className="absolute -right-4 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition hover:text-violet-600 md:flex"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

    </div>
  );
}
