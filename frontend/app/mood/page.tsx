"use client";

import { useAuth } from "@/hooks/useAuth";
import { useMoodEntries } from "@/hooks/useMoodEntries";

import MoodCheckIn from "@/components/mood/MoodCheckIn";
import MoodHeatmap from "@/components/mood/MoodHeatmap";

function todayDateKey(): string {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

export default function MoodPage() {
  const { user, loading: authLoading } = useAuth();
  const { entries, loading: entriesLoading, saveMoodEntry } = useMoodEntries(
    user?.id
  );

  if (authLoading || entriesLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </main>
    );
  }

  const today = todayDateKey();
  const todaysEntry = entries.find((entry) => entry.entryDate === today);

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)] p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">
          Mood Tracker
        </h1>

        <div className="mb-8 rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_25px_80px_rgba(15,118,110,0.12)] backdrop-blur-xl">
          <MoodCheckIn
            initialLevel={todaysEntry?.moodLevel}
            initialNote={todaysEntry?.note ?? undefined}
            onSave={(level, note) => saveMoodEntry(today, level, note)}
          />
        </div>

        <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_25px_80px_rgba(15,118,110,0.12)] backdrop-blur-xl">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Your History
          </h2>
          <MoodHeatmap entries={entries} />
        </div>
      </div>
    </main>
  );
}