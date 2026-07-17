"use client";

import { useMemo, useState } from "react";

import { getMoodColorClass, getMoodOption } from "./moodScale";
import type { MoodEntry } from "@/hooks/useMoodEntries";

interface MoodHeatmapProps {
  entries: MoodEntry[];
  weeksToShow?: number;
}

interface DayCell {
  date: string; // YYYY-MM-DD
  entry?: MoodEntry;
}

function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildGrid(entries: MoodEntry[], weeksToShow: number): DayCell[][] {
  const entryByDate = new Map(
    entries.map((entry) => [entry.entryDate, entry])
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Align the grid so the last column ends on the most recent Saturday
  // and starts on a Sunday — standard GitHub-style layout.
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

  const totalDays = weeksToShow * 7;
  const startDate = new Date(endOfWeek);
  startDate.setDate(endOfWeek.getDate() - totalDays + 1);

  const weeks: DayCell[][] = [];
  let currentWeek: DayCell[] = [];

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateKey = formatDateKey(date);

    currentWeek.push({
      date: dateKey,
      entry: entryByDate.get(dateKey),
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  return weeks;
}

export default function MoodHeatmap({
  entries,
  weeksToShow = 26,
}: MoodHeatmapProps) {
  const weeks = useMemo(
    () => buildGrid(entries, weeksToShow),
    [entries, weeksToShow]
  );

  const [hovered, setHovered] = useState<DayCell | null>(null);

  const today = formatDateKey(new Date());

  return (
    <div className="relative">
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day) => {
              const isFuture = day.date > today;

              return (
                <div
                  key={day.date}
                  onMouseEnter={() => !isFuture && setHovered(day)}
                  onMouseLeave={() => setHovered(null)}
                  className={`h-4 w-4 rounded-sm transition ${
                    isFuture
                      ? "bg-transparent"
                      : getMoodColorClass(day.entry?.moodLevel)
                  } ${
                    !isFuture
                      ? "cursor-pointer hover:ring-2 hover:ring-cyan-300"
                      : ""
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>

      {hovered && (
        <div className="pointer-events-none absolute bottom-full left-0 mb-2 rounded-xl bg-slate-900 px-4 py-2 text-xs text-white shadow-lg">
          <p className="font-semibold">
            {new Date(hovered.date + "T00:00:00").toLocaleDateString([], {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
          {hovered.entry ? (
            <>
              <p>
                {getMoodOption(hovered.entry.moodLevel)?.emoji}{" "}
                {getMoodOption(hovered.entry.moodLevel)?.label}
              </p>
              {hovered.entry.note && (
                <p className="mt-1 max-w-[200px] text-slate-300">
                  {hovered.entry.note}
                </p>
              )}
            </>
          ) : (
            <p className="text-slate-400">No entry</p>
          )}
        </div>
      )}
    </div>
  );
}