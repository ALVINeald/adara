"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Flame, Heart } from "lucide-react";

import type { MoodTrend } from "./moodTrend";

interface DashboardStatCardsProps {
  streak: number;
  trend: MoodTrend;
}

function Sparkline({ points }: { points: (number | null)[] }) {
  const width = 200;
  const height = 56;
  const validLevels = points.filter((p): p is number => p !== null);

  if (validLevels.length < 2) {
    return (
      <div className="flex h-14 items-center text-xs text-slate-400">
        Not enough check-ins yet to chart a trend.
      </div>
    );
  }

  const min = Math.min(...validLevels);
  const max = Math.max(...validLevels);
  const range = max - min || 1;

  const step = width / (points.length - 1);

  const coords = points
    .map((level, index) => {
      if (level === null) return null;
      const x = index * step;
      const y = height - ((level - min) / range) * (height - 8) - 4;
      return { x, y };
    })
    .filter((c): c is { x: number; y: number } => c !== null);

  const path = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-14 w-full">
      <path
        d={path}
        fill="none"
        stroke="rgb(124 58 237)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DashboardStatCards({
  streak,
  trend,
}: DashboardStatCardsProps) {
  const router = useRouter();

  // Progress toward a 30-day streak milestone -- a real, if somewhat
  // arbitrary, target rather than a decorative bar with no basis.
  const streakProgress = Math.min(streak / 30, 1) * 100;

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-3">

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Current Streak</p>
        <div className="mt-2 flex items-end justify-between">
          <p className="text-3xl font-bold text-slate-900">
            {streak} <span className="text-lg font-medium text-slate-400">days</span>
          </p>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
        </div>
        <p className="mb-3 mt-1 text-sm text-slate-400">
          {streak > 0 ? "Amazing consistency!" : "Check in today to start one."}
        </p>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-violet-600 transition-all"
            style={{ width: `${streakProgress}%` }}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">Mood Trend</p>
          {trend.percentChange !== null && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                trend.percentChange >= 0
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {trend.percentChange >= 0 ? "+" : ""}
              {trend.percentChange}%
            </span>
          )}
        </div>
        <div className="mt-2">
          <Sparkline points={trend.points} />
        </div>
        <p className="mt-1 text-sm text-slate-400">
          {trend.percentChange === null
            ? "Keep checking in to see a trend."
            : trend.percentChange >= 0
              ? "Better than last week"
              : "A bit lower than last week"}
        </p>
      </div>

      {/* Static -- no real "daily focus" feature/data source exists
          yet, same reasoning as the Companion header's Focus chip.
          The arrow does something real though: it opens Journal so
          you can actually write about it, rather than going nowhere. */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Today&apos;s Focus</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-50">
                <Heart className="h-5 w-5 text-violet-500" />
              </div>
              <p className="text-lg font-semibold text-slate-900">Self Compassion</p>
            </div>
            <p className="mt-2 text-sm text-slate-400">Be kind to yourself today.</p>
          </div>

          <button
            onClick={() => router.push("/journal")}
            title="Reflect on this in your journal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
