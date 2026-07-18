"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useCommunities } from "@/hooks/useCommunities";
import CommunityCard from "@/components/community/CommunityCard";

export default function CommunitiesPage() {
  const { user, loading: authLoading } = useAuth();
  const { communities, memberships, loading, join, leave, maxCommunities } =
    useCommunities(user?.id);

  const [search, setSearch] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);

  const memberCommunityIds = new Set(memberships.map((m) => m.communityId));

  const filtered = useMemo(() => {
    return communities.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [communities, search]);

  async function handleJoin(communityId: string) {
    setJoinError(null);
    const result = await join(communityId);
    if (result.error) {
      setJoinError(result.error);
    }
  }

  if (authLoading || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)] p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">
          Communities
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          Join up to {maxCommunities} communities of people who understand
          what you're going through. ({memberships.length}/{maxCommunities}{" "}
          joined)
        </p>

        {joinError && (
          <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {joinError}
          </div>
        )}

        <div className="mb-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search communities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              isMember={memberCommunityIds.has(community.id)}
              canJoin={memberships.length < maxCommunities}
              onJoin={() => handleJoin(community.id)}
              onLeave={() => leave(community.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}