"use client";

import { Star, Trash2 } from "lucide-react";

import { getMoodAccentBorderClass, getMoodBadgeClass, getMoodOption } from "@/components/mood/moodScale";
import type { JournalEntry } from "@/hooks/useJournalEntries";

interface JournalEntryCardProps {
  entry: JournalEntry;
  active?: boolean;
  onOpen: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDayLabel(dateString: string) {
  const date = new Date(dateString);
  return {
    month: date.toLocaleDateString([], { month: "short" }).toUpperCase(),
    day: date.getDate(),
  };
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function JournalEntryCard({
  entry,
  active = false,
  onOpen,
  onDelete,
  onToggleFavorite,
}: JournalEntryCardProps) {
  const snippet = stripHtml(entry.content);
  const moodOption = entry.moodLevel ? getMoodOption(entry.moodLevel) : undefined;
  const { month, day } = formatDayLabel(entry.createdAt);

  return (
    <div
      className={`group relative flex gap-3 rounded-2xl border-y border-r border-l-4 bg-white p-4 shadow-sm transition hover:shadow-md ${getMoodAccentBorderClass(
        entry.moodLevel ?? undefined
      )} ${
        active
          ? "border-y-violet-300 border-r-violet-300 ring-1 ring-violet-300"
          : "border-y-transparent border-r-transparent"
      }`}
    >
      {/* Date badge */}
      <div className="flex w-11 shrink-0 flex-col items-center rounded-xl bg-slate-50 py-2 text-center">
        <span className="text-[10px] font-semibold tracking-wide text-slate-400">
          {month}
        </span>
        <span className="text-lg font-bold leading-none text-slate-800">
          {day}
        </span>
      </div>

      <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
        <h3 className="truncate pr-14 font-semibold text-slate-900">
          {entry.title}
        </h3>

        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
          {moodOption && (
            <>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${getMoodBadgeClass()}`}
              >
                <span>{moodOption.emoji}</span>
                {moodOption.label}
              </span>
              <span>&middot;</span>
            </>
          )}
          <span>{formatTime(entry.createdAt)}</span>
        </div>

        {snippet && (
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">{snippet}</p>
        )}

        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-slate-400">
            {entry.wordCount} {entry.wordCount === 1 ? "word" : "words"}
          </span>
          {entry.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </button>

      <div className="absolute right-3 top-3 flex items-center gap-1">
        <button
          type="button"
          onClick={onToggleFavorite}
          title={entry.isFavorited ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={entry.isFavorited}
          className={`rounded-lg p-1.5 transition ${
            entry.isFavorited
              ? "text-amber-400"
              : "text-slate-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
          } hover:bg-amber-50 hover:text-amber-400`}
        >
          <Star
            className="h-4 w-4"
            fill={entry.isFavorited ? "currentColor" : "none"}
          />
        </button>

        <button
          type="button"
          onClick={onDelete}
          title="Delete entry"
          className="rounded-lg p-1.5 text-slate-300 opacity-100 transition hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
