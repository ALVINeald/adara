"use client";

import { useEffect } from "react";
import { Users, Check } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useCommunities } from "@/hooks/useCommunities";
import type { StepProps } from "./types";

export default function CommunityStep({ data, updateData }: StepProps) {
  const { user } = useAuth();
  const { communities, memberships, loading, join, leave, maxCommunities } =
    useCommunities(user?.id);

  const memberCommunityIds = new Set(memberships.map((m) => m.communityId));

  useEffect(() => {
    updateData({ communityJoined: memberships.length > 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberships.length]);

  async function handleToggle(communityId: string) {
    if (memberCommunityIds.has(communityId)) {
      await leave(communityId);
    } else {
      await join(communityId);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <p className="text-slate-500">Loading communities...</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-100">
          <Users className="h-10 w-10 text-cyan-700" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Choose your communities
        </h1>

        <p className="mt-4 text-lg leading-8 text-slate-600">
          You'll meet people who understand similar experiences. Choose up
          to {maxCommunities} — you can change these anytime later.
        </p>

        <p className="mt-2 text-sm font-medium text-cyan-700">
          {memberships.length}/{maxCommunities} selected
        </p>
      </div>

      <div className="grid gap-4">
        {communities.map((community) => {
          const selected = memberCommunityIds.has(community.id);
          const disabled =
            !selected && memberships.length >= maxCommunities;

          return (
            <button
              key={community.id}
              type="button"
              disabled={disabled}
              onClick={() => handleToggle(community.id)}
              className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
                selected
                  ? "border-cyan-500 bg-cyan-50 shadow-md"
                  : disabled
                  ? "cursor-not-allowed border-slate-100 bg-slate-50 opacity-50"
                  : "border-slate-200 bg-white hover:border-cyan-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-cyan-600">
                    {community.category}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">
                    {community.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {community.description}
                  </p>
                </div>

                {selected && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-600">
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