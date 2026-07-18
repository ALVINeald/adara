"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useWellnessSessions } from "@/hooks/useWellnessSessions";
import MeditationTimer from "@/components/wellness/MeditationTimer";

const DURATIONS = [5, 10, 15, 20];

export default function MeditationPage() {
  const { user } = useAuth();
  const { recordSession } = useWellnessSessions(user?.id);

  const [selectedDuration, setSelectedDuration] = useState<number | null>(
    null
  );
  const [justCompleted, setJustCompleted] = useState(false);

  async function handleComplete(durationSeconds: number) {
    if (!selectedDuration) return;
    await recordSession(
      "meditation",
      `${selectedDuration} min Meditation`,
      durationSeconds
    );
    setJustCompleted(true);
  }

  if (selectedDuration) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)] p-6">
        <button
          type="button"
          onClick={() => {
            setSelectedDuration(null);
            setJustCompleted(false);
          }}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Choose a different duration
        </button>

        {justCompleted ? (
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="h-16 w-16 text-cyan-600" />
            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              Well done.
            </h2>
            <p className="mt-2 text-slate-600">
              You completed a {selectedDuration} minute meditation.
            </p>
            <button
              type="button"
              onClick={() => setJustCompleted(false)}
              className="mt-6 rounded-xl bg-cyan-600 px-6 py-3 font-medium text-white transition hover:bg-cyan-700"
            >
              Meditate again
            </button>
          </div>
        ) : (
          <MeditationTimer
            durationMinutes={selectedDuration}
            onComplete={handleComplete}
          />
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)] p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">
          Meditation
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          Choose how long you'd like to sit.
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {DURATIONS.map((duration) => (
            <button
              key={duration}
              onClick={() => setSelectedDuration(duration)}
              className="rounded-2xl bg-white p-6 text-center shadow-sm transition hover:shadow-md"
            >
              <p className="text-2xl font-bold text-cyan-700">{duration}</p>
              <p className="text-sm text-slate-500">minutes</p>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}