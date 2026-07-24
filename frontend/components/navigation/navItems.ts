import {
  Smile,
  Sparkles,
  BookOpen,
  Leaf,
  Users,
  Calendar,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface WellnessSubItem {
  label: string;
  href: string;
}

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  subItems?: WellnessSubItem[];
}

export const NAV_ITEMS: NavItem[] = [
  { key: "mood", label: "Mood", href: "/mood", icon: Smile },
  { key: "companion", label: "Companion", href: "/chat", icon: Sparkles },
  { key: "journal", label: "Journal", href: "/journal", icon: BookOpen },
  {
    key: "wellness",
    label: "Wellness",
    href: "/wellness",
    icon: Leaf,
    subItems: [
      { label: "Breathing", href: "/wellness/breathing" },
      { label: "Meditation", href: "/wellness/meditation" },
      { label: "Playlists", href: "/wellness/playlists" },
      { label: "Articles", href: "/wellness/articles" },
    ],
  },
  { key: "community", label: "Community", href: "/communities", icon: Users },
  { key: "therapists", label: "Therapists", href: "/therapists", icon: Calendar },
];

// The 4 always-visible mobile bottom-tab items -- Wellness and
// Therapists live inside "More" instead, since a 6-item bottom bar
// gets cramped on real phone widths.
export const MOBILE_TAB_KEYS = ["mood", "companion", "journal", "community"];