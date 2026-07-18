"use client";

import { useEffect, useRef, useState } from "react";

import { supabase } from "@/lib/supabase";

export interface CommunityMessage {
  id: string;
  communityId: string;
  userId: string;
  content: string;
  createdAt: string;
}

function mapMessage(row: any): CommunityMessage {
  return {
    id: row.id,
    communityId: row.community_id,
    userId: row.user_id,
    content: row.content,
    createdAt: row.created_at,
  };
}

export function useCommunityMessages(communityId?: string) {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const seenIds = useRef(new Set<string>());

  useEffect(() => {
    if (!communityId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    let isCancelled = false;
    seenIds.current = new Set();

    async function loadInitialMessages() {
      setLoading(true);

      const { data } = await supabase
        .from("community_messages")
        .select("*")
        .eq("community_id", communityId)
        .order("created_at", { ascending: true })
        .limit(200);

      if (isCancelled) return;

      const mapped = (data ?? []).map(mapMessage);
      mapped.forEach((m) => seenIds.current.add(m.id));
      setMessages(mapped);
      setLoading(false);
    }

    loadInitialMessages();

    // Real-time: new messages posted by anyone in this community push
    // straight into the list, no refresh needed.
    const channel = supabase
      .channel(`community-messages-${communityId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "community_messages",
          filter: `community_id=eq.${communityId}`,
        },
        (payload) => {
          const incoming = mapMessage(payload.new);

          // Avoid duplicates: the sender's own optimistic/local add (if
          // any) plus this real-time event could otherwise double up.
          if (seenIds.current.has(incoming.id)) return;
          seenIds.current.add(incoming.id);

          setMessages((previous) => [...previous, incoming]);
        }
      )
      .subscribe();

    return () => {
      isCancelled = true;
      supabase.removeChannel(channel);
    };
  }, [communityId]);

  async function sendMessage(userId: string, content: string) {
    if (!communityId || !content.trim()) return;

    await supabase.from("community_messages").insert({
      community_id: communityId,
      user_id: userId,
      content: content.trim(),
    });
    // No local state update here -- the real-time subscription above
    // will receive this same insert and add it to the list. Adding it
    // twice (once here, once via the subscription) would duplicate it.
  }

  return { messages, loading, sendMessage };
}