"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PenLine } from "lucide-react";

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
import AppShell from "@/components/navigation/AppShell";

function todayDateKey(): string {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

export default function MoodPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth/login");
    }
  }, [authLoading, user, router]);

  const { entries, loading: entriesLoading, saveMoodEntry } = useMoodEntries(
    user?.id
  );

  const [firstName, setFirstName] = useState("there");

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
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </main>
    );
  }

  const today = todayDateKey();
  const todaysEntry = entries.find((entry) => entry.entryDate === today);
  const streak = calculateStreak(entries);
  const trend = calculateMoodTrend(entries);

  return (
    <AppShell>
    <main className="min-h-screen bg-[linear-gradient(160deg,#f0fbff_0%,#e8fbf5_100%)] p-6 md:p-10">
      <div className="mx-auto max-w-6xl">

        {/* Top bar */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{getTimeOfDayGreeting()}</p>
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
              {firstName}
            </h1>
            <p className="mt-1 text-slate-500">How are you feeling today?</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/journal")}
              className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 md:flex"
            >
              <PenLine className="h-4 w-4" />
              Daily Reflection
            </button>

            <NotificationBell />

            <button
              onClick={() => router.push("/settings")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-sm font-semibold text-white"
            >
              {firstName.charAt(0).toUpperCase()}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <MoodStoryRing entries={entries} />
        </div>

        <CheckInPromptCard />

        <div className="mb-6">
          <MoodHomeCheckIn
            name={firstName}
            initialLevel={todaysEntry?.moodLevel}
            initialNote={todaysEntry?.note ?? undefined}
            streak={streak}
            onSave={(level, note) => saveMoodEntry(today, level, note)}
          />
        </div>

        <DashboardStatCards streak={streak} trend={trend} />

        <ContinueJourneyRow />

        <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_25px_80px_rgba(15,118,110,0.12)] backdrop-blur-xl">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Your History
          </h2>
          <MoodHeatmap entries={entries} />
        </div>

      </div>
    </main>
    </AppShell>
  );
}
