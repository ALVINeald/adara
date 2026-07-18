import type { BreathingPattern } from "./BreathingExercise";

export const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    name: "Box Breathing",
    description:
      "Equal counts of inhale, hold, exhale, and hold. Calming and grounding.",
    phases: [
      { label: "Breathe In", seconds: 4, scale: 1.4 },
      { label: "Hold", seconds: 4, scale: 1.4 },
      { label: "Breathe Out", seconds: 4, scale: 1 },
      { label: "Hold", seconds: 4, scale: 1 },
    ],
  },
  {
    name: "4-7-8 Technique",
    description:
      "A longer exhale to help ease anxiety and support restful sleep.",
    phases: [
      { label: "Breathe In", seconds: 4, scale: 1.4 },
      { label: "Hold", seconds: 7, scale: 1.4 },
      { label: "Breathe Out", seconds: 8, scale: 1 },
    ],
  },
  {
    name: "Simple Calm Breath",
    description: "A gentle, easy pattern — a good starting point.",
    phases: [
      { label: "Breathe In", seconds: 4, scale: 1.3 },
      { label: "Breathe Out", seconds: 4, scale: 1 },
    ],
  },
];