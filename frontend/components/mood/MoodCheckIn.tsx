"use client";

import { useState } from "react";

import { MOOD_SCALE } from "./moodScale";

interface MoodCheckInProps {
  initialLevel?: number;
  initialNote?: string;
  compact?: boolean;
  onSave: (level: number, note: string | null) => Promise<void>;
}

export default function MoodCheckIn({
  initialLevel,
  initialNote,
  compact = false,
  onSave,
}: MoodCheckInProps) {
  const [selectedLevel, setSelectedLevel] = useState<number | undefined>(
    initialLevel
  );
  const [note, setNote] = useState(initialNote ?? "");
  const [showNote, setShowNote] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSelect(level: number) {
    setSelectedLevel(level);

    if (compact) {
      setSaving(true);
      await onSave(level, null);
      setSaving(false);
      return;
    }

    setShowNote(true);
  }

  async function handleSaveWithNote() {
    if (!selectedLevel) return;

    setSaving(true);
    await onSave(selectedLevel, note.trim() ? note.trim() : null);
    setSaving(false);
    setShowNote(false);
  }

  function handleNoteKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSaveWithNote();
    }
  }

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-slate-600">
        How are you feeling today?
      </p>

      <div className="flex items-center gap-2">
        {MOOD_SCALE.map((option) => (
          <button
            key={option.level}
            type="button"
            onClick={() => handleSelect(option.level)}
            disabled={saving}
            title={option.label}
            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition ${
              selectedLevel === option.level
                ? "bg-cyan-100 ring-2 ring-cyan-500"
                : "bg-slate-50 hover:bg-cyan-50"
            }`}
          >
            {option.emoji}
          </button>
        ))}
      </div>

      {!compact && showNote && (
        <div className="mt-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={handleNoteKeyDown}
            placeholder="Add a note (optional)..."
            rows={2}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          />

          <button
            type="button"
            onClick={handleSaveWithNote}
            disabled={saving}
            className="mt-3 rounded-xl bg-cyan-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}