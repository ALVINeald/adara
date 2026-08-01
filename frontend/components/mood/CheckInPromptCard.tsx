"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

import GhostMascot from "./GhostMascot";

interface CheckInPromptCardProps {
  onOpenCompanion: () => void;
}

export default function CheckInPromptCard({
  onOpenCompanion,
}: CheckInPromptCardProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mb-6 grid gap-8 rounded-[32px] bg-gradient-to-br from-violet-50 via-violet-50 to-purple-50 p-8 md:grid-cols-[1fr_auto] md:items-center">

      <div>
        <p className="text-sm font-semibold text-violet-700">Check-in</p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
          How are you, really?
        </h2>

        <p className="mt-2 max-w-md text-slate-600">
          Take a moment to check in with yourself. I&apos;m here to listen,
          always.
        </p>

        <div className="mt-6 flex items-center gap-5">
          <button
            onClick={onOpenCompanion}
            className="rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Let&apos;s Talk
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-slate-700"
          >
            Not now
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Custom-built illustration -- not the mockup's exact bespoke
          asset, but an actual character now instead of a generic icon. */}
      <div className="hidden shrink-0 items-center justify-center md:flex">
        <GhostMascot />
      </div>

    </div>
  );
}
