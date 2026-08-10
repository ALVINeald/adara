"use client";

import { BookOpenText, Headphones, Sparkles, Wind } from "lucide-react";
import type { WellnessPillar } from "@/types/wellness";

const TABS: { pillar: WellnessPillar; label: string; icon: typeof Wind }[] = [
  { pillar: "breathing", label: "Breathing", icon: Wind },
  { pillar: "meditation", label: "Meditations", icon: Sparkles },
  { pillar: "playlists", label: "Playlists", icon: Headphones },
  { pillar: "articles", label: "Articles", icon: BookOpenText },
];

interface MobileCategoryTabsProps {
  active: WellnessPillar;
  onSelect: (pillar: WellnessPillar) => void;
}

export default function MobileCategoryTabs({
  active,
  onSelect,
}: MobileCategoryTabsProps) {
  return (
    <div className="sticky top-0 z-10 flex gap-2 overflow-x-auto border-b border-slate-100 bg-white/95 px-3 py-2 backdrop-blur">
      {TABS.map(({ pillar, label, icon: Icon }) => (
        <button
          key={pillar}
          type="button"
          onClick={() => onSelect(pillar)}
          aria-pressed={active === pillar}
          className={`flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition ${
            active === pillar
              ? "bg-violet-600 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}
