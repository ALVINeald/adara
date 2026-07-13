"use client";

import { Check } from "lucide-react";

import { feelings } from "./data";
import type { StepProps } from "./types";

export default function FeelingStep({
  data,
  updateData,
}: StepProps) {
  return (
    <div className="animate-fadeIn">

      <div className="mb-10 text-center">

        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          How are you feeling today?
        </h1>

        <p className="mt-4 text-lg leading-8 text-slate-600">
          Choose the option that best describes how you're feeling.
          There are no right or wrong answers.
        </p>

      </div>

      <div className="grid gap-4">

        {feelings.map((feeling) => {
          const selected = data.feeling === feeling.id;

          return (
            <button
              key={feeling.id}
              type="button"
              onClick={() =>
                updateData({
                  feeling: feeling.id,
                })
              }
              className={`flex items-center justify-between rounded-2xl border p-5 text-left transition-all duration-300 ${
                selected
                  ? "border-cyan-500 bg-cyan-50 shadow-md"
                  : "border-slate-200 bg-white hover:border-cyan-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-4">

                <div className="text-3xl">
                  {feeling.emoji}
                </div>

                <div>

                  <h3 className="text-lg font-semibold text-slate-900">
                    {feeling.title}
                  </h3>

                </div>

              </div>

              {selected && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600">
                  <Check className="h-5 w-5 text-white" />
                </div>
              )}

            </button>
          );
        })}

      </div>

    </div>
  );
}