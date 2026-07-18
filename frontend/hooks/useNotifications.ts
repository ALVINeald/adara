"use client";

import { useEffect, useRef, useState } from "react";

import { supabase } from "@/lib/supabase";

export interface Notification {
  id: string;
  communityId: string | null;
  messageId: string | null;
  senderId: string | null;
  read: boolean;
  createdAt: string;
}

function mapNotification(row: any): Notification {
  return {
    id: row.id,
    communityId: row.community_id,
    messageId: row.message_id,
    senderId: row.sender_id,
    read: row.read,
    createdAt: row.created_at,
  };
}

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const seenIds = useRef(new Set<string>());

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    let isCancelled = false;

    async function loadInitial() {
      setLoading(true);

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (isCancelled) return;

      const mapped = (data ?? []).map(mapNotification);
      mapped.forEach((n) => seenIds.current.add(n.id));
      setNotifications(mapped);
      setLoading(false);
    }

    loadInitial();

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const incoming = mapNotification(payload.new);
          if (seenIds.current.has(incoming.id)) return;
          seenIds.current.add(incoming.id);
          setNotifications((previous) => [incoming, ...previous]);
        }
      )
      .subscribe();

    return () => {
      isCancelled = true;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  async function markAsRead(notificationId: string) {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    setNotifications((previous) =>
      previous.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  }

  async function markAllAsRead() {
    if (!userId) return;

    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    setNotifications((previous) =>
      previous.map((n) => ({ ...n, read: true }))
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  };
}