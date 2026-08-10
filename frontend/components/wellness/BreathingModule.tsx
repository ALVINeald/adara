"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Star } from "lucide-react";

import BreathingExercise from "./BreathingExercise";
import { BREATHING_PATTERNS } from "./breathingPatterns";
import type { BreathingPattern } from "@/types/wellness";
import { useWellnessSessions } from "@/hooks/useWellnessSessions";
import { useWellnessPreferences } from "@/hooks/useWellnessPreferences";
import { useWellnessSavedItems } from "@/hooks/useWellnessSavedItems";

interface BreathingModuleProps {
  userId?: string;
  initialLeafId?: string | null;
}

export default function BreathingModule({
  userId,
  initialLeafId,
}: BreathingModuleProps) {
  const { recordSession } = useWellnessSessions(userId);
  const { preferences, saveBreathingPreference } = useWellnessPreferences(userId);
  const { isSaved, toggleSaved } = useWellnessSavedItems(userId);

  const [selected, setSelected] = useState<BreathingPattern | null>(
    initialLeafId
      ? BREATHING_PATTERNS.find((p) => p.id === initialLeafId) ?? null
      : null
  );
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    if (initialLeafId) {
      const match = BREATHING_PATTERNS.find((p) => p.id === initialLeafId);
      if (match) {
        setSelected(match);
        setJustCompleted(false);
      }
    }
  }, [initialLeafId]);

  async function handleComplete(durationSeconds: number) {
    if (!selected) return;
    await recordSession("breathing", selected.name, durationSeconds);
    setJustCompleted(true);
  }

  if (selected) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-10">
        <div className="mb-8 flex w-full items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setJustCompleted(false);
            }}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            All breathing exercises
          </button>

          <button
            type="button"
            onClick={() => toggleSaved("breathing", selected.id)}
            aria-pressed={isSaved("breathing", selected.id)}
            title={isSaved("breathing", selected.id) ? "Remove from favorites" : "Add to favorites"}
            className={`rounded-lg p-1.5 ${
              isSaved("breathing", selected.id) ? "text-amber-400" : "text-slate-300"
            } hover:bg-amber-50 hover:text-amber-400`}
          >
            <Star
              className="h-4 w-4"
              fill={isSaved("breathing", selected.id) ? "currentColor" : "none"}
            />
          </button>
        </div>

        {justCompleted ? (
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="h-16 w-16 text-violet-600" />
            <h2 className="mt-4 text-xl font-semibold text-slate-900">Well done.</h2>
            <p className="mt-2 text-slate-600">You completed {selected.name}.</p>
            <button
              type="button"
              onClick={() => setJustCompleted(false)}
              className="mt-6 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-700"
            >
              Do it again
            </button>
          </div>
        ) : (
          <>
            <h2 className="mb-2 text-xl font-semibold text-slate-900">
              {selected.name}
            </h2>
            <p className="mb-8 text-center text-sm text-slate-500">
              {selected.description}
            </p>
            <BreathingExercise
              pattern={selected}
              initialCycles={preferences.breathingCycles ?? 4}
              initialCustomPhases={
                preferences.breathingPatternId === selected.id
                  ? preferences.breathingCustomPhases
                  : null
              }
              onComplete={handleComplete}
              onPreferenceChange={(cyclesValue, customPhases) =>
                saveBreathingPreference(selected.id, cyclesValue, customPhases)
              }
            />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Breathing Exercises</h1>
      <p className="mb-6 text-sm text-slate-500">
        Guided breathing patterns to calm your mind and body.
      </p>

      <div className="space-y-4">
        {BREATHING_PATTERNS.map((pattern) => (
          <div
            key={pattern.id}
            className="flex items-center gap-3 rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <button
              onClick={() => setSelected(pattern)}
              className="flex-1 text-left"
            >
              <h3 className="font-semibold text-slate-900">{pattern.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{pattern.description}</p>
            </button>
            <button
              type="button"
              onClick={() => toggleSaved("breathing", pattern.id)}
              aria-pressed={isSaved("breathing", pattern.id)}
              title={isSaved("breathing", pattern.id) ? "Remove from favorites" : "Add to favorites"}
              className={`shrink-0 rounded-lg p-1.5 ${
                isSaved("breathing", pattern.id) ? "text-amber-400" : "text-slate-300"
              } hover:bg-amber-50 hover:text-amber-400`}
            >
              <Star
                className="h-4 w-4"
                fill={isSaved("breathing", pattern.id) ? "currentColor" : "none"}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
