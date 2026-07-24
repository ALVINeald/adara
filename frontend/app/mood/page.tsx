"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { getProfileNamesByIds } from "@/lib/profiles";

import MoodStoryRing from "@/components/mood/MoodStoryRing";
import MoodHomeCheckIn from "@/components/mood/MoodHomeCheckIn";
import MoodHeatmap from "@/components/mood/MoodHeatmap";
import { calculateStreak } from "@/components/mood/streak";
import { getTimeOfDayGreeting } from "@/components/mood/greeting";
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

  return (
    <AppShell>
    <main className="min-h-screen bg-[linear-gradient(160deg,#f0fbff_0%,#e8fbf5_100%)] p-6">
      <div className="mx-auto max-w-2xl">

        <p className="text-sm text-slate-500">{getTimeOfDayGreeting()}</p>
        <h1 className="mb-5 text-2xl font-bold text-slate-900">
          {firstName}
        </h1>

        <div className="mb-6">
          <MoodStoryRing entries={entries} />
        </div>

        <MoodHomeCheckIn
          name={firstName}
          initialLevel={todaysEntry?.moodLevel}
          initialNote={todaysEntry?.note ?? undefined}
          streak={streak}
          onSave={(level, note) => saveMoodEntry(today, level, note)}
        />

        <div className="mt-10 rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_25px_80px_rgba(15,118,110,0.12)] backdrop-blur-xl">
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