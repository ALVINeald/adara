"use client";

import { User } from "lucide-react";

import { Input } from "@/components/ui/input";

import type { StepProps } from "./types";

export default function NameStep({
  data,
  updateData,
}: StepProps) {
  return (
    <div className="flex min-h-[420px] flex-col justify-center animate-fadeIn">

      {/* Heading */}

      <div className="mb-10 text-center">

        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-100">
          <User className="h-10 w-10 text-cyan-700" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          What should we call you?
        </h1>

        <p className="mt-4 text-lg leading-8 text-slate-600">
          We'd love to know your preferred name.
          <br />
          This helps make your experience feel a little more personal.
        </p>

      </div>

      {/* Input */}

      <div className="mx-auto w-full max-w-lg">

        <Input
          value={data.name}
          onChange={(e) =>
            updateData({
              name: e.target.value,
            })
          }
          placeholder="Enter your name"
          className="h-14 rounded-2xl border-slate-200 px-6 text-lg shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
        />

        <p className="mt-4 text-center text-sm text-slate-500">
          You can always change this later.
        </p>

      </div>

    </div>
  );
}