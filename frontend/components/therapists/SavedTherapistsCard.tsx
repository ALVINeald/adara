"use client";

import type { Therapist } from "@/hooks/useTherapists";
import type { SavedTherapist } from "@/hooks/useSavedTherapists";

interface SavedTherapistsCardProps {
  saved: SavedTherapist[];
  therapists: Therapist[];
  onSelectTherapist: (therapist: Therapist) => void;
}

export default function SavedTherapistsCard({
  saved,
  therapists,
  onSelectTherapist,
}: SavedTherapistsCardProps) {
  const savedTherapists = saved
    .map((s) => therapists.find((t) => t.id === s.therapistId))
    .filter((t): t is Therapist => !!t);

  if (savedTherapists.length === 0) {
    return (
      <div className="rounded-3xl border border-[#E9E8FF] bg-white p-5">
        <h2 className="font-semibold text-slate-900">Saved Therapists</h2>
        <p className="mt-2 text-sm text-slate-400">
          Tap the bookmark on a profile to save it here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#E9E8FF] bg-white p-5">
      <h2 className="mb-3 font-semibold text-slate-900">Saved Therapists</h2>
      <div className="flex flex-wrap items-center gap-2">
        {savedTherapists.slice(0, 5).map((t) => {
          const initials = t.name
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTherapist(t)}
              title={t.name}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8B5CF6] text-xs font-semibold text-white transition hover:opacity-90"
            >
              {initials}
            </button>
          );
        })}
        {savedTherapists.length > 5 && (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-500">
            +{savedTherapists.length - 5}
          </span>
        )}
      </div>
    </div>
  );
}
