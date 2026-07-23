import type { MoodEntry } from "@/hooks/useMoodEntries";

function toDateKey(date: Date): string {
  const copy = new Date(date);
  copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
  return copy.toISOString().slice(0, 10);
}

export function calculateStreak(entries: MoodEntry[]): number {
  if (entries.length === 0) return 0;

  const entryDates = new Set(entries.map((entry) => entry.entryDate));

  const cursor = new Date();

  // If today isn't logged yet, start counting from yesterday instead --
  // an active streak shouldn't appear broken just because it's early
  // in the day and today hasn't been checked in yet.
  if (!entryDates.has(toDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (entryDates.has(toDateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
