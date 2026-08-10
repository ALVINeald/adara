"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BreathingPhase } from "@/types/wellness";

interface UseBreathingTimerOptions {
  phases: BreathingPhase[];
  totalCycles: number;
  onComplete?: (elapsedSeconds: number) => void;
}

interface UseBreathingTimerResult {
  phaseIndex: number;
  phase: BreathingPhase;
  secondsRemainingInPhase: number;
  cycleIndex: number; // 1-based
  totalCycles: number;
  elapsedSeconds: number;
  running: boolean;
  /** True once started; false before the first start and after reset. */
  hasStarted: boolean;
  /** Text for an aria-live region -- changes exactly when the phase changes. */
  announcement: string;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

/**
 * Drives a breathing exercise: which phase is active, how many seconds
 * remain in it, which cycle we're on, and total elapsed active time
 * (time spent actually running, not wall-clock across a pause).
 *
 * Ticks on a 1s interval rather than requestAnimationFrame -- the
 * visual ring scale animation is driven separately by CSS
 * transitionDuration keyed to the phase length (see
 * BreathingExercise.tsx), so this hook only needs second-granularity
 * for the countdown display and phase transitions, not frame-rate
 * precision.
 */
export function useBreathingTimer({
  phases,
  totalCycles,
  onComplete,
}: UseBreathingTimerOptions): UseBreathingTimerResult {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsRemainingInPhase, setSecondsRemainingInPhase] = useState(
    phases[0]?.seconds ?? 0
  );
  const [cycleIndex, setCycleIndex] = useState(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const phasesRef = useRef(phases);
  phasesRef.current = phases;
  const totalCyclesRef = useRef(totalCycles);
  totalCyclesRef.current = totalCycles;

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      setSecondsRemainingInPhase((prevRemaining) => {
        if (prevRemaining > 1) return prevRemaining - 1;

        // Phase is finishing this tick -- advance phase/cycle.
        const currentPhases = phasesRef.current;
        const isLastPhaseInCycle = phaseIndex === currentPhases.length - 1;

        if (isLastPhaseInCycle) {
          if (cycleIndex >= totalCyclesRef.current) {
            setRunning(false);
            // Deferred so onComplete sees the final elapsedSeconds tick.
            setTimeout(() => {
              setElapsedSeconds((finalElapsed) => {
                onCompleteRef.current?.(finalElapsed);
                return finalElapsed;
              });
            }, 0);
            return 0;
          }
          setCycleIndex((c) => c + 1);
          setPhaseIndex(0);
          return currentPhases[0]?.seconds ?? 0;
        }

        setPhaseIndex((i) => i + 1);
        return currentPhases[phaseIndex + 1]?.seconds ?? 0;
      });
    }, 1000);

    return () => clearInterval(interval);
    // phaseIndex/cycleIndex intentionally included so the closure
    // over currentPhases[phaseIndex + 1] stays correct each tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phaseIndex, cycleIndex]);

  const start = useCallback(() => {
    setPhaseIndex(0);
    setSecondsRemainingInPhase(phasesRef.current[0]?.seconds ?? 0);
    setCycleIndex(1);
    setElapsedSeconds(0);
    setHasStarted(true);
    setRunning(true);
  }, []);

  const pause = useCallback(() => setRunning(false), []);
  const resume = useCallback(() => setRunning(true), []);

  const reset = useCallback(() => {
    setRunning(false);
    setHasStarted(false);
    setPhaseIndex(0);
    setSecondsRemainingInPhase(phasesRef.current[0]?.seconds ?? 0);
    setCycleIndex(1);
    setElapsedSeconds(0);
  }, []);

  const phase = phases[phaseIndex] ?? phases[0];
  const announcement = hasStarted
    ? `${phase.label}. Cycle ${cycleIndex} of ${totalCycles}.`
    : "";

  return {
    phaseIndex,
    phase,
    secondsRemainingInPhase,
    cycleIndex,
    totalCycles,
    elapsedSeconds,
    running,
    hasStarted,
    announcement,
    start,
    pause,
    resume,
    reset,
  };
}
