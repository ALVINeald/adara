"use client";

import type { MoodEntry } from "@/hooks/useMoodEntries";
import { getMoodRingColorClass } from "./moodScale";
import MoodFaceIcon from "./MoodFaceIcon";

interface MoodStoryRingProps {
  entries: MoodEntry[];
  daysToShow?: number;
}

function dateKeyDaysAgo(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function weekdayLabel(daysAgo: number): string {
  if (daysAgo === 0) return "Today";
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString([], { weekday: "short" });
}

export default function MoodStoryRing({
  entries,
  daysToShow = 5,
}: MoodStoryRingProps) {
  const entryByDate = new Map(
    entries.map((entry) => [entry.entryDate, entry])
  );

  // Oldest first, today last.
  const days = Array.from(
    { length: daysToShow },
    (_, i) => daysToShow - 1 - i
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-1">
      {days.map((daysAgo) => {
        const dateKey = dateKeyDaysAgo(daysAgo);
        const entry = entryByDate.get(dateKey);
        const isToday = daysAgo === 0;

        return (
          <div
            key={dateKey}
            className="flex flex-col items-center gap-1.5"
          >
            {isToday && !entry ? (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-400 p-[2.5px] shadow-[0_0_0_4px_rgba(124,58,237,0.12)]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-2xl font-medium text-violet-600">
                  +
                </div>
              </div>
            ) : (
              <div
                className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-[2.5px] bg-white ${getMoodRingColorClass(
                  entry?.moodLevel
                )} ${isToday ? "shadow-[0_0_0_4px_rgba(124,58,237,0.12)]" : ""}`}
              >
                {entry ? (
                  <MoodFaceIcon level={entry.moodLevel} className="h-9 w-9" />
                ) : null}
              </div>
            )}
            {isToday ? (
              <span className="rounded-full bg-violet-600 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                Today
              </span>
            ) : (
              <span className="text-[10px] font-medium text-slate-400">
                {weekdayLabel(daysAgo)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
