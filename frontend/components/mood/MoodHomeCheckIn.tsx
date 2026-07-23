"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import { MOOD_SCALE } from "./moodScale";
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
    if (!selectedLevel) return;
    setSaving(true);
    await onSave(selectedLevel, note.trim() ? note.trim() : null);
    setSaving(false);
    setShowNote(false);
  }

  function handleNoteKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSave();
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-[28px] bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,118,110,0.08)]">

      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-cyan-600" />
        <span className="text-xs font-semibold tracking-wide text-cyan-700">
          ADARA
        </span>
      </div>

      <p className="text-lg font-medium text-slate-900">
        Hey {name}, how are you feeling {getTimeOfDayPhrase()}?
      </p>

      <div className="flex items-center gap-3">
        {MOOD_SCALE.map((option) => {
          const isSelected = selectedLevel === option.level;

          return (
            <button
              key={option.level}
              type="button"
              onClick={() => handleSelect(option.level)}
              title={option.label}
              className={`flex items-center justify-center rounded-2xl transition ${
                isSelected
                  ? "h-14 w-14 bg-cyan-600 text-2xl shadow-lg shadow-cyan-600/30"
                  : "h-11 w-11 bg-slate-100 text-xl hover:bg-cyan-50"
              }`}
            >
              {option.emoji}
            </button>
          );
        })}
      </div>

      {showNote ? (
        <div className="w-full">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={handleNoteKeyDown}
            placeholder="Want to tell me more? Totally optional."
            rows={2}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-3 w-full rounded-xl bg-cyan-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save check-in"}
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-400">
          Want to tell me more? Totally optional.
        </p>
      )}

      {streak > 0 && (
        <div className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5">
          <span className="text-sm">🔥</span>
          <span className="text-xs font-semibold text-amber-800">
            {streak} day{streak === 1 ? "" : "s"} streak
          </span>
        </div>
      )}

    </div>
  );
}