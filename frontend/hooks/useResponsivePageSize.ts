"use client";

import { useEffect, useState } from "react";

// Matches Tailwind's default sm/lg/xl breakpoints, since the card
// grid columns below are keyed to the same values -- keeping page
// size in lockstep with however many columns are actually visible.
const BREAKPOINTS = {
  sm: "(min-width: 640px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
};

function computePageSize(): number {
  if (typeof window === "undefined") return 1;

  const isXl = window.matchMedia(BREAKPOINTS.xl).matches;
  const isLg = window.matchMedia(BREAKPOINTS.lg).matches;
  const isSm = window.matchMedia(BREAKPOINTS.sm).matches;

  if (isXl) return 6; // 3 columns x 2 rows
  if (isLg) return 4; // 2 columns x 2 rows
  if (isSm) return 2; // 2 columns x 1 row
  return 1; // single column, one card at a time -- guarantees no
  // overflow on the shortest phone viewports regardless of bio length
}

export function useResponsivePageSize(): number {
  const [pageSize, setPageSize] = useState(computePageSize);

  useEffect(() => {
    function handleResize() {
      setPageSize(computePageSize());
    }

    const queries = Object.values(BREAKPOINTS).map((query) =>
      window.matchMedia(query)
    );
    queries.forEach((mq) => mq.addEventListener("change", handleResize));
    handleResize();

    return () => {
      queries.forEach((mq) => mq.removeEventListener("change", handleResize));
    };
  }, []);

  return pageSize;
}
