export interface BreathingPhase {
  label: string;
  seconds: number;
  scale: number;
}

export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  phases: BreathingPhase[];
}

export interface MeditationCategory {
  id: string;
  name: string;
  description: string;
  prompts: string[];
}

export interface PlaylistResource {
  id: string;
  name: string;
  description: string;
  bestFor: string;
  url: string;
}

export interface Article {
  slug: string;
  title: string;
  summary: string;
  content: string[];
  tags: string[];
  readTimeMinutes: number;
}

export type WellnessPillar = "breathing" | "meditation" | "playlists" | "articles";

export type SavedItemType = "breathing" | "meditation" | "playlist" | "article";

export interface SavedWellnessItem {
  id: string;
  userId: string;
  itemType: SavedItemType;
  itemId: string;
  createdAt: string;
}

export interface WellnessPreferences {
  breathingPatternId: string | null;
  breathingCycles: number | null;
  breathingCustomPhases: BreathingPhase[] | null;
}
