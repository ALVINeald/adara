"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useWellnessSessions } from "@/hooks/useWellnessSessions";
import BreathingExercise from "@/components/wellness/BreathingExercise";
import { BREATHING_PATTERNS } from "@/components/wellness/breathingPatterns";
import type { BreathingPattern } from "@/components/wellness/BreathingExercise";

export default function BreathingPage() {
  const { user } = useAuth();
  const { recordSession } = useWellnessSessions(user?.id);

  const [selected, setSelected] = useState<BreathingPattern | null>(null);
  const [justCompleted, setJustCompleted] = useState(false);

  async function handleComplete(durationSeconds: number) {
    if (!selected) return;
    await recordSession("breathing", selected.name, durationSeconds);
    setJustCompleted(true);
  }

  if (selected) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)] p-6">
        <button
          type="button"
          onClick={() => {
            setSelected(null);
            setJustCompleted(false);
          }}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Choose a different exercise
        </button>

        {justCompleted ? (
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="h-16 w-16 text-cyan-600" />
            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              Well done.
            </h2>
            <p className="mt-2 text-slate-600">
              You completed {selected.name}.
            </p>
            <button
              type="button"
              onClick={() => setJustCompleted(false)}
              className="mt-6 rounded-xl bg-cyan-600 px-6 py-3 font-medium text-white transition hover:bg-cyan-700"
            >
              Do it again
            </button>
          </div>
        ) : (
          <>
            <h2 className="mb-2 text-xl font-semibold text-slate-900">
              {selected.name}
            </h2>
            <p className="mb-8 text-sm text-slate-500">
              {selected.description}
            </p>
            <BreathingExercise
              pattern={selected}
              onComplete={handleComplete}
            />
          </>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)] p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">
          Breathing Exercises
        </h1>

        <div className="space-y-4">
          {BREATHING_PATTERNS.map((pattern) => (
            <button
              key={pattern.name}
              onClick={() => setSelected(pattern)}
              className="w-full rounded-2xl bg-white p-6 text-left shadow-sm transition hover:shadow-md"
            >
              <h3 className="font-semibold text-slate-900">
                {pattern.name}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {pattern.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}