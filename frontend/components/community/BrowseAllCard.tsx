"use client";

import { Compass } from "lucide-react";

interface BrowseAllCardProps {
  onClick: () => void;
}

export default function BrowseAllCard({ onClick }: BrowseAllCardProps) {
  return (
    <button
      data-carousel-card
      onClick={onClick}
      className="flex w-[260px] shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-violet-200 bg-violet-50/50 p-5 text-center transition hover:border-violet-300 hover:bg-violet-50"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
        <Compass className="h-6 w-6 text-violet-500" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">
          Search Communities
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Jump back to search
        </p>
      </div>
    </button>
  );
}
