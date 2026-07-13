"use client";

import { Bot, HeartHandshake, Sparkles } from "lucide-react";

import type { StepProps } from "./types";

export default function CompanionStep({
  data,
}: StepProps) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center text-center animate-fadeIn">

      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-cyan-100 shadow-lg">
        <Bot className="h-12 w-12 text-cyan-700" />
      </div>

      <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700">
        <Sparkles className="h-4 w-4" />
        Meet your AI Companion
      </div>

      <h1 className="max-w-xl text-4xl font-bold tracking-tight text-slate-900">
        You're never alone.
      </h1>

      <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
        Hi <span className="font-semibold text-cyan-700">{data.name || "there"}</span>,
        I'm your AI Companion.
      </p>

      <p className="mt-4 max-w-lg leading-8 text-slate-600">
        I'm here to listen, encourage you, and help you reflect whenever you
        need someone to talk to. You decide when and how we interact.
      </p>

      <div className="mt-10 rounded-2xl bg-cyan-50 p-6">

        <div className="flex items-center justify-center gap-3">

          <HeartHandshake className="h-6 w-6 text-cyan-700" />

          <p className="font-medium text-cyan-800">
            Compassion. Privacy. Hope.
          </p>

        </div>

      </div>

    </div>
  );
}