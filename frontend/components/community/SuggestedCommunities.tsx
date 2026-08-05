"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Community } from "@/hooks/useCommunities";
import { getCommunityCoverGradient } from "./communityCover";

interface SuggestedCommunitiesProps {
  communities: Community[];
  memberCounts: Record<string, number>;
  atLimit: boolean;
  onJoin: (communityId: string) => void;
}

// Not an actual recommendation engine -- there's no personalization
// logic anywhere in the app. This just surfaces the first few
// not-yet-joined communities, labeled honestly below rather than as
// a claim of tailored suggestions.
export default function SuggestedCommunities({
  communities,
  memberCounts,
  atLimit,
  onJoin,
}: SuggestedCommunitiesProps) {
  const router = useRouter();
  const suggestions = communities.slice(0, 3);

  if (suggestions.length === 0) return null;

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">

      <h3 className="text-sm font-semibold text-slate-900">
        More to Explore
      </h3>

      <div className="mt-4 flex flex-col gap-3">
        {suggestions.map((community) => (
          <div key={community.id} className="flex items-center gap-3">
            <div
              className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${getCommunityCoverGradient(
                community.category
              )}`}
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">
                {community.name}
              </p>
              <p className="text-xs text-slate-400">
                {memberCounts[community.id] ?? 0} members
              </p>
            </div>

            <button
              onClick={() => onJoin(community.id)}
              disabled={atLimit}
              title={atLimit ? "You've reached the 3-community limit" : "Join"}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-violet-300 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/communities")}
        className="mt-4 text-sm font-medium text-violet-600 hover:text-violet-700"
      >
        View more suggestions →
      </button>

    </div>
  );
}
