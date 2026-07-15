import { useEffect, useState } from "react";

import type { Conversation } from "@/components/chat/types";

import {
  createConversation,
  deleteConversation,
  getConversations,
  renameConversation,
} from "@/lib/conversations";

export function useConversations(userId?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setConversations([]);
      setLoading(false);
      return;
    }

    loadConversations();
  }, [userId]);

  async function loadConversations() {
    if (!userId) return;

    setLoading(true);

    try {
      const { data } = await getConversations(userId);

      setConversations(
        (data ?? []).map((conversation: any) => ({
          id: conversation.id,
          title: conversation.title,
          updatedAt: conversation.updated_at,
        }))
      );
    } finally {
      setLoading(false);
    }
  }

  async function addConversation() {
    if (!userId) return null;

    const { data } = await createConversation(userId);

    await loadConversations();

    return data;
  }

  async function updateConversation(
    id: string,
    title: string
  ) {
    await renameConversation(id, title);

    await loadConversations();
  }

  async function removeConversation(id: string) {
    await deleteConversation(id);

    setConversations((previous) =>
      previous.filter((conversation) => conversation.id !== id)
    );
  }

  return {
    conversations,
    loading,
    loadConversations,
    addConversation,
    updateConversation,
    removeConversation,
  };
}