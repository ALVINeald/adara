"use client";

import { useMemo } from "react";
import type { JournalEntry } from "@/hooks/useJournalEntries";

interface JournalTagChipsProps {
  entries: JournalEntry[];
  activeTag: string | null;
  onSelect: (tag: string | null) => void;
}

const MAX_CHIPS = 6;

export default function JournalTagChips({
  entries,
  activeTag,
  onSelect,
}: JournalTagChipsProps) {
  const topTags = useMemo(() => {
    const counts = new Map<string, number>();
    entries.forEach((entry) => {
      entry.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_CHIPS)
      .map(([tag]) => tag);
  }, [entries]);

  return (
    <div className="mb-3 flex shrink-0 items-center gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => onSelect(null)}
        aria-pressed={activeTag === null}
        className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
          activeTag === null
            ? "bg-violet-600 text-white"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        All
      </button>
      {topTags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onSelect(activeTag === tag ? null : tag)}
          aria-pressed={activeTag === tag}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
            activeTag === tag
              ? "bg-violet-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
