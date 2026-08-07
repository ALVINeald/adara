"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Users } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useCommunities } from "@/hooks/useCommunities";
import JoinedCommunityCard from "@/components/community/JoinedCommunityCard";
import DiscoverCommunityCard from "@/components/community/DiscoverCommunityCard";
import CardCarousel from "@/components/community/CardCarousel";
import BrowseAllCard from "@/components/community/BrowseAllCard";
import MembershipStatusCard from "@/components/community/MembershipStatusCard";
import SuggestedCommunities from "@/components/community/SuggestedCommunities";
import CommunityGuidelinesCard from "@/components/community/CommunityGuidelinesCard";
import NotificationBell from "@/components/notifications/NotificationBell";
import AppShell from "@/components/navigation/AppShell";

export default function CommunitiesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth/login");
    }
  }, [authLoading, user, router]);

  const {
    communities,
    memberships,
    memberCounts,
    loading,
    join,
    maxCommunities,
  } = useCommunities(user?.id);

  const [search, setSearch] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  function jumpToSearch() {
    searchInputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    searchInputRef.current?.focus();
  }

  const memberCommunityIds = new Set(memberships.map((m) => m.communityId));
  const atLimit = memberships.length >= maxCommunities;

  const filtered = useMemo(() => {
    return communities.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [communities, search]);

  const joined = filtered.filter((c) => memberCommunityIds.has(c.id));
  const discover = filtered.filter((c) => !memberCommunityIds.has(c.id));

  async function handleJoin(communityId: string) {
    setJoinError(null);
    setJoiningId(communityId);
    const result = await join(communityId);
    if (result.error) {
      setJoinError(result.error);
    }
    setJoiningId(null);
  }

  if (authLoading || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </main>
    );
  }

  return (
    <AppShell>
    <main className="min-h-screen bg-[linear-gradient(160deg,#f8f6ff_0%,#f3edff_100%)] p-6 md:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              Community
              <Users className="h-6 w-6 text-violet-500" />
            </h1>
            <p className="mt-1 text-slate-500">
              Connect, share, and grow together.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search communities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-40 bg-transparent outline-none placeholder:text-slate-400 md:w-56"
              />
            </div>
            <NotificationBell />
          </div>
        </div>

        {joinError && (
          <div className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {joinError}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

          {/* Main content */}
          <div>

            {/* Joined */}
            <section className="mb-10">
              <div className="mb-1 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                  1
                </span>
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                  Joined Communities ({joined.length})
                </h2>
              </div>
              <p className="mb-4 pl-8 text-sm text-slate-500">
                Communities you&apos;re a part of. Jump into conversations
                anytime.
              </p>

              {joined.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white/60 p-8 text-center">
                  <p className="text-sm text-slate-500">
                    You haven&apos;t joined any communities yet -- pick one
                    from Discover below to get started.
                  </p>
                </div>
              ) : (
                <CardCarousel>
                  {joined.map((community) => (
                    <JoinedCommunityCard
                      key={community.id}
                      community={community}
                      memberCount={memberCounts[community.id] ?? 0}
                    />
                  ))}
                </CardCarousel>
              )}
            </section>

            {/* Discover */}
            <section>
              <div className="mb-1 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                    2
                  </span>
                  <h2 className="text-lg font-bold tracking-tight text-slate-900">
                    Discover Communities
                  </h2>
                </div>
                {!atLimit && (
                  <p className="hidden text-sm text-slate-400 md:block">
                    You can join {maxCommunities - memberships.length} more{" "}
                    {maxCommunities - memberships.length === 1
                      ? "community"
                      : "communities"}
                  </p>
                )}
              </div>
              <p className="mb-4 pl-8 text-sm text-slate-500">
                Explore new spaces and find your people.
              </p>

              {discover.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white/60 p-8 text-center">
                  <p className="text-sm text-slate-500">
                    {search
                      ? "No communities match your search."
                      : "You've joined every available community."}
                  </p>
                </div>
              ) : (
                <CardCarousel>
                  {discover.map((community) => (
                    <DiscoverCommunityCard
                      key={community.id}
                      community={community}
                      memberCount={memberCounts[community.id] ?? 0}
                      atLimit={atLimit}
                      joining={joiningId === community.id}
                      onJoin={() => handleJoin(community.id)}
                    />
                  ))}
                  <BrowseAllCard onClick={jumpToSearch} />
                </CardCarousel>
              )}
            </section>

          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <MembershipStatusCard
              joinedCount={memberships.length}
              maxCommunities={maxCommunities}
            />
            <SuggestedCommunities
              communities={discover}
              memberCounts={memberCounts}
              atLimit={atLimit}
              onJoin={handleJoin}
            />
            <CommunityGuidelinesCard />
          </div>

        </div>
      </div>
    </main>
    </AppShell>
  );
}
