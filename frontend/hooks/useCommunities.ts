"use client";

import { useEffect, useRef, useState } from "react";

import {
  getCommunities,
  getMemberships,
  joinCommunity,
  leaveCommunity,
} from "@/lib/communities";

export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface Membership {
  id: string;
  communityId: string;
  joinedAt: string;
}

const MAX_COMMUNITIES = 3;

function mapCommunities(data: any[]): Community[] {
  return (data ?? []).map((c: any) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    category: c.category,
  }));
}

function mapMemberships(data: any[]): Membership[] {
  return (data ?? []).map((m: any) => ({
    id: m.id,
    communityId: m.community_id,
    joinedAt: m.joined_at,
  }));
}

export function useCommunities(userId?: string) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    load();
  }, [userId]);

  async function load() {
    if (!hasLoadedOnce.current) {
      setLoading(true);
    }

    try {
      const { data: communityData } = await getCommunities();
      setCommunities(mapCommunities(communityData ?? []));

      if (userId) {
        const { data: membershipData } = await getMemberships(userId);
        setMemberships(mapMemberships(membershipData ?? []));
      }
    } finally {
      setLoading(false);
      hasLoadedOnce.current = true;
    }
  }

  async function join(communityId: string): Promise<{ error?: string }> {
    if (!userId) return { error: "Not signed in." };

    if (memberships.length >= MAX_COMMUNITIES) {
      return { error: `You can only join up to ${MAX_COMMUNITIES} communities.` };
    }

    await joinCommunity(userId, communityId);
    await load();
    return {};
  }

  async function leave(communityId: string) {
    if (!userId) return;
    await leaveCommunity(userId, communityId);
    await load();
  }

  return {
    communities,
    memberships,
    loading,
    join,
    leave,
    maxCommunities: MAX_COMMUNITIES,
  };
}