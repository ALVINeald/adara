"use client";

import { Star, Trash2 } from "lucide-react";

import {
  getMoodAccentBorderClass,
  getMoodBadgeClass,
  getMoodOption,
} from "@/components/mood/moodScale";
import type { JournalEntry } from "@/hooks/useJournalEntries";

interface JournalEntryCardProps {
  entry: JournalEntry;
  active?: boolean;
  onOpen: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDayLabel(dateString: string) {
  const date = new Date(dateString);

  return {
    month: date
      .toLocaleDateString([], { month: "short" })
      .toUpperCase(),
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
  const moodOption = entry.moodLevel
    ? getMoodOption(entry.moodLevel)
    : undefined;

  const { month, day } = formatDayLabel(entry.createdAt);

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-white transition duration-200 ${
        active
          ? "border-violet-300 ring-2 ring-violet-100"
          : "border-slate-100 hover:-translate-y-0.5 hover:border-violet-100 hover:shadow-lg hover:shadow-slate-200/50"
      }`}
    >
      <div
        className={`absolute inset-y-0 left-0 w-1 ${getMoodAccentBorderClass(
          entry.moodLevel ?? undefined
        )}`}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={onOpen}
        className="block w-full p-5 text-left"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-50 text-center">
              <span className="text-[9px] font-bold tracking-widest text-slate-400">
                {month}
              </span>
              <span className="text-lg font-bold leading-none text-slate-800">
                {day}
              </span>
            </div>

            {moodOption && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${getMoodBadgeClass()}`}
              >
                <span>{moodOption.emoji}</span>
                {moodOption.label}
              </span>
            )}
          </div>

          <span className="shrink-0 text-xs text-slate-400">
            {formatTime(entry.createdAt)}
          </span>
        </div>

        <h3 className="pr-5 text-[15px] font-semibold leading-5 text-slate-900">
          {entry.title || "Untitled reflection"}
        </h3>

        {snippet ? (
          <p className="mt-2 line-clamp-5 text-sm leading-6 text-slate-600">
            {snippet}
          </p>
        ) : (
          <p className="mt-2 text-sm italic text-slate-400">
            No words yet
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">
            {entry.wordCount}{" "}
            {entry.wordCount === 1 ? "word" : "words"}
          </span>

          {entry.tags.slice(0, 3).map((tag) => (
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
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite();
          }}
          title={
            entry.isFavorited
              ? "Remove from favorites"
              : "Add to favorites"
          }
          aria-pressed={entry.isFavorited}
          className={`rounded-lg p-1.5 transition ${
            entry.isFavorited
              ? "text-amber-400"
              : "text-slate-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
          } hover:bg-amber-50 hover:text-amber-400`}
        >
          <Star
            className="h-4 w-4"
            fill={entry.isFavorited ? "currentColor" : "none"}
          />
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          title="Delete entry"
          className="rounded-lg p-1.5 text-slate-300 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
