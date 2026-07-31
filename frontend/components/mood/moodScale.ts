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