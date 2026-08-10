"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Star } from "lucide-react";

import MeditationTimer from "./MeditationTimer";
import { MEDITATION_CATEGORIES } from "./meditationCategories";
import type { MeditationCategory } from "@/types/wellness";
import { useWellnessSessions } from "@/hooks/useWellnessSessions";
import { useWellnessSavedItems } from "@/hooks/useWellnessSavedItems";

const DURATIONS = [5, 10, 15, 20];

interface MeditationModuleProps {
  userId?: string;
  initialLeafId?: string | null;
}

export default function MeditationModule({
  userId,
  initialLeafId,
}: MeditationModuleProps) {
  const { recordSession } = useWellnessSessions(userId);
  const { isSaved, toggleSaved } = useWellnessSavedItems(userId);

  const [category, setCategory] = useState<MeditationCategory | null>(
    initialLeafId
      ? MEDITATION_CATEGORIES.find((c) => c.id === initialLeafId) ?? null
      : null
  );
  const [duration, setDuration] = useState<number | null>(null);
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    if (initialLeafId) {
      const match = MEDITATION_CATEGORIES.find((c) => c.id === initialLeafId);
      if (match) {
        setCategory(match);
        setDuration(null);
        setJustCompleted(false);
      }
    }
  }, [initialLeafId]);

  async function handleComplete(durationSeconds: number) {
    if (!category || !duration) return;
    await recordSession("meditation", `${category.name} -- ${duration} min`, durationSeconds);
    setJustCompleted(true);
  }

  if (category && duration) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-10">
        <button
          type="button"
          onClick={() => {
            setDuration(null);
            setJustCompleted(false);
          }}
          className="mb-8 flex items-center gap-2 self-start text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Choose a different duration
        </button>

        {justCompleted ? (
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="h-16 w-16 text-violet-600" />
            <h2 className="mt-4 text-xl font-semibold text-slate-900">Well done.</h2>
            <p className="mt-2 text-slate-600">
              You completed a {duration} minute {category.name.toLowerCase()} meditation.
            </p>
            <button
              type="button"
              onClick={() => setJustCompleted(false)}
              className="mt-6 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-700"
            >
              Meditate again
            </button>
          </div>
        ) : (
          <MeditationTimer
            durationMinutes={duration}
            prompts={category.prompts}
            onComplete={handleComplete}
          />
        )}
      </div>
    );
  }

  if (category) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          All meditation categories
        </button>
        <h1 className="mb-1 text-2xl font-bold text-slate-900">{category.name}</h1>
        <p className="mb-6 text-sm text-slate-500">{category.description}</p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className="rounded-2xl bg-white p-6 text-center shadow-sm transition hover:shadow-md"
            >
              <p className="text-2xl font-bold text-violet-700">{d}</p>
              <p className="text-sm text-slate-500">minutes</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Meditations</h1>
      <p className="mb-6 text-sm text-slate-500">
        Timed, guided sessions to help you find stillness.
      </p>

      <div className="space-y-4">
        {MEDITATION_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-3 rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <button onClick={() => setCategory(cat)} className="flex-1 text-left">
              <h3 className="font-semibold text-slate-900">{cat.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{cat.description}</p>
            </button>
            <button
              type="button"
              onClick={() => toggleSaved("meditation", cat.id)}
              aria-pressed={isSaved("meditation", cat.id)}
              title={isSaved("meditation", cat.id) ? "Remove from favorites" : "Add to favorites"}
              className={`shrink-0 rounded-lg p-1.5 ${
                isSaved("meditation", cat.id) ? "text-amber-400" : "text-slate-300"
              } hover:bg-amber-50 hover:text-amber-400`}
            >
              <Star
                className="h-4 w-4"
                fill={isSaved("meditation", cat.id) ? "currentColor" : "none"}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
