"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import TherapistCard from "./TherapistCard";
import TherapistCardSkeleton from "./TherapistCardSkeleton";
import type { Therapist } from "@/hooks/useTherapists";

interface TherapistMobileCarouselProps {
  therapists: Therapist[];
  loading: boolean;
  requestedTherapistIds: Set<string>;
  isSaved: (id: string) => boolean;
  onToggleSaved: (id: string) => void;
  onViewProfile: (therapist: Therapist) => void;
  onRequestAppointment: (therapist: Therapist) => void;
}

// Card width as a fraction of the viewport -- leaves a real peek of
// the next card (per the brief: "the next card should partially peek
// into view to communicate that the user can swipe"), not just a
// stylistic gap.
const CARD_WIDTH_FRACTION = 0.86;
const GAP_PX = 16;

export default function TherapistMobileCarousel({
  therapists,
  loading,
  requestedTherapistIds,
  isSaved,
  onToggleSaved,
  onViewProfile,
  onRequestAppointment,
}: TherapistMobileCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cardWidth = containerWidth * CARD_WIDTH_FRACTION;
  const step = cardWidth + GAP_PX;

  function handleScroll() {
    const el = scrollRef.current;
    if (!el || step === 0) return;
    setActiveIndex(Math.round(el.scrollLeft / step));
  }

  function scrollToIndex(index: number) {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(therapists.length - 1, index));
    el.scrollTo({ left: clamped * step, behavior: "smooth" });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") scrollToIndex(activeIndex + 1);
    if (e.key === "ArrowLeft") scrollToIndex(activeIndex - 1);
  }

  if (loading) {
    return (
      <div className="flex min-h-0 flex-1 items-center gap-4 overflow-hidden">
        <div className="w-[86%] shrink-0">
          <TherapistCardSkeleton />
        </div>
      </div>
    );
  }

  if (therapists.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <p className="text-sm text-slate-400">
          No therapists match your filters right now.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Therapist results"
        // No accidental page-level horizontal scroll -- this
        // container is the only thing that scrolls on the x-axis;
        // everything around it stays within the viewport width.
        className="flex min-h-0 flex-1 items-center gap-4 overflow-x-auto overflow-y-hidden px-1"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {therapists.map((therapist, i) => (
          <div
            key={therapist.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${therapists.length}: ${therapist.name}`}
            style={{
              scrollSnapAlign: "start",
              width: containerWidth ? `${CARD_WIDTH_FRACTION * 100}%` : "86%",
            }}
            className="shrink-0"
          >
            <TherapistCard
              therapist={therapist}
              alreadyRequested={requestedTherapistIds.has(therapist.id)}
              isSaved={isSaved(therapist.id)}
              onToggleSaved={() => onToggleSaved(therapist.id)}
              onViewProfile={() => onViewProfile(therapist)}
              onRequestAppointment={() => onRequestAppointment(therapist)}
            />
          </div>
        ))}
      </div>

      {therapists.length > 1 && (
        <div className="flex shrink-0 items-center justify-center gap-3 pt-3">
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous therapist"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition disabled:opacity-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span aria-live="polite" className="text-xs font-medium text-slate-400">
            {activeIndex + 1} of {therapists.length}
          </span>

          {therapists.length <= 10 && (
            <div className="flex items-center gap-1.5">
              {therapists.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Go to therapist ${i + 1}`}
                  aria-current={i === activeIndex}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeIndex ? "w-5 bg-[#8B5CF6]" : "w-1.5 bg-slate-200"
                  }`}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex === therapists.length - 1}
            aria-label="Next therapist"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition disabled:opacity-0"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
