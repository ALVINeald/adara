"use client";

import { useMemo, useState } from "react";

import { getMoodColorClass, getMoodOption } from "./moodScale";
import MoodFaceIcon from "./MoodFaceIcon";
import type { MoodEntry } from "@/hooks/useMoodEntries";

interface MoodHeatmapProps {
  entries: MoodEntry[];
  weeksToShow?: number;
}

interface DayCell {
  date: string; // YYYY-MM-DD
  entry?: MoodEntry;
}

const DAY_ROW_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

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

// Which weeks (by index) start a new month, and that month's short
// label -- GitHub shows a label only where a month genuinely begins
// within the visible grid, not on every column.
function getMonthLabels(weeks: DayCell[][]): { weekIndex: number; label: string }[] {
  const labels: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const firstDayOfWeek = new Date(week[0].date + "T00:00:00");
    const month = firstDayOfWeek.getMonth();

    if (month !== lastMonth) {
      labels.push({
        weekIndex,
        label: firstDayOfWeek.toLocaleDateString([], { month: "short" }),
      });
      lastMonth = month;
    }
  });

  return labels;
}

export default function MoodHeatmap({
  entries,
  weeksToShow = 26,
}: MoodHeatmapProps) {
  const weeks = useMemo(
    () => buildGrid(entries, weeksToShow),
    [entries, weeksToShow]
  );

  const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks]);

  const [hovered, setHovered] = useState<DayCell | null>(null);

  const today = formatDateKey(new Date());

  const checkInCount = useMemo(() => {
    const visibleDates = new Set(
      weeks.flat().map((day) => day.date)
    );
    return entries.filter((entry) => visibleDates.has(entry.entryDate)).length;
  }, [weeks, entries]);

  return (
    <div className="relative">

      <p className="mb-3 text-sm text-slate-500">
        <span className="font-semibold text-slate-700">{checkInCount}</span>{" "}
        check-ins in the last {weeksToShow} weeks
      </p>

      <div className="flex gap-2 overflow-x-auto pb-2">

        {/* Day-of-week row labels */}
        <div className="flex flex-col gap-1 pt-5">
          {DAY_ROW_LABELS.map((label, i) => (
            <span
              key={i}
              className="h-4 text-[10px] leading-4 text-slate-400"
            >
              {label}
            </span>
          ))}
        </div>

        <div>
          {/* Month labels */}
          <div className="relative mb-1 h-4">
            {monthLabels.map(({ weekIndex, label }) => (
              <span
                key={weekIndex + label}
                className="absolute text-[10px] text-slate-400"
                style={{ left: `${weekIndex * 20}px` }}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="flex gap-1">
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
                          ? "cursor-pointer hover:ring-2 hover:ring-violet-300"
                          : ""
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-slate-400">
        Less
        {[undefined, 1, 2, 3, 4, 5].map((level, i) => (
          <span
            key={i}
            className={`h-3 w-3 rounded-sm ${getMoodColorClass(level)}`}
          />
        ))}
        More
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
              <div className="flex items-center gap-1.5">
                <MoodFaceIcon
                  level={hovered.entry.moodLevel}
                  className="h-4 w-4"
                />
                {getMoodOption(hovered.entry.moodLevel)?.label}
              </div>
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
