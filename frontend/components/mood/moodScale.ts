export interface MoodOption {
  level: number;
  emoji: string;
  label: string;
}

export const MOOD_SCALE: MoodOption[] = [
  { level: 1, emoji: "😢", label: "Very Low" },
  { level: 2, emoji: "😕", label: "Low" },
  { level: 3, emoji: "😐", label: "Neutral" },
  { level: 4, emoji: "🙂", label: "Good" },
  { level: 5, emoji: "😄", label: "Great" },
];

export function getMoodOption(level: number): MoodOption | undefined {
  return MOOD_SCALE.find((option) => option.level === level);
}

// Intensity scale for the heatmap uses the app's own primary color at
// varying opacity, rather than a red-to-green scale — a mental wellness
// app shouldn't visually code a low mood day as "alarming red."
export function getMoodColorClass(level?: number): string {
  switch (level) {
    case 1:
      return "bg-violet-200";
    case 2:
      return "bg-violet-300";
    case 3:
      return "bg-violet-400";
    case 4:
      return "bg-violet-500";
    case 5:
      return "bg-violet-600";
    default:
      return "bg-slate-100";
  }
}

// Same non-alarming-color principle as getMoodColorClass above, as a
// border color for the story ring instead of a background fill, and
// in violet to match the rest of the theme pass. Kept as its own
// function rather than repurposing getMoodColorClass so the
// heatmap's already-working behavior isn't touched.
export function getMoodRingColorClass(level?: number): string {
  switch (level) {
    case 1:
      return "border-violet-200";
    case 2:
      return "border-violet-300";
    case 3:
      return "border-violet-400";
    case 4:
      return "border-violet-500";
    case 5:
      return "border-violet-600";
    default:
      return "border-slate-200 border-dashed";
  }
}

// Single consistent pill style for mood badges on Journal entry cards
// and the entry details panel. Deliberately NOT a different hue per
// mood (no red-for-low/green-for-high) -- same reasoning as
// getMoodColorClass above. One calm, consistent violet pill reads
// as "this is your mood, noted" rather than judging the mood itself.
export function getMoodBadgeClass(): string {
  return "bg-violet-50 text-violet-700";
}

// Left-border accent for entry cards -- gives each card a little
// visual personality tied to its real mood intensity, without
// inventing a fake "category color" system the data model doesn't
// have. Same violet-intensity scale and non-alarm-color reasoning as
// getMoodColorClass/getMoodRingColorClass above, just shaped as a
// left-side-only class since those two return full border shorthands
// (including a dashed style for "no mood") that don't decompose
// cleanly into a per-side accent.
export function getMoodAccentBorderClass(level?: number): string {
  switch (level) {
    case 1:
      return "border-l-violet-200";
    case 2:
      return "border-l-violet-300";
    case 3:
      return "border-l-violet-400";
    case 4:
      return "border-l-violet-500";
    case 5:
      return "border-l-violet-600";
    default:
      return "border-l-slate-200";
  }
}