"use client";

import { BookHeart, SearchX } from "lucide-react";

interface JournalEmptyStateProps {
  variant: "no-entries" | "no-results";
  onNewEntry?: () => void;
  onClearFilters?: () => void;
}

export default function JournalEmptyState({
  variant,
  onNewEntry,
  onClearFilters,
}: JournalEmptyStateProps) {
  if (variant === "no-results") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
          <SearchX className="h-5 w-5 text-slate-400" />
        </div>
        <div>
          <p className="font-medium text-slate-700">No entries match that search</p>
          <p className="mt-1 text-sm text-slate-500">
            Try a different keyword, or clear your filters.
          </p>
        </div>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-violet-600 hover:bg-violet-50"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50">
        <BookHeart className="h-5 w-5 text-violet-500" />
      </div>
      <div>
        <p className="font-medium text-slate-700">Your journal is empty</p>
        <p className="mt-1 text-sm text-slate-500">
          Write your first entry -- even a few lines count.
        </p>
      </div>
      {onNewEntry && (
        <button
          type="button"
          onClick={onNewEntry}
          className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          Write your first entry
        </button>
      )}
    </div>
  );
}
