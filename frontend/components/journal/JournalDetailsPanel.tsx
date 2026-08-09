"use client";

import { useState } from "react";
import { Calendar, Clock, Lock, Plus, X } from "lucide-react";

import { MOOD_SCALE, getMoodOption } from "@/components/mood/moodScale";

interface JournalDetailsPanelProps {
  createdAt: string;
  moodLevel: number | null;
  onMoodLevelChange: (level: number | null) => void;
  energyLevel: number | null;
  onEnergyLevelChange: (level: number) => void;
  stressLevel: number | null;
  onStressLevelChange: (level: number) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  isPrivate: boolean;
  onIsPrivateChange: (isPrivate: boolean) => void;
}

// Energy and stress use the same single-hue violet intensity scale as
// mood elsewhere in the app (see getMoodColorClass) rather than a
// red/orange "high stress = alarm" scale -- a mental wellness app
// logging a hard day shouldn't paint it as a warning color. This is
// a deliberate departure from the reference image's orange stress
// dots, kept consistent with the app's own existing design principle
// instead of copied literally.
function dotClass(filled: boolean) {
  return filled ? "bg-violet-500" : "bg-slate-200";
}

function DotScale({
  value,
  onChange,
  label,
}: {
  value: number | null;
  onChange: (level: number) => void;
  label: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-xs font-medium text-slate-400">
          {value ? `${value}/5` : "Not set"}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            type="button"
            title={`${level}/5`}
            onClick={() => onChange(level)}
            className={`h-2.5 w-6 rounded-full transition ${dotClass(
              !!value && level <= value
            )}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function JournalDetailsPanel({
  createdAt,
  moodLevel,
  onMoodLevelChange,
  energyLevel,
  onEnergyLevelChange,
  stressLevel,
  onStressLevelChange,
  tags,
  onTagsChange,
  isPrivate,
  onIsPrivateChange,
}: JournalDetailsPanelProps) {
  const [tagDraft, setTagDraft] = useState("");
  const [moodMenuOpen, setMoodMenuOpen] = useState(false);

  const date = new Date(createdAt);
  const moodOption = moodLevel ? getMoodOption(moodLevel) : undefined;

  function addTag() {
    const trimmed = tagDraft.trim();
    if (!trimmed || tags.includes(trimmed)) {
      setTagDraft("");
      return;
    }
    onTagsChange([...tags, trimmed]);
    setTagDraft("");
  }

  function removeTag(tag: string) {
    onTagsChange(tags.filter((t) => t !== tag));
  }

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto px-5 py-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Date &amp; Time
        </p>
        <div className="space-y-1.5 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            {date.toLocaleDateString([], {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Mood
        </p>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMoodMenuOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
          >
            <span className="flex items-center gap-2">
              {moodOption ? (
                <>
                  <span>{moodOption.emoji}</span>
                  <span className="text-slate-700">{moodOption.label}</span>
                </>
              ) : (
                <span className="text-slate-400">Not set</span>
              )}
            </span>
          </button>

          {moodMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMoodMenuOpen(false)}
              />
              <div className="absolute left-0 top-full z-20 mt-1 w-full overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg">
                {MOOD_SCALE.map((option) => (
                  <button
                    key={option.level}
                    type="button"
                    onClick={() => {
                      onMoodLevelChange(option.level);
                      setMoodMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-slate-50"
                  >
                    <span>{option.emoji}</span>
                    {option.label}
                  </button>
                ))}
                {moodLevel !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      onMoodLevelChange(null);
                      setMoodMenuOpen(false);
                    }}
                    className="flex w-full items-center px-3 py-1.5 text-left text-sm text-slate-400 hover:bg-slate-50"
                  >
                    Clear
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <DotScale value={energyLevel} onChange={onEnergyLevelChange} label="Energy" />
      <DotScale value={stressLevel} onChange={onStressLevelChange} label="Stress" />

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Tags
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag ${tag}`}
                className="text-violet-400 hover:text-violet-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <input
            type="text"
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag..."
            className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-violet-400"
          />
          <button
            type="button"
            onClick={addTag}
            title="Add tag"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-start justify-between gap-3 border-t border-slate-100 pt-5">
        <div className="flex items-start gap-2">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <div>
            <p className="text-sm font-medium text-slate-700">Private entry</p>
            <p className="text-xs text-slate-500">Only you can see this entry</p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isPrivate}
          onClick={() => onIsPrivateChange(!isPrivate)}
          className={`relative h-6 w-11 shrink-0 rounded-full transition ${
            isPrivate ? "bg-violet-600" : "bg-slate-200"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
              isPrivate ? "left-[22px]" : "left-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
