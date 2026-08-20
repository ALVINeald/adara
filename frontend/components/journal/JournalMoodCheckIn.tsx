"use client";

import { MOOD_SCALE } from "@/components/mood/moodScale";
import MoodFaceIcon from "@/components/mood/MoodFaceIcon";
import type { MoodEntry } from "@/hooks/useMoodEntries";

interface JournalMoodCheckInProps {
  todayEntry: MoodEntry | undefined;
  onSelect: (level: number) => void;
}

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function JournalMoodCheckIn({
  todayEntry,
  onSelect,
}: JournalMoodCheckInProps) {
  return (
    <div className="flex shrink-0 items-center gap-2 overflow-x-auto pb-1">
      {MOOD_SCALE.map((option) => {
        const isSelected = todayEntry?.moodLevel === option.level;
        return (
          <button
            key={option.level}
            type="button"
            onClick={() => onSelect(option.level)}
            title={option.label}
            aria-pressed={isSelected}
            className={`flex shrink-0 items-center justify-center rounded-2xl transition-all duration-200 ${
              isSelected
                ? "h-11 w-11 scale-110 bg-violet-600 shadow-md shadow-violet-600/25"
                : "h-10 w-10 bg-slate-100 hover:scale-105 hover:bg-violet-50"
            }`}
          >
            <MoodFaceIcon
              level={option.level}
              className={isSelected ? "h-6 w-6" : "h-5 w-5"}
            />
          </button>
        );
      })}
    </div>
  );
}

export { getTodayDate };
