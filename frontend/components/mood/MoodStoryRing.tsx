"use client";

import type { MoodEntry } from "@/hooks/useMoodEntries";
import { getMoodOption } from "./moodScale";

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
    <div className="flex gap-3 overflow-x-auto pb-1">
      {days.map((daysAgo) => {
        const dateKey = dateKeyDaysAgo(daysAgo);
        const entry = entryByDate.get(dateKey);
        const isToday = daysAgo === 0;
        const moodOption = entry
          ? getMoodOption(entry.moodLevel)
          : undefined;

        return (
          <div
            key={dateKey}
            className="flex flex-col items-center gap-1"
          >
            {isToday && !entry ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-600 to-cyan-400 p-[2px]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-lg font-medium text-cyan-600">
                  +
                </div>
              </div>
            ) : (
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full text-lg ${
                  entry ? "bg-cyan-100" : "bg-slate-100"
                }`}
              >
                {moodOption ? moodOption.emoji : ""}
              </div>
            )}
            <span
              className={`text-[10px] font-medium ${
                isToday ? "text-cyan-700" : "text-slate-400"
              }`}
            >
              {weekdayLabel(daysAgo)}
            </span>
          </div>
        );
      })}
    </div>
  );
}