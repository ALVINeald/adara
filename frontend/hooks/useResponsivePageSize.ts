"use client";

import { useEffect, useState } from "react";

// Columns per page -- always a single row now. An earlier version
// multiplied this by 2 rows per page (up to 6 cards/page), which
// squeezed each card into half the available height. Real card
// content (avatar, name, badge, meta line, chips, 2-line bio, two
// buttons, all padded) doesn't reliably fit a squeezed half-row, so
// cards overflowed into the row below -- visible as cards overlapping.
// A single row gets the full available height every time, which is
// generous enough that this can't happen regardless of content length.
const BREAKPOINTS = {
  sm: "(min-width: 640px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
};

function computeColumns(): number {
  if (typeof window === "undefined") return 1;

  const isXl = window.matchMedia(BREAKPOINTS.xl).matches;
  const isLg = window.matchMedia(BREAKPOINTS.lg).matches;
  const isSm = window.matchMedia(BREAKPOINTS.sm).matches;

  if (isXl) return 4;
  if (isLg) return 3;
  if (isSm) return 2;
  return 1;
}

export function useResponsivePageSize(): number {
  const [columns, setColumns] = useState(computeColumns);

  useEffect(() => {
    function handleResize() {
      setColumns(computeColumns());
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

  return columns;
}
