"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import TherapistCard from "./TherapistCard";
import TherapistCardSkeleton from "./TherapistCardSkeleton";
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

const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  4: "grid-cols-2",
  6: "grid-cols-3",
};

const GRID_ROWS: Record<number, string> = {
  1: "grid-rows-1",
  2: "grid-rows-1",
  4: "grid-rows-2",
  6: "grid-rows-2",
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
  const pageSize = useResponsivePageSize();
  const containerRef = useRef<HTMLDivElement>(null);

  const [pageIndex, setPageIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const totalPages = Math.max(1, Math.ceil(therapists.length / pageSize));

  useEffect(() => {
    // Filters/search changing the result set shouldn't leave the pager
    // stranded on a now-nonexistent page.
    setPageIndex((current) => Math.min(current, totalPages - 1));
  }, [totalPages]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  const gridColsClass = GRID_COLS[pageSize] ?? "grid-cols-1";
  const gridRowsClass = GRID_ROWS[pageSize] ?? "grid-rows-1";

  if (loading) {
    return (
      <div className={`grid ${gridColsClass} ${gridRowsClass} min-h-0 flex-1 gap-4`}>
        {Array.from({ length: pageSize }).map((_, i) => (
          <TherapistCardSkeleton key={i} />
        ))}
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
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
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
              className="h-full w-full shrink-0 px-1"
              aria-hidden={i !== pageIndex}
            >
              <div className={`grid ${gridColsClass} ${gridRowsClass} h-full gap-4`}>
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
