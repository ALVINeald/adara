"use client";

import { useMemo } from "react";
import { BarChart3, Flame, Sparkles, Star } from "lucide-react";

import JournalPrivacyCard from "./JournalPrivacyCard";
import type { JournalEntry } from "@/hooks/useJournalEntries";

interface JournalInsightsProps {
  entries: JournalEntry[];
  onOpenMemory: (entry: JournalEntry) => void;
}

function toDateKey(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}

function computeStreak(entries: JournalEntry[]): number {
  const days = new Set(entries.map((e) => toDateKey(e.createdAt)));
  let streak = 0;
  const cursor = new Date();

  if (!days.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function findTagTrend(entries: JournalEntry[]) {
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  const thisWeek = new Map<string, number>();
  const lastWeek = new Map<string, number>();

  entries.forEach((entry) => {
    const age = now - new Date(entry.createdAt).getTime();
    entry.tags.forEach((tag) => {
      if (age <= oneWeek) {
        thisWeek.set(tag, (thisWeek.get(tag) ?? 0) + 1);
      } else if (age <= oneWeek * 2) {
        lastWeek.set(tag, (lastWeek.get(tag) ?? 0) + 1);
      }
    });
  });

  const topThisWeek = Array.from(thisWeek.entries()).sort((a, b) => b[1] - a[1])[0];
  if (!topThisWeek) return null;

  const [tag, count] = topThisWeek;
  if (count < 2) return null; // not worth surfacing as a "pattern" off a single mention

  const priorCount = lastWeek.get(tag) ?? 0;
  return { tag, count, isMoreThanLastWeek: count > priorCount };
}

// Looks for an entry from roughly 6 months ago (a 10-day window around
// the exact date), falling back to 3 months, then 1 month. If nothing
// real exists in any of those windows, returns null -- no fabricated
// "memory" gets shown just to fill the slot.
function findMemory(entries: JournalEntry[]): { entry: JournalEntry; label: string } | null {
  const windows: { months: number; label: string }[] = [
    { months: 6, label: "6 months ago" },
    { months: 3, label: "3 months ago" },
    { months: 1, label: "1 month ago" },
  ];

  for (const { months, label } of windows) {
    const target = new Date();
    target.setMonth(target.getMonth() - months);

    const match = entries.find((entry) => {
      const diffDays = Math.abs(
        (new Date(entry.createdAt).getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays <= 5;
    });

    if (match) return { entry: match, label };
  }

  return null;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function JournalInsights({ entries, onOpenMemory }: JournalInsightsProps) {
  const streak = useMemo(() => computeStreak(entries), [entries]);
  const tagTrend = useMemo(() => findTagTrend(entries), [entries]);
  const memory = useMemo(() => findMemory(entries), [entries]);
  const savedCount = entries.filter((e) => e.isFavorited).length;

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto thin-scroll px-5 py-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
        Your Insights
      </h2>

      {tagTrend && (
        <div className="rounded-2xl bg-violet-50 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <BarChart3 className="h-4 w-4 text-violet-600" />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            You&apos;ve written about <span className="font-semibold">{tagTrend.tag}</span>{" "}
            {tagTrend.count} {tagTrend.count === 1 ? "time" : "times"} this week.
          </p>
          {tagTrend.isMoreThanLastWeek && (
            <p className="mt-1 text-xs text-violet-600">
              That&apos;s more than last week. Keep going.
            </p>
          )}
        </div>
      )}

      <div className="rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-400" />
          <p className="text-sm font-semibold text-slate-800">
            Current streak: {streak} {streak === 1 ? "day" : "days"}
          </p>
        </div>
        {streak > 0 && (
          <p className="mt-1 text-xs text-slate-500">Keep showing up for yourself.</p>
        )}
      </div>

      {memory && (
        <button
          type="button"
          onClick={() => onOpenMemory(memory.entry)}
          className="rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 p-4 text-left text-white transition hover:opacity-95"
        >
          <div className="flex items-center gap-1.5 text-xs font-medium text-violet-100">
            <Sparkles className="h-3.5 w-3.5" />
            Reflection from {memory.label}
          </div>
          <p className="mt-2 line-clamp-3 text-sm italic leading-relaxed">
            &ldquo;{stripHtml(memory.entry.content) || memory.entry.title}&rdquo;
          </p>
          <p className="mt-2 text-xs font-medium text-violet-100 underline">
            Read again
          </p>
        </button>
      )}

      <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-4">
        <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
        <p className="text-sm text-slate-700">
          {savedCount} saved {savedCount === 1 ? "reflection" : "reflections"}
        </p>
      </div>

      <JournalPrivacyCard />
    </div>
  );
}
