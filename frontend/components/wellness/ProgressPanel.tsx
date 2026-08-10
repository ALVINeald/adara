"use client";

import { Bookmark, Flame } from "lucide-react";

import type { WellnessSession } from "@/hooks/useWellnessSessions";
import type { MoodEntry } from "@/hooks/useMoodEntries";

interface ProgressPanelProps {
  sessions: WellnessSession[];
  savedCount: number;
  moodEntries: MoodEntry[];
}

function toDateKey(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}

function computeStreak(sessions: WellnessSession[]): number {
  const practicedDays = new Set(sessions.map((s) => toDateKey(s.completedAt)));

  let streak = 0;
  const cursor = new Date();

  // If today has no session yet, start counting from yesterday so an
  // in-progress streak doesn't read as broken before the day is over.
  if (!practicedDays.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (practicedDays.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function MoodSparkline({ entries }: { entries: MoodEntry[] }) {
  const recent = [...entries]
    .sort((a, b) => a.entryDate.localeCompare(b.entryDate))
    .slice(-14);

  if (recent.length < 2) {
    return (
      <p className="text-xs text-slate-400">
        Not enough mood data yet for a trend.
      </p>
    );
  }

  const width = 220;
  const height = 40;
  const max = 5;
  const min = 1;

  const points = recent.map((entry, i) => {
    const x = (i / (recent.length - 1)) * width;
    const y = height - ((entry.moodLevel - min) / (max - min)) * height;
    return `${x},${y}`;
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-10 w-full"
      role="img"
      aria-label={`Mood trend over the last ${recent.length} entries`}
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="#7c3aed"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProgressPanel({
  sessions,
  savedCount,
  moodEntries,
}: ProgressPanelProps) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const sessionsThisWeek = sessions.filter(
    (s) => new Date(s.completedAt) >= weekAgo
  );
  const minutesThisWeek = Math.round(
    sessionsThisWeek.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
  );
  const streak = computeStreak(sessions);
  const lastActivity = sessions[0];

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto px-5 py-6">
      <div>
        <div className="flex items-center gap-2 rounded-2xl bg-violet-50 p-4">
          <Flame className="h-5 w-5 text-violet-500" />
          <div>
            <p className="text-lg font-bold text-violet-900">{streak} days</p>
            <p className="text-xs text-violet-600">Weekly streak</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xl font-bold text-slate-900">{minutesThisWeek}</p>
          <p className="text-xs text-slate-500">Minutes this week</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xl font-bold text-slate-900">{sessionsThisWeek.length}</p>
          <p className="text-xs text-slate-500">Sessions this week</p>
        </div>
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Last activity
        </p>
        {lastActivity ? (
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-sm font-medium text-slate-700">
              {lastActivity.exerciseName}
            </p>
            <p className="text-xs text-slate-400">
              {relativeTime(lastActivity.completedAt)}
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-400">No sessions yet.</p>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Mood trend
        </p>
        <MoodSparkline entries={moodEntries} />
      </div>

      <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
        <Bookmark className="h-4 w-4 text-slate-400" />
        {savedCount} saved {savedCount === 1 ? "item" : "items"}
      </div>
    </div>
  );
}
