"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CardCarouselProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  getKey: (item: T) => string;
}

// Paginated, not drag/swipe-based -- clicking Next replaces the
// current batch of cards entirely rather than scrolling through a
// long horizontal strip. Card height stays constant across pages
// (all cards in a section are already uniform height), so paging
// never changes the section's height, and the page itself never
// grows taller because of this component.
export default function CardCarousel<T>({
  items,
  renderItem,
  getKey,
}: CardCarouselProps<T>) {
  const [perPage, setPerPage] = useState(1);
  const [page, setPage] = useState(0);

  useEffect(() => {
    function updatePerPage() {
      if (window.innerWidth >= 1024) {
        setPerPage(3);
      } else if (window.innerWidth >= 640) {
        setPerPage(2);
      } else {
        setPerPage(1);
      }
    }

    updatePerPage();
    window.addEventListener("resize", updatePerPage);
    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  const totalPages = Math.max(Math.ceil(items.length / perPage), 1);

  // Keep the current page in range if perPage changes (window
  // resize) or the item count shrinks (e.g. after joining a
  // community, it moves out of the Discover list).
  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(totalPages - 1, 0));
    }
  }, [totalPages, page]);

  const visibleItems = items.slice(page * perPage, page * perPage + perPage);

  return (
    <div>
      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: `repeat(${perPage}, minmax(0, 1fr))` }}
      >
        {visibleItems.map((item) => (
          <div key={getKey(item)}>{renderItem(item)}</div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === page ? "w-5 bg-violet-600" : "w-1.5 bg-slate-200"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            disabled={page === totalPages - 1}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
