"use client";

import { Check, Users } from "lucide-react";

import type { Community } from "@/hooks/useCommunities";
import { getCommunityCoverGradient } from "./communityCover";

interface DiscoverCommunityCardProps {
  community: Community;
  memberCount: number;
  atLimit: boolean;
  onJoin: () => void;
  joining: boolean;
}

export default function DiscoverCommunityCard({
  community,
  memberCount,
  atLimit,
  onJoin,
  joining,
}: DiscoverCommunityCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md">

      <div
        className={`relative h-28 bg-gradient-to-br ${getCommunityCoverGradient(
          community.category
        )}`}
      >
        <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <Users className="h-3 w-3" />
          {memberCount}
        </span>
      </div>

      <div className="p-5">
        <span className="inline-block rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
          {community.category}
        </span>

        <h3 className="mt-2 text-base font-bold text-slate-900">
          {community.name}
        </h3>

        <p className="mt-1.5 text-sm leading-6 text-slate-500">
          {community.description}
        </p>

        <button
          onClick={onJoin}
          disabled={joining || atLimit}
          title={
            atLimit
              ? "You've reached the 3-community limit -- leave one to join another"
              : undefined
          }
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-violet-600 py-2 text-sm font-semibold text-violet-600 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-transparent"
        >
          {joining ? (
            "Joining..."
          ) : atLimit ? (
            "Limit reached"
          ) : (
            <>
              <Check className="h-4 w-4" />
              Join
            </>
          )}
        </button>
      </div>

    </div>
  );
}
