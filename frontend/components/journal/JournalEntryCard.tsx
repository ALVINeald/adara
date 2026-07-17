"use client";

import { Trash2 } from "lucide-react";

import { getMoodOption } from "@/components/mood/moodScale";
import type { JournalEntry } from "@/hooks/useJournalEntries";

interface JournalEntryCardProps {
  entry: JournalEntry;
  onOpen: () => void;
  onDelete: () => void;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function JournalEntryCard({
  entry,
  onOpen,
  onDelete,
}: JournalEntryCardProps) {
  const snippet = stripHtml(entry.content);
  const moodOption = entry.moodLevel
    ? getMoodOption(entry.moodLevel)
    : undefined;

  return (
    <div className="group flex items-start justify-between rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">
      <button type="button" onClick={onOpen} className="flex-1 text-left">
        <div className="flex items-center gap-2">
          {moodOption && <span className="text-lg">{moodOption.emoji}</span>}
          <h3 className="font-semibold text-slate-900">{entry.title}</h3>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          {formatDate(entry.createdAt)}
        </p>

        {snippet && (
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
            {snippet}
          </p>
        )}
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="ml-3 rounded-lg p-2 text-slate-300 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}