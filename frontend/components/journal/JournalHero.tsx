"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";

interface JournalHeroProps {
  onNewEntry: () => void;
}

export default function JournalHero({ onNewEntry }: JournalHeroProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative mb-3 shrink-0 overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-violet-50 to-white p-5">
      <div className="flex items-center gap-4">
        <motion.div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-violet-600 text-white"
          animate={
            prefersReducedMotion
              ? undefined
              : { scale: [1, 1.06, 1], opacity: [0.95, 1, 0.95] }
          }
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="h-6 w-6" />
        </motion.div>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
            What&apos;s on your mind?
          </h2>
          <p className="truncate text-sm text-slate-500">
            Write a thought, reflection, or something you&apos;re grateful for...
          </p>
        </div>

        <button
          type="button"
          onClick={onNewEntry}
          className="flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl bg-violet-600 px-4 text-sm font-medium text-white transition hover:bg-violet-700"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New reflection</span>
        </button>
      </div>
    </div>
  );
}
