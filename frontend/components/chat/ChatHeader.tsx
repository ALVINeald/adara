"use client";

import { Flame, PanelLeft, ShieldCheck, Sparkles } from "lucide-react";

import { useMoodEntries } from "@/hooks/useMoodEntries";
import { calculateStreak } from "@/components/mood/streak";
import { getMoodOption } from "@/components/mood/moodScale";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  userId?: string;
}

function todayKey() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

export default function ChatHeader({
  onToggleSidebar,
  userId,
}: ChatHeaderProps) {
  const { entries } = useMoodEntries(userId);

  const todayEntry = entries.find((entry) => entry.entryDate === todayKey());
  const todayMood = todayEntry ? getMoodOption(todayEntry.moodLevel) : undefined;
  const streak = calculateStreak(entries);

  return (
    <header className="border-b border-slate-200 bg-white/70 backdrop-blur">

      <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-6">

        <div className="flex items-center gap-2 md:gap-4">

          <button
            onClick={onToggleSidebar}
            title="Conversations"
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 md:hidden"
          >
            <PanelLeft className="h-5 w-5" />
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-100 md:h-14 md:w-14">

            <Sparkles className="h-4 w-4 text-cyan-700 md:h-7 md:w-7" />

          </div>

          <div>

            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 md:text-2xl">
                Adara Companion
              </h1>
              <span className="hidden items-center gap-1 text-xs font-medium text-emerald-600 md:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Online
              </span>
            </div>

            <p className="mt-1 hidden text-sm text-slate-500 md:block">
              A calm, private space where you can reflect, heal and grow.
            </p>

          </div>

        </div>

        <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 md:flex">

          <ShieldCheck className="h-5 w-5 text-emerald-600" />

          <span className="text-sm font-medium text-emerald-700">
            Private & Secure
          </span>

        </div>

      </div>

      <div className="flex flex-wrap items-center gap-2 px-4 pb-3 md:px-8 md:pb-4">

          {todayMood && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">
              Mood: {todayMood.label} {todayMood.emoji}
            </span>
          )}

          {streak > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
              <Flame className="h-3.5 w-3.5" />
              Streak: {streak} {streak === 1 ? "day" : "days"}
            </span>
          )}

          {/* Static -- there's no real "daily focus" feature/data
              source behind this yet, unlike the two chips above. */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
            Focus: Self Compassion
          </span>

        </div>

    </header>
  );
}
