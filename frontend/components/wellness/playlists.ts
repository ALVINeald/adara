export interface PlaylistResource {
  name: string;
  description: string;
  bestFor: string;
  url: string;
}

export const MEDITATION_PLAYLISTS: PlaylistResource[] = [
  {
    name: "Calm",
    description:
      "One of the most recognized names in meditation, offering polished, accessible sessions for a wide range of needs.",
    bestFor: "A reliable starting point if you're not sure what you need yet.",
    url: "https://www.youtube.com/channel/UChSpME3QaSFAWK8Hpmg-Dyw",
  },
  {
    name: "The Honest Guys",
    description:
      "Free guided meditations and relaxation audio since 2009, with no religious or spiritual framing — built to be approachable for anyone.",
    bestFor: "Sleep, deep relaxation, and if meditation has felt intimidating before.",
    url: "https://www.youtube.com/channel/UC4jWo5kiyOCt4PnvF4jbaLg",
  },
  {
    name: "Declutter The Mind",
    description:
      "Secular, practical guided meditations organized by specific struggle — anxiety, depression, stress, sleep — rather than vague mood categories.",
    bestFor: "When you know exactly what you're dealing with and want something direct.",
    url: "https://www.youtube.com/channel/UC2ZvMgbK5X8j-nCY5CR06xw",
  },
  {
    name: "Generation Calm",
    description:
      "Guided meditations written and narrated by a clinical psychologist, specifically for people managing chronic illness and anxiety.",
    bestFor: "Living with a long-term health condition alongside anxiety or overwhelm.",
    url: "https://www.youtube.com/c/GenerationCalm",
  },
];