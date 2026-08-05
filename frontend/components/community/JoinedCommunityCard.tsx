"use client";

import { useRouter } from "next/navigation";
import { MessageCircle, Users } from "lucide-react";

import type { Community } from "@/hooks/useCommunities";
import { getCommunityCoverGradient } from "./communityCover";

interface JoinedCommunityCardProps {
  community: Community;
  memberCount: number;
}

export default function JoinedCommunityCard({
  community,
  memberCount,
}: JoinedCommunityCardProps) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md">

      <div
        className={`relative h-32 bg-gradient-to-br ${getCommunityCoverGradient(
          community.category
        )}`}
      >
        <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <Users className="h-3 w-3" />
          {memberCount}
        </span>
      </div>

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
          {community.category}
        </p>

        <h3 className="mt-1 text-base font-bold text-slate-900">
          {community.name}
        </h3>

        <p className="mt-1.5 text-sm leading-6 text-slate-500">
          {community.description}
        </p>

        <button
          onClick={() => router.push(`/communities/${community.id}`)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          <MessageCircle className="h-4 w-4" />
          Open Chat
        </button>
      </div>

    </div>
  );
}
