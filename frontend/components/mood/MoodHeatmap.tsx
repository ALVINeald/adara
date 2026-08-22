"use client";

import type { MoodEntry } from "@/hooks/useMoodEntries";
import { MOOD_SCALE, getMoodRingColorClass } from "./moodScale";
import MoodFaceIcon from "./MoodFaceIcon";

interface MoodHeatmapProps {
  entries: MoodEntry[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getDateKey(date: Date) {
  const copy = new Date(date);
  copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
  return copy.toISOString().slice(0, 10);
}

function getMoodEntryMap(entries: MoodEntry[]) {
  return new Map(
    entries.map((entry) => [entry.entryDate, entry])
  );
}

function getMoodLabel(level?: number) {
  if (!level) return "No check-in";

  return (
    MOOD_SCALE.find((mood) => mood.level === level)?.label ??
    "Mood check-in"
  );
}

export default function MoodHeatmap({
  entries,
}: MoodHeatmapProps) {
  const entryMap = getMoodEntryMap(entries);

  const today = new Date();

  /*
   * Build the most recent 12 weeks.
   * Sunday is used as the first day internally so the grid
   * remains predictable.
   */
  const start = new Date(today);
  const dayOfWeek = start.getDay();

  start.setDate(
    start.getDate() - dayOfWeek - 7 * 11
  );

  const weeks = Array.from({ length: 12 }, (_, weekIndex) => {
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date(start);

      date.setDate(
        start.getDate() +
          weekIndex * 7 +
          dayIndex
      );

      return date;
    });
  });

  return (
    <div className="w-full min-w-0">
      {/* MOBILE-SAFE SCROLL CONTAINER */}
      <div
        className={[
          "w-full min-w-0 overflow-x-auto overflow-y-hidden",
          "pb-2",
          "[scrollbar-width:thin]",
        ].join(" ")}
      >
        <div className="min-w-[520px]">
          {/* DAY LABELS */}
          <div className="mb-2 grid grid-cols-[32px_repeat(12,minmax(34px,1fr))] gap-1.5 sm:gap-2">
            <div />

            {weeks.map((week, index) => (
              <span
                key={`week-${index}`}
                className="text-center text-[9px] font-medium text-slate-300"
              >
                {week[0].toLocaleDateString([], {
                  month: "short",
                })}
              </span>
            ))}
          </div>

          {/* HEATMAP */}
          <div className="grid grid-cols-[32px_1fr] gap-2">
            {/* DAY LABELS */}
            <div className="grid grid-rows-7 gap-1.5 sm:gap-2">
              {DAYS.map((day) => (
                <span
                  key={day}
                  className="flex items-center text-[9px] font-medium text-slate-300"
                >
                  {day.slice(0, 1)}
                </span>
              ))}
            </div>

            {/* CELLS */}
            <div className="grid grid-cols-12 gap-1.5 sm:gap-2">
              {weeks.map((week, weekIndex) => (
                <div
                  key={`column-${weekIndex}`}
                  className="grid grid-rows-7 gap-1.5 sm:gap-2"
                >
                  {week.map((date) => {
                    const dateKey = getDateKey(date);
                    const entry = entryMap.get(dateKey);

                    const isFuture =
                      date.getTime() > today.getTime();

                    const level = entry?.moodLevel;

                    return (
                      <div
                        key={dateKey}
                        title={`${date.toLocaleDateString()} — ${getMoodLabel(level)}`}
                        aria-label={`${date.toLocaleDateString()} — ${getMoodLabel(level)}`}
                        className={[
                          "relative flex aspect-square min-h-[20px] min-w-[20px]",
                          "items-center justify-center rounded-md",
                          "border transition-colors",
                          isFuture
                            ? "border-transparent bg-slate-50"
                            : level
                              ? getMoodRingColorClass(level)
                              : "border-slate-100 bg-slate-50",
                        ].join(" ")}
                      >
                        {level ? (
                          <MoodFaceIcon
                            level={level}
                            className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                          />
                        ) : null}

                        {dateKey === getDateKey(today) && (
                          <span className="absolute inset-0 rounded-md ring-2 ring-violet-400 ring-offset-1" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LEGEND */}
      <div className="mt-4 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 text-[10px] text-slate-400 sm:gap-x-4 sm:text-xs">
        <span className="font-medium text-slate-500">
          Less
        </span>

        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm border border-slate-100 bg-slate-50" />
          <span>No check-in</span>
        </div>

        {MOOD_SCALE.slice(0, 3).map((mood) => (
          <div
            key={mood.level}
            className="flex items-center gap-1"
          >
            <span
              className={[
                "h-3 w-3 rounded-sm border",
                getMoodRingColorClass(mood.level),
              ].join(" ")}
            />
            <span className="hidden xs:inline">
              {mood.label}
            </span>
          </div>
        ))}

        <span className="font-medium text-slate-500">
          More
        </span>
      </div>
    </div>
  );
}