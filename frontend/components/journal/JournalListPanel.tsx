"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

import { MOOD_SCALE } from "@/components/mood/moodScale";
import JournalEntryCard from "./JournalEntryCard";
import JournalEmptyState from "./JournalEmptyState";
import type { JournalEntry } from "@/hooks/useJournalEntries";

interface JournalListPanelProps {
  entries: JournalEntry[];
  selectedEntryId: string | null;
  loading: boolean;
  search: string;
  tagFilter: string | null;
  onTagFilterChange: (tag: string | null) => void;
  onSelectEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

type SortMode = "newest" | "oldest";

const PAGE_SIZE = 12;

export default function JournalListPanel({
  entries,
  selectedEntryId,
  loading,
  search,
  tagFilter,
  onTagFilterChange,
  onSelectEntry,
  onDeleteEntry,
  onToggleFavorite,
}: JournalListPanelProps) {
  const [moodFilter, setMoodFilter] = useState<number | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [page, setPage] = useState(1);

  const allTags = useMemo(() => {
    const tags = new Set<string>();

    entries.forEach((entry) => {
      entry.tags.forEach((tag) => tags.add(tag));
    });

    return Array.from(tags).sort();
  }, [entries]);

  const hasActiveFilters =
    !!search.trim() ||
    moodFilter !== null ||
    !!tagFilter ||
    !!dateFrom ||
    !!dateTo;

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = entries.filter((entry) => {
      const searchableContent = entry.content
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

      const matchesSearch =
        !query ||
        entry.title.toLowerCase().includes(query) ||
        searchableContent.includes(query);

      const matchesMood =
        moodFilter === null || entry.moodLevel === moodFilter;

      const matchesTag = !tagFilter || entry.tags.includes(tagFilter);

      const entryDate = entry.createdAt.slice(0, 10);
      const matchesFrom = !dateFrom || entryDate >= dateFrom;
      const matchesTo = !dateTo || entryDate <= dateTo;

      return (
        matchesSearch &&
        matchesMood &&
        matchesTag &&
        matchesFrom &&
        matchesTo
      );
    });

    return result.sort((a, b) => {
      const diff =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

      return sortMode === "newest" ? -diff : diff;
    });
  }, [
    entries,
    search,
    moodFilter,
    tagFilter,
    dateFrom,
    dateTo,
    sortMode,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEntries.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const pageEntries = filteredEntries.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function updateFilter(fn: () => void) {
    fn();
    setPage(1);
  }

  function clearFilters() {
    setMoodFilter(null);
    onTagFilterChange(null);
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  return (
    <section className="w-full">
      <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            className={`flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition ${
              hasActiveFilters
                ? "border-violet-300 bg-violet-50 text-violet-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            Filter

            {hasActiveFilters && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] text-white">
                •
              </span>
            )}
          </button>

          {filtersOpen && (
            <>
              <button
                type="button"
                aria-label="Close filter menu"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setFiltersOpen(false)}
              />

              <div className="absolute left-0 top-full z-20 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-100 bg-white p-4 shadow-xl">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Mood
                </p>

                <div className="mb-4 flex items-center gap-1.5">
                  {MOOD_SCALE.map((option) => (
                    <button
                      key={option.level}
                      type="button"
                      title={option.label}
                      onClick={() =>
                        updateFilter(() =>
                          setMoodFilter(
                            moodFilter === option.level
                              ? null
                              : option.level
                          )
                        )
                      }
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition ${
                        moodFilter === option.level
                          ? "bg-violet-100 ring-2 ring-violet-400"
                          : "bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      {option.emoji}
                    </button>
                  ))}
                </div>

                {allTags.length > 0 && (
                  <>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Tag
                    </p>

                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() =>
                            updateFilter(() =>
                              onTagFilterChange(
                                tagFilter === tag ? null : tag
                              )
                            )
                          }
                          className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                            tagFilter === tag
                              ? "bg-violet-600 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Date range
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(event) =>
                      updateFilter(() => setDateFrom(event.target.value))
                    }
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-violet-400"
                  />

                  <span className="text-xs text-slate-400">to</span>

                  <input
                    type="date"
                    value={dateTo}
                    onChange={(event) =>
                      updateFilter(() => setDateTo(event.target.value))
                    }
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-violet-400"
                  />
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 w-full rounded-lg py-1.5 text-xs font-medium text-violet-600 transition hover:bg-violet-50"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setSortMenuOpen((open) => !open)}
            className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            {sortMode === "newest" ? "Newest" : "Oldest"}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          {sortMenuOpen && (
            <>
              <button
                type="button"
                aria-label="Close sort menu"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setSortMenuOpen(false)}
              />

              <div className="absolute left-0 top-full z-20 mt-2 w-32 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg">
                {(["newest", "oldest"] as SortMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setSortMode(mode);
                      setSortMenuOpen(false);
                      setPage(1);
                    }}
                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                      sortMode === mode
                        ? "font-medium text-violet-700"
                        : "text-slate-600"
                    }`}
                  >
                    {mode === "newest" ? "Newest" : "Oldest"}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {filteredEntries.length > 0 && (
          <span className="ml-auto hidden text-xs text-slate-400 sm:block">
            {filteredEntries.length}{" "}
            {filteredEntries.length === 1 ? "reflection" : "reflections"}
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-100"
            />
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        entries.length === 0 ? (
          <div className="rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-slate-100">
            <JournalEmptyState variant="no-entries" />
          </div>
        ) : (
          <div className="rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-slate-100">
            <JournalEmptyState
              variant="no-results"
              onClearFilters={clearFilters}
            />
          </div>
        )
      ) : (
        <>
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pageEntries.map((entry) => (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                active={entry.id === selectedEntryId}
                onOpen={() => onSelectEntry(entry)}
                onDelete={() => onDeleteEntry(entry.id)}
                onToggleFavorite={() => onToggleFavorite(entry.id)}
              />
            ))}
          </div>

          {filteredEntries.length > PAGE_SIZE && (
            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-500">
              <span>
                {(currentPage - 1) * PAGE_SIZE + 1}
                {" - "}
                {Math.min(
                  currentPage * PAGE_SIZE,
                  filteredEntries.length
                )}{" "}
                of {filteredEntries.length} reflections
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setPage((value) => Math.max(1, value - 1))
                  }
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="min-w-16 text-center font-medium text-slate-600">
                  {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setPage((value) =>
                      Math.min(totalPages, value + 1)
                    )
                  }
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
