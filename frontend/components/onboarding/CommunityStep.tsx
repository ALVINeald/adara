"use client";

import { Users, Check } from "lucide-react";

import { communities } from "./data";
import type { StepProps } from "./types";

export default function CommunityStep({
  data,
  updateData,
}: StepProps) {
  return (
    <div className="animate-fadeIn">

      <div className="mb-10 text-center">

        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-100">
          <Users className="h-10 w-10 text-cyan-700" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Choose your first community
        </h1>

        <p className="mt-4 text-lg leading-8 text-slate-600">
          You'll meet people who understand similar experiences.
          You can join more communities later.
        </p>

      </div>

      <div className="grid gap-4">

        {communities.map((community) => {
          const selected = data.community === community.id;

          return (
            <button
              key={community.id}
              type="button"
              onClick={() =>
                updateData({
                  community: community.id,
                })
              }
              className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
                selected
                  ? "border-cyan-500 bg-cyan-50 shadow-md"
                  : "border-slate-200 bg-white hover:border-cyan-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between">

                <div>

                  <h3 className="text-lg font-semibold text-slate-900">
                    {community.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {community.description}
                  </p>

                </div>

                {selected && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                )}

              </div>

            </button>
          );
        })}

      </div>

    </div>
  );
}