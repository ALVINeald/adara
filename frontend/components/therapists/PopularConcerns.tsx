"use client";

import { useMemo } from "react";
import type { Therapist } from "@/hooks/useTherapists";

interface PopularConcernsProps {
  therapists: Therapist[];
  activeSpecialty: string | null;
  onSelect: (specialty: string | null) => void;
}

const MAX_CHIPS = 8;

export default function PopularConcerns({
  therapists,
  activeSpecialty,
  onSelect,
}: PopularConcernsProps) {
  const topConcerns = useMemo(() => {
    const counts = new Map<string, number>();
    therapists.forEach((t) => {
      t.specialties.forEach((s) => counts.set(s, (counts.get(s) ?? 0) + 1));
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_CHIPS)
      .map(([specialty]) => specialty);
  }, [therapists]);

  if (topConcerns.length === 0) return null;

  return (
    <div className="mb-3 flex shrink-0 items-center gap-2 overflow-x-auto pb-1">
      <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Popular
      </span>
      {topConcerns.map((concern) => {
        const active = activeSpecialty === concern;
        return (
          <button
            key={concern}
            type="button"
            onClick={() => onSelect(active ? null : concern)}
            aria-pressed={active}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              active
                ? "bg-[#8B5CF6] text-white"
                : "bg-[#F5F3FF] text-[#6D28D9] hover:bg-[#EDE9FE]"
            }`}
          >
            {concern}
          </button>
        );
      })}
    </div>
  );
}
