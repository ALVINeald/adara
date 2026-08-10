"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Bell, Minus, Pause, Play, Plus, RotateCcw } from "lucide-react";

import { useBreathingTimer } from "@/hooks/useBreathingTimer";
import type { BreathingPattern, BreathingPhase } from "@/types/wellness";

interface BreathingExerciseProps {
  pattern: BreathingPattern;
  initialCycles?: number;
  initialCustomPhases?: BreathingPhase[] | null;
  onComplete: (durationSeconds: number) => void;
  onPreferenceChange?: (cycles: number, customPhases: BreathingPhase[] | null) => void;
}

const CYCLE_OPTIONS = [2, 4, 6, 8];
const MIN_PHASE_SECONDS = 2;
const MAX_PHASE_SECONDS = 15;

export default function BreathingExercise({
  pattern,
  initialCycles = 4,
  initialCustomPhases = null,
  onComplete,
  onPreferenceChange,
}: BreathingExerciseProps) {
  const prefersReducedMotion = useReducedMotion();

  const [cycles, setCycles] = useState(initialCycles);
  const [customPhases, setCustomPhases] = useState<BreathingPhase[] | null>(
    initialCustomPhases &&
      initialCustomPhases.length === pattern.phases.length
      ? initialCustomPhases
      : null
  );
  const [paceOpen, setPaceOpen] = useState(false);
  const [cueEnabled, setCueEnabled] = useState(false);

  const activePhases = customPhases ?? pattern.phases;

  const timer = useBreathingTimer({
    phases: activePhases,
    totalCycles: cycles,
    onComplete,
  });

  useEffect(() => {
    if (!timer.hasStarted) {
      setCustomPhases(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern.id]);

  function adjustPhaseSeconds(phaseIdx: number, delta: number) {
    const base = customPhases ?? pattern.phases;
    const next = base.map((phase, i) =>
      i === phaseIdx
        ? {
            ...phase,
            seconds: Math.min(
              MAX_PHASE_SECONDS,
              Math.max(MIN_PHASE_SECONDS, phase.seconds + delta)
            ),
          }
        : phase
    );
    setCustomPhases(next);
    onPreferenceChange?.(cycles, next);
  }

  function handleCyclesChange(next: number) {
    setCycles(next);
    onPreferenceChange?.(next, customPhases);
  }

  const ringScale = timer.hasStarted && timer.running ? timer.phase.scale : 1;
  const transitionDuration = prefersReducedMotion ? 0.15 : timer.phase.seconds;

  return (
    <div className="flex flex-col items-center">
      <div aria-live="polite" className="sr-only">
        {timer.announcement}
      </div>

      <div className="relative flex h-64 w-64 items-center justify-center">
        <motion.div
          className="absolute h-40 w-40 rounded-full bg-violet-500/15"
          animate={{ scale: ringScale }}
          transition={{ duration: transitionDuration, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute h-28 w-28 rounded-full bg-violet-500/30"
          animate={{ scale: ringScale }}
          transition={{ duration: transitionDuration, ease: "easeInOut" }}
        />
        <div className="z-10 text-center">
          <p className="text-lg font-semibold text-violet-800">
            {timer.hasStarted ? timer.phase.label : "Ready?"}
          </p>
          {timer.hasStarted && (
            <>
              <p className="mt-1 text-3xl font-bold text-violet-900">
                {timer.secondsRemainingInPhase}
              </p>
              <p className="mt-1 text-xs text-violet-600">
                Cycle {timer.cycleIndex} of {timer.totalCycles}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        {!timer.hasStarted ? (
          <button
            type="button"
            onClick={timer.start}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-700"
          >
            <Play className="h-4 w-4" fill="currentColor" />
            Begin
          </button>
        ) : (
          <>
            {timer.running ? (
              <button
                type="button"
                onClick={timer.pause}
                aria-label="Pause"
                className="flex items-center gap-2 rounded-xl bg-slate-200 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-300"
              >
                <Pause className="h-4 w-4" fill="currentColor" />
                Pause
              </button>
            ) : (
              <button
                type="button"
                onClick={timer.resume}
                aria-label="Resume"
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-700"
              >
                <Play className="h-4 w-4" fill="currentColor" />
                Resume
              </button>
            )}
            <button
              type="button"
              onClick={timer.reset}
              aria-label="Reset"
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 font-medium text-slate-500 transition hover:bg-slate-200"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {!timer.hasStarted && (
        <div className="mt-8 w-full max-w-sm space-y-4">
          <div>
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
              Session length
            </p>
            <div className="flex justify-center gap-2">
              {CYCLE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleCyclesChange(option)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    cycles === option
                      ? "bg-violet-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {option} cycles
                </button>
              ))}
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setPaceOpen((open) => !open)}
              className="mx-auto block text-xs font-medium text-violet-600 hover:text-violet-700"
            >
              {paceOpen ? "Hide pace customization" : "Customize pace"}
            </button>

            {paceOpen && (
              <div className="mt-3 space-y-2 rounded-xl bg-slate-50 p-3">
                {activePhases.map((phase, i) => (
                  <div
                    key={`${phase.label}-${i}`}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-sm text-slate-600">{phase.label}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Decrease ${phase.label} duration`}
                        onClick={() => adjustPhaseSeconds(i, -1)}
                        className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm hover:bg-slate-100"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium text-slate-700">
                        {phase.seconds}s
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase ${phase.label} duration`}
                        onClick={() => adjustPhaseSeconds(i, 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm hover:bg-slate-100"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            disabled
            title="Sound and haptic cues -- coming soon"
            onClick={() => setCueEnabled((v) => !v)}
            className="mx-auto flex cursor-not-allowed items-center gap-1.5 text-xs text-slate-300"
          >
            <Bell className="h-3 w-3" />
            Sound &amp; haptic cues (coming soon)
          </button>
        </div>
      )}
    </div>
  );
}
