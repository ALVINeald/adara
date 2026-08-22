"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cloud, PenLine } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { getProfileNamesByIds } from "@/lib/profiles";

import MoodStoryRing from "@/components/mood/MoodStoryRing";
import CheckInPromptCard from "@/components/mood/CheckInPromptCard";
import MoodHomeCheckIn from "@/components/mood/MoodHomeCheckIn";
import DashboardStatCards from "@/components/mood/DashboardStatCards";
import ContinueJourneyRow from "@/components/mood/ContinueJourneyRow";
import MoodHeatmap from "@/components/mood/MoodHeatmap";
import { calculateStreak } from "@/components/mood/streak";
import { calculateMoodTrend } from "@/components/mood/moodTrend";
import { getTimeOfDayGreeting } from "@/components/mood/greeting";
import NotificationBell from "@/components/notifications/NotificationBell";
import CompanionSlideOver from "@/components/companion/CompanionSlideOver";
import AppShell from "@/components/navigation/AppShell";

function todayDateKey(): string {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

export default function MoodPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [firstName, setFirstName] = useState("there");
  const [companionOpen, setCompanionOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth/login");
    }
  }, [authLoading, user, router]);

  const {
    entries,
    loading: entriesLoading,
    saveMoodEntry,
  } = useMoodEntries(user?.id);

  useEffect(() => {
    if (!user?.id) return;

    getProfileNamesByIds([user.id]).then(({ data }) => {
      const fullName = data?.[0]?.full_name;

      if (fullName) {
        setFirstName(fullName.split(" ")[0]);
      }
    });
  }, [user?.id]);

  if (authLoading || entriesLoading) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#f8f6ff]">
        <p className="text-sm text-slate-500">Loading...</p>
      </main>
    );
  }

  const today = todayDateKey();

  const todaysEntry = entries.find(
    (entry) => entry.entryDate === today
  );

  const streak = calculateStreak(entries);
  const trend = calculateMoodTrend(entries);

  return (
    <AppShell>
      <main
        className={[
          "min-h-screen w-full overflow-x-hidden",
          "bg-[linear-gradient(160deg,#f8f6ff_0%,#f3edff_100%)]",
          "px-4 pt-5 sm:px-6 sm:pt-6 md:px-10 md:pt-10",
          "transition-[padding] duration-300",
          companionOpen ? "md:pr-[472px]" : "",
        ].join(" ")}
      >
        <div className="mx-auto w-full max-w-6xl min-w-0">

          {/* HEADER */}
          <header className="mb-6 flex w-full min-w-0 items-start justify-between gap-3 sm:mb-8">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-violet-500 sm:text-xs">
                {getTimeOfDayGreeting()}
              </p>

              <h1 className="mt-1 flex min-w-0 items-center gap-1.5 text-[25px] font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl">
                <span className="truncate">{firstName}</span>

                <Cloud
                  className="h-5 w-5 shrink-0 text-slate-300 sm:h-6 sm:w-6"
                  aria-hidden="true"
                />
              </h1>

              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                How are you feeling today?
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => router.push("/journal")}
                className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 md:flex"
              >
                <PenLine className="h-4 w-4" />
                Daily Reflection
              </button>

              <NotificationBell />

              <button
                type="button"
                aria-label="Open settings"
                onClick={() => router.push("/settings")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white transition active:scale-95"
              >
                {firstName.charAt(0).toUpperCase()}
              </button>
            </div>
          </header>

          {/* MOOD STORY */}
          <section className="mb-5 w-full min-w-0 sm:mb-6">
            <MoodStoryRing entries={entries} />
          </section>

          {/* COMPANION PROMPT */}
          <CheckInPromptCard
            onOpenCompanion={() => setCompanionOpen(true)}
          />

          {/* MAIN CHECK-IN */}
          <section className="mb-5 w-full min-w-0 sm:mb-6">
            <MoodHomeCheckIn
              name={firstName}
              initialLevel={todaysEntry?.moodLevel}
              initialNote={todaysEntry?.note ?? undefined}
              streak={streak}
              onSave={(level, note) =>
                saveMoodEntry(today, level, note)
              }
            />
          </section>

          {/* STATS */}
          <DashboardStatCards
            streak={streak}
            trend={trend}
          />

          {/* CONTINUE JOURNEY */}
          <ContinueJourneyRow />

          {/* HISTORY */}
          <section className="w-full min-w-0 rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-[0_20px_60px_rgba(124,58,237,0.08)] backdrop-blur-xl sm:rounded-[32px] sm:p-6">
            <h2 className="mb-4 text-lg font-bold tracking-tight text-slate-900">
              Your History
            </h2>

            <MoodHeatmap entries={entries} />
          </section>
        </div>

        {/* COMPANION */}
        <CompanionSlideOver
          isOpen={companionOpen}
          onClose={() => setCompanionOpen(false)}
        />
      </main>
    </AppShell>
  );
}