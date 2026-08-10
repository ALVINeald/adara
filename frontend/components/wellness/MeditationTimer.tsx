"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Square } from "lucide-react";

const PROMPT_INTERVAL_SECONDS = 45;

interface MeditationTimerProps {
  durationMinutes: number;
  prompts: string[];
  onComplete: (durationSeconds: number) => void;
}

export default function MeditationTimer({
  durationMinutes,
  prompts,
  onComplete,
}: MeditationTimerProps) {
  const totalSeconds = durationMinutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRunning(false);
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete(totalSeconds);
          }
          return 0;
        }

        const elapsed = totalSeconds - prev + 1;
        if (elapsed % PROMPT_INTERVAL_SECONDS === 0) {
          setPromptIndex((i) => (i + 1) % prompts.length);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, totalSeconds, onComplete, prompts.length]);

  function handleStart() {
    setRemaining(totalSeconds);
    setPromptIndex(0);
    completedRef.current = false;
    setRunning(true);
  }

  function handlePause() {
    setRunning(false);
  }

  function handleResume() {
    setRunning(true);
  }

  function handleStop() {
    setRunning(false);
    setRemaining(totalSeconds);
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const hasStarted = remaining < totalSeconds || running;

  return (
    <div className="flex flex-col items-center">
      <div aria-live="polite" className="sr-only">
        {running ? prompts[promptIndex] : ""}
      </div>

      <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-violet-500/10">
        <div
          className={`absolute h-48 w-48 rounded-full bg-violet-500/20 ${
            running ? "animate-pulse" : ""
          }`}
        />
        <div className="z-10 text-center">
          <p className="text-4xl font-semibold text-violet-800">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </p>
        </div>
      </div>

      {running && (
        <p className="mt-6 max-w-xs text-center text-sm text-slate-600">
          {prompts[promptIndex]}
        </p>
      )}

      <div className="mt-8 flex gap-3">
        {!hasStarted ? (
          <button
            type="button"
            onClick={handleStart}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-700"
          >
            <Play className="h-4 w-4" fill="currentColor" />
            Begin
          </button>
        ) : running ? (
          <>
            <button
              type="button"
              onClick={handlePause}
              className="flex items-center gap-2 rounded-xl bg-slate-200 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-300"
            >
              <Pause className="h-4 w-4" fill="currentColor" />
              Pause
            </button>
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-6 py-3 font-medium text-slate-500 transition hover:bg-slate-200"
            >
              <Square className="h-3.5 w-3.5" fill="currentColor" />
              Stop
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleResume}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-700"
            >
              <Play className="h-4 w-4" fill="currentColor" />
              Resume
            </button>
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-6 py-3 font-medium text-slate-500 transition hover:bg-slate-200"
            >
              <Square className="h-3.5 w-3.5" fill="currentColor" />
              Stop
            </button>
          </>
        )}
      </div>
    </div>
  );
}
