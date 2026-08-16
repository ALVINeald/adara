"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import TherapistCard from "./TherapistCard";
import TherapistCardSkeleton from "./TherapistCardSkeleton";
import TherapistMobileCarousel from "./TherapistMobileCarousel";
import { useResponsivePageSize } from "@/hooks/useResponsivePageSize";
import type { Therapist } from "@/hooks/useTherapists";

interface TherapistPagerProps {
  therapists: Therapist[];
  loading: boolean;
  requestedTherapistIds: Set<string>;
  isSaved: (id: string) => boolean;
  onToggleSaved: (id: string) => void;
  onViewProfile: (therapist: Therapist) => void;
  onRequestAppointment: (therapist: Therapist) => void;
}

const SWIPE_OFFSET_THRESHOLD = 60;
const SWIPE_VELOCITY_THRESHOLD = 400;

// A real card's minimum content height: avatar/name/badge row (~64px)
// + specialty chips row with its mt-3 (~44px) + 2-line bio with its
// mt-3 (~72px) + button row with its pt-4 (~76px) + p-5 padding on
// top and bottom (40px) + a safety margin for slightly longer content
// wrapping. This is what actually failed last round -- a hardcoded
// "always 2 rows" grid assumed cards would always fit half the
// available height, which wasn't true. Measuring against this number
// instead of assuming a fixed row count is what makes 2 rows safe to
// use again.
const MIN_CARD_HEIGHT = 300;
const GRID_GAP = 16; // gap-4

const COLS_CLASS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

const ROWS_CLASS: Record<number, string> = {
  1: "grid-rows-1",
  2: "grid-rows-2",
};

export default function TherapistPager({
  therapists,
  loading,
  requestedTherapistIds,
  isSaved,
  onToggleSaved,
  onViewProfile,
  onRequestAppointment,
}: TherapistPagerProps) {
  const prefersReducedMotion = useReducedMotion();
  const columns = useResponsivePageSize();
  const containerRef = useRef<HTMLDivElement>(null);

  const [pageIndex, setPageIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
      setContainerHeight(entries[0].contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 2 rows only when there's measured room for 2 real cards -- not a
  // fixed breakpoint guess. Never on the single-column mobile layout
  // regardless of height, since one column stacked two-high reads as
  // a plain scrolling list, not a grid worth splitting into pages.
  const canFitTwoRows = containerHeight >= MIN_CARD_HEIGHT * 2 + GRID_GAP;
  const rows = columns > 1 && canFitTwoRows ? 2 : 1;
  const pageSize = columns * rows;

  const totalPages = Math.max(1, Math.ceil(therapists.length / pageSize));

  useEffect(() => {
    setPageIndex((current) => Math.min(current, totalPages - 1));
  }, [totalPages]);

  function goTo(index: number) {
    setPageIndex(Math.max(0, Math.min(totalPages - 1, index)));
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (
      info.offset.x < -SWIPE_OFFSET_THRESHOLD ||
      info.velocity.x < -SWIPE_VELOCITY_THRESHOLD
    ) {
      goTo(pageIndex + 1);
    } else if (
      info.offset.x > SWIPE_OFFSET_THRESHOLD ||
      info.velocity.x > SWIPE_VELOCITY_THRESHOLD
    ) {
      goTo(pageIndex - 1);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") goTo(pageIndex + 1);
    if (e.key === "ArrowLeft") goTo(pageIndex - 1);
  }

  const pages = Array.from({ length: totalPages }, (_, i) =>
    therapists.slice(i * pageSize, i * pageSize + pageSize)
  );

  const gridColsClass = COLS_CLASS[columns] ?? "grid-cols-1";
  const gridRowsClass = ROWS_CLASS[rows] ?? "grid-rows-1";

  // Real drag bounds -- the actual full track width, not a degenerate
  // {0, 0}. {0, 0} doesn't just limit the drag gesture, it clamps the
  // x motion value to zero at ALL times, including when the animate
  // prop tries to move it -- which is why paging silently did nothing
  // last round regardless of arrows, dots, or swipe. dragMomentum is
  // off so Framer Motion's own release-inertia can't fight the
  // controlled snap-to-page animation afterward.
  const maxDragOffset = -(totalPages - 1) * containerWidth;

  // Mobile (single column) gets a genuinely different interaction
  // model per the brief -- native scroll-snap swipe through individual
  // cards with a next-card peek, not a paged grid. This branches here
  // (after every hook above has already run) rather than as an early
  // return before them, since conditionally skipping hooks between
  // renders breaks React's Rules of Hooks -- exactly what would happen
  // here given columns changes at runtime on resize.
  if (columns === 1) {
    return (
      <TherapistMobileCarousel
        therapists={therapists}
        loading={loading}
        requestedTherapistIds={requestedTherapistIds}
        isSaved={isSaved}
        onToggleSaved={onToggleSaved}
        onViewProfile={onViewProfile}
        onRequestAppointment={onRequestAppointment}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-0 flex-1 items-center">
        <div className={`grid w-full ${gridColsClass} ${gridRowsClass} gap-4`}>
          {Array.from({ length: pageSize }).map((_, i) => (
            <TherapistCardSkeleton key={i} />
          ))}
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
        ref={containerRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Therapist results"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative min-h-0 flex-1 overflow-hidden outline-none"
      >
        <motion.div
          drag={totalPages > 1 ? "x" : false}
          dragConstraints={{ left: maxDragOffset, right: 0 }}
          dragElastic={0.15}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          animate={{ x: -pageIndex * containerWidth }}
          transition={
            prefersReducedMotion
              ? { duration: 0.15 }
              : { type: "spring", damping: 32, stiffness: 300 }
          }
          className="flex h-full"
        >
          {pages.map((pageItems, i) => (
            <div
              key={i}
              className="flex h-full w-full shrink-0 items-center px-1"
              aria-hidden={i !== pageIndex}
            >
              <div className={`grid w-full ${gridColsClass} ${gridRowsClass} gap-4`}>
                {pageItems.map((therapist) => (
                  <TherapistCard
                    key={therapist.id}
                    therapist={therapist}
                    alreadyRequested={requestedTherapistIds.has(therapist.id)}
                    isSaved={isSaved(therapist.id)}
                    onToggleSaved={() => onToggleSaved(therapist.id)}
                    onViewProfile={() => onViewProfile(therapist)}
                    onRequestAppointment={() => onRequestAppointment(therapist)}
                  />
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {totalPages > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(pageIndex - 1)}
              disabled={pageIndex === 0}
              aria-label="Previous page"
              className="absolute left-1 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-md transition hover:bg-white disabled:pointer-events-none disabled:opacity-0 sm:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(pageIndex + 1)}
              disabled={pageIndex === totalPages - 1}
              aria-label="Next page"
              className="absolute right-1 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-md transition hover:bg-white disabled:pointer-events-none disabled:opacity-0 sm:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex shrink-0 items-center justify-center gap-3 pt-3">
          <span aria-live="polite" className="text-xs font-medium text-slate-400">
            Page {pageIndex + 1} of {totalPages}
          </span>
          {totalPages <= 8 && (
            <div className="flex items-center gap-1.5">
              {pages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to page ${i + 1}`}
                  aria-current={i === pageIndex}
                  className={`h-1.5 rounded-full transition-all ${
                    i === pageIndex ? "w-5 bg-[#8B5CF6]" : "w-1.5 bg-slate-200"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
