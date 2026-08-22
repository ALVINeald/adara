"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Flame, Heart } from "lucide-react";

import type { MoodTrend } from "./moodTrend";

interface DashboardStatCardsProps {
  streak: number;
  trend: MoodTrend;
}

function Sparkline({
  points,
}: {
  points: (number | null)[];
}) {
  const width = 200;
  const height = 56;

  const validLevels = points.filter(
    (point): point is number => point !== null
  );

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

      const y =
        height -
        ((level - min) / range) * (height - 8) -
        4;

      return { x, y };
    })
    .filter(
      (
        point
      ): point is {
        x: number;
        y: number;
      } => point !== null
    );

  const path = coords
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-14 w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
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

  const streakProgress = Math.min(streak / 30, 1) * 100;

  return (
    <section className="mb-5 grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:mb-6 md:grid-cols-3">
      {/* CURRENT STREAK */}
      <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <p className="text-sm font-medium text-slate-500">
          Current Streak
        </p>

        <div className="mt-2 flex min-w-0 items-end justify-between gap-3">
          <p className="min-w-0 text-2xl font-extrabold tabular-nums tracking-tight text-slate-900 sm:text-3xl">
            {streak}{" "}
            <span className="text-base font-medium text-slate-400">
              days
            </span>
          </p>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50">
            <Flame
              className="h-5 w-5 text-orange-500"
              aria-hidden="true"
            />
          </div>
        </div>

        <p className="mb-3 mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
          {streak > 0
            ? "Amazing consistency!"
            : "Check in today to start one."}
        </p>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-violet-600 transition-all duration-500"
            style={{
              width: `${streakProgress}%`,
            }}
          />
        </div>
      </div>

      {/* MOOD TREND */}
      <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-slate-500">
            Mood Trend
          </p>

          {trend.percentChange !== null && (
            <span
              className={[
                "shrink-0 rounded-full px-2 py-0.5",
                "text-xs font-semibold",
                trend.percentChange >= 0
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-500",
              ].join(" ")}
            >
              {trend.percentChange >= 0 ? "+" : ""}
              {trend.percentChange}%
            </span>
          )}
        </div>

        <div className="mt-2 min-w-0">
          <Sparkline points={trend.points} />
        </div>

        <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
          {trend.percentChange === null
            ? "Keep checking in to see a trend."
            : trend.percentChange >= 0
              ? "Better than last week"
              : "A bit lower than last week"}
        </p>
      </div>

      {/* TODAY'S FOCUS */}
      <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">
              Today&apos;s Focus
            </p>

            <div className="mt-3 flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50">
                <Heart
                  className="h-5 w-5 text-violet-500"
                  aria-hidden="true"
                />
              </div>

              <p className="min-w-0 text-base font-semibold leading-5 text-slate-900 sm:text-lg">
                Self Compassion
              </p>
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-400 sm:text-sm">
              Be kind to yourself today.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/journal")}
            title="Reflect on this in your journal"
            aria-label="Reflect on this in your journal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-200"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}