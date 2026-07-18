"use client";

import { useRouter } from "next/navigation";
import { MessageCircle, LogOut } from "lucide-react";

import type { Community } from "@/hooks/useCommunities";

interface CommunityCardProps {
  community: Community;
  isMember: boolean;
  canJoin: boolean;
  onJoin: () => void;
  onLeave: () => void;
}

export default function CommunityCard({
  community,
  isMember,
  canJoin,
  onJoin,
  onLeave,
}: CommunityCardProps) {
  const router = useRouter();

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-cyan-600">
        {community.category}
      </p>
      <h3 className="mt-1 font-semibold text-slate-900">{community.name}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {community.description}
      </p>

      <div className="mt-4 flex gap-2">
        {isMember ? (
          <>
            <button
              onClick={() => router.push(`/communities/${community.id}`)}
              className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-700"
            >
              <MessageCircle className="h-4 w-4" />
              Open Chat
            </button>
            <button
              onClick={onLeave}
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
            >
              <LogOut className="h-4 w-4" />
              Leave
            </button>
          </>
        ) : (
          <button
            onClick={onJoin}
            disabled={!canJoin}
            className="rounded-xl bg-cyan-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Join Community
          </button>
        )}
      </div>
    </div>
  );
}