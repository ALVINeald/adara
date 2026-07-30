import type { MoodEntry } from "@/hooks/useMoodEntries";

function dateKeysAgo(daysAgo: number): string {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

export interface MoodTrend {
  // Last 7 days' mood levels, oldest first, for the sparkline --
  // null for days with no entry (line just skips that point).
  points: (number | null)[];
  // Percent change in average mood, this week vs the previous week.
  // Null if there's no previous-week data to compare against.
  percentChange: number | null;
}

export function calculateMoodTrend(entries: MoodEntry[]): MoodTrend {
  const byDate = new Map(entries.map((entry) => [entry.entryDate, entry.moodLevel]));

  const points: (number | null)[] = [];
  const last7Levels: number[] = [];
  const prev7Levels: number[] = [];

  for (let i = 6; i >= 0; i--) {
    const level = byDate.get(dateKeysAgo(i)) ?? null;
    points.push(level);
    if (level !== null) last7Levels.push(level);
  }

  for (let i = 13; i >= 7; i--) {
    const level = byDate.get(dateKeysAgo(i));
    if (level !== undefined) prev7Levels.push(level);
  }

  if (last7Levels.length === 0 || prev7Levels.length === 0) {
    return { points, percentChange: null };
  }

  const avg = (levels: number[]) =>
    levels.reduce((sum, level) => sum + level, 0) / levels.length;

  const avgLast7 = avg(last7Levels);
  const avgPrev7 = avg(prev7Levels);

  const percentChange = Math.round(
    ((avgLast7 - avgPrev7) / avgPrev7) * 100
  );

  return { points, percentChange };
}
