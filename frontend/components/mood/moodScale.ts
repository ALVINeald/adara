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
      return "bg-cyan-200";
    case 2:
      return "bg-cyan-300";
    case 3:
      return "bg-cyan-400";
    case 4:
      return "bg-cyan-500";
    case 5:
      return "bg-cyan-600";
    default:
      return "bg-slate-100";
  }
}