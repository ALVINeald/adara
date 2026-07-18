"use client";

import { useEffect, useRef, useState } from "react";

export interface BreathingPhase {
  label: string;
  seconds: number;
  scale: number;
}

export interface BreathingPattern {
  name: string;
  description: string;
  phases: BreathingPhase[];
}

interface BreathingExerciseProps {
  pattern: BreathingPattern;
  cycles?: number;
  onComplete: (durationSeconds: number) => void;
}

export default function BreathingExercise({
  pattern,
  cycles = 4,
  onComplete,
}: BreathingExerciseProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(1);
  const [running, setRunning] = useState(false);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (!running) return;

    const currentPhase = pattern.phases[phaseIndex];
    const timer = setTimeout(() => {
      elapsedRef.current += currentPhase.seconds;

      const isLastPhaseInCycle = phaseIndex === pattern.phases.length - 1;

      if (isLastPhaseInCycle) {
        if (cycleCount >= cycles) {
          setRunning(false);
          onComplete(elapsedRef.current);
          return;
        }
        setCycleCount((c) => c + 1);
        setPhaseIndex(0);
      } else {
        setPhaseIndex((i) => i + 1);
      }
    }, currentPhase.seconds * 1000);

    return () => clearTimeout(timer);
  }, [running, phaseIndex, cycleCount, pattern, cycles, onComplete]);

  const currentPhase = pattern.phases[phaseIndex];

  function handleStart() {
    elapsedRef.current = 0;
    setPhaseIndex(0);
    setCycleCount(1);
    setRunning(true);
  }

  function handleStop() {
    setRunning(false);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-64 w-64 items-center justify-center">
        <div
          className="absolute h-40 w-40 rounded-full bg-cyan-500/20 transition-transform ease-in-out"
          style={{
            transform: `scale(${running ? currentPhase.scale : 1})`,
            transitionDuration: `${currentPhase.seconds}s`,
          }}
        />
        <div
          className="absolute h-28 w-28 rounded-full bg-cyan-500/40 transition-transform ease-in-out"
          style={{
            transform: `scale(${running ? currentPhase.scale : 1})`,
            transitionDuration: `${currentPhase.seconds}s`,
          }}
        />
        <div className="z-10 text-center">
          <p className="text-lg font-semibold text-cyan-800">
            {running ? currentPhase.label : "Ready?"}
          </p>
          {running && (
            <p className="mt-1 text-xs text-cyan-600">
              Cycle {cycleCount} of {cycles}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        {!running ? (
          <button
            type="button"
            onClick={handleStart}
            className="rounded-xl bg-cyan-600 px-6 py-3 font-medium text-white transition hover:bg-cyan-700"
          >
            Begin
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStop}
            className="rounded-xl bg-slate-200 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-300"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}