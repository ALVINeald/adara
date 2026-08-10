import type { MeditationCategory } from "@/types/wellness";

export const MEDITATION_CATEGORIES: MeditationCategory[] = [
  {
    id: "sleep",
    name: "Sleep",
    description: "Wind down and let the day loosen its grip.",
    prompts: [
      "Let your eyes rest, even if they're already closed.",
      "Notice the weight of your body against the bed.",
      "There's nothing left to solve tonight.",
      "Let your breath get slower than it wants to.",
      "If a thought arrives, let it pass through, not stay.",
      "You don't have to fall asleep. Just resting is enough.",
    ],
  },
  {
    id: "focus",
    name: "Focus",
    description: "A short reset before deep, deliberate work.",
    prompts: [
      "Notice where your attention is right now.",
      "Let your breath find a steady, even rhythm.",
      "One thing at a time is enough.",
      "Notice any tension in your jaw or shoulders, and soften it.",
      "Your mind will wander. Gently bring it back, as many times as it takes.",
      "You're building the space you're about to work in.",
    ],
  },
  {
    id: "anxiety-relief",
    name: "Anxiety Relief",
    description: "For when your thoughts are moving faster than you are.",
    prompts: [
      "You are safe in this exact moment.",
      "Notice your feet, or whatever is supporting you right now.",
      "Let your exhale be longer than your inhale.",
      "The feeling is real, but it isn't an emergency.",
      "Nothing here needs fixing right now. Just noticing.",
      "This will pass, the way it always has before.",
    ],
  },
  {
    id: "gratitude",
    name: "Gratitude",
    description: "A few quiet minutes to notice what's already good.",
    prompts: [
      "Bring to mind one small thing that went well today.",
      "Notice someone who made today a little easier.",
      "You don't need a big reason to feel thankful.",
      "Let yourself actually feel it, not just think it.",
      "Notice your own effort today, and let that count for something.",
      "Small good things are still good things.",
    ],
  },
];
