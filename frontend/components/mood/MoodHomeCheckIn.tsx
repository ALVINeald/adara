"use client";

import { useState } from "react";
import { Flame, Sparkles } from "lucide-react";

import { MOOD_SCALE } from "./moodScale";
import MoodFaceIcon from "./MoodFaceIcon";
import { getTimeOfDayPhrase } from "./greeting";

interface MoodHomeCheckInProps {
  name: string;
  initialLevel?: number;
  initialNote?: string;
  streak: number;
  onSave: (level: number, note: string | null) => Promise<void>;
}

export default function MoodHomeCheckIn({
  name,
  initialLevel,
  initialNote,
  streak,
  onSave,
}: MoodHomeCheckInProps) {
  const [selectedLevel, setSelectedLevel] = useState<number | undefined>(
    initialLevel
  );

  const [note, setNote] = useState(initialNote ?? "");
  const [showNote, setShowNote] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleSelect(level: number) {
    setSelectedLevel(level);
    setShowNote(true);
  }

  async function handleSave() {
    if (!selectedLevel || saving) return;

    setSaving(true);

    try {
      await onSave(
        selectedLevel,
        note.trim() ? note.trim() : null
      );

      setShowNote(false);
    } finally {
      setSaving(false);
    }
  }

  function handleNoteKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSave();
    }
  }

  return (
    <section className="w-full min-w-0 rounded-[24px] bg-white p-5 text-center shadow-[0_20px_60px_rgba(15,118,110,0.08)] sm:rounded-[28px] sm:p-8">
      {/* BRAND MARK */}
      <div className="flex items-center justify-center gap-2">
        <Sparkles
          className="h-4 w-4 text-violet-600"
          aria-hidden="true"
        />

        <span className="text-xs font-semibold tracking-wide text-violet-700">
          ADARA
        </span>
      </div>

      {/* QUESTION */}
      <p className="mx-auto mt-3 max-w-sm text-base font-medium leading-6 text-slate-900 sm:text-lg">
        Hey {name}, how are you feeling {getTimeOfDayPhrase()}?
      </p>

      {/* MOOD SELECTOR */}
      <div className="mx-auto mt-5 grid w-full max-w-[360px] grid-cols-5 place-items-center gap-2 sm:gap-3">
        {MOOD_SCALE.map((option) => {
          const isSelected = selectedLevel === option.level;

          return (
            <button
              key={option.level}
              type="button"
              onClick={() => handleSelect(option.level)}
              aria-label={option.label}
              aria-pressed={isSelected}
              title={option.label}
              className={[
                "flex shrink-0 items-center justify-center rounded-2xl",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2",
                "active:scale-95",
                isSelected
                  ? "h-12 w-12 scale-105 bg-violet-600 shadow-lg shadow-violet-600/30 sm:h-14 sm:w-14"
                  : "h-11 w-11 bg-slate-100 hover:scale-105 hover:bg-violet-50 sm:h-12 sm:w-12",
              ].join(" ")}
            >
              <MoodFaceIcon
                level={option.level}
                className={
                  isSelected
                    ? "h-8 w-8 sm:h-9 sm:w-9"
                    : "h-7 w-7"
                }
              />
            </button>
          );
        })}
      </div>

      {/* OPTIONAL NOTE */}
      {showNote ? (
        <div className="mt-5 w-full">
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            onKeyDown={handleNoteKeyDown}
            placeholder="Want to tell me more? Totally optional."
            rows={3}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-5 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="mt-3 min-h-11 w-full rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save check-in"}
          </button>
        </div>
      ) : (
        <p className="mt-4 text-xs text-slate-400">
          Want to tell me more? Totally optional.
        </p>
      )}

      {/* STREAK */}
      {streak > 0 && (
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5">
          <Flame
            className="h-3.5 w-3.5 text-amber-600"
            aria-hidden="true"
          />

          <span className="text-xs font-semibold text-amber-800">
            {streak} day{streak === 1 ? "" : "s"} streak
          </span>
        </div>
      )}
    </section>
  );
}