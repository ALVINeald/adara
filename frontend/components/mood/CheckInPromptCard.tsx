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

  if (dismissed) {
    return null;
  }

  return (
    <section className="mb-5 w-full min-w-0 overflow-hidden rounded-[24px] bg-gradient-to-br from-violet-50 via-violet-50 to-purple-50 p-5 sm:mb-6 sm:rounded-[32px] sm:p-8 md:grid md:grid-cols-[1fr_auto] md:items-center">
      {/* TEXT CONTENT */}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-violet-700">
          Check-in
        </p>

        <h2 className="mt-2 text-[22px] font-bold leading-tight text-slate-900 sm:text-2xl md:text-3xl">
          How are you, really?
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
          Take a moment to check in with yourself. I&apos;m here
          to listen, always.
        </p>

        {/* ACTIONS */}
        <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6 sm:gap-5">
          <button
            type="button"
            onClick={onOpenCompanion}
            className="min-h-11 rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2"
          >
            Let&apos;s Talk
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="flex min-h-11 items-center gap-1 px-1 text-sm font-medium text-slate-500 transition hover:text-slate-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-violet-200 focus:ring-offset-2"
          >
            Not now
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* MASCOT
          Hidden on phones so the text and actions have
          the full width of the screen. */}
      <div className="hidden shrink-0 items-center justify-center md:flex">
        <GhostMascot />
      </div>
    </section>
  );
}