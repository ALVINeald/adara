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

  return date.toLocaleDateString([], {
    weekday: "short",
  });
}

export default function MoodStoryRing({
  entries,
  daysToShow = 5,
}: MoodStoryRingProps) {
  const entryByDate = new Map(
    entries.map((entry) => [entry.entryDate, entry])
  );

  const days = Array.from(
    { length: daysToShow },
    (_, index) => daysToShow - 1 - index
  );

  return (
    <div className="w-full min-w-0 overflow-x-auto overflow-y-hidden pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="mx-auto flex w-max min-w-full items-start justify-between gap-2 px-1 sm:gap-4">
        {days.map((daysAgo) => {
          const dateKey = dateKeyDaysAgo(daysAgo);
          const entry = entryByDate.get(dateKey);
          const isToday = daysAgo === 0;

          return (
            <div
              key={dateKey}
              className="flex min-w-[54px] shrink-0 flex-col items-center gap-1.5"
            >
              {/* MOOD RING */}
              {isToday && !entry ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-400 p-[2.5px] shadow-[0_0_0_4px_rgba(124,58,237,0.10)] sm:h-14 sm:w-14">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-xl font-medium text-violet-600 sm:text-2xl">
                    +
                  </div>
                </div>
              ) : (
                <div
                  className={[
                    "flex h-12 w-12 items-center justify-center",
                    "overflow-hidden rounded-full border-[2.5px] bg-white",
                    "sm:h-14 sm:w-14",
                    getMoodRingColorClass(entry?.moodLevel),
                    isToday
                      ? "shadow-[0_0_0_4px_rgba(124,58,237,0.10)]"
                      : "",
                  ].join(" ")}
                >
                  {entry ? (
                    <MoodFaceIcon
                      level={entry.moodLevel}
                      className="h-8 w-8 sm:h-9 sm:w-9"
                    />
                  ) : null}
                </div>
              )}

              {/* LABEL */}
              {isToday ? (
                <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[9px] font-semibold text-white sm:px-2.5 sm:text-[10px]">
                  Today
                </span>
              ) : (
                <span className="text-[9px] font-medium text-slate-400 sm:text-[10px]">
                  {weekdayLabel(daysAgo)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}