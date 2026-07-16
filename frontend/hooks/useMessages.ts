"use client";

import { useEffect, useRef, useState } from "react";

import type { ChatMessage } from "@/components/chat/types";

import { createMessage, getMessages } from "@/lib/messages";

function mapMessages(data: any[]): ChatMessage[] {
  return (data ?? []).map((message: any) => ({
    id: message.id,
    conversationId: message.conversation_id,
    sender: message.sender,
    content: message.content,
    timestamp: new Date(message.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));
}

export function useMessages(conversationId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const loadedConversationId = useRef<string | null>(null);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    // Only show a loading state when switching into a conversation
    // we haven't loaded yet this session — not on every refetch.
    if (loadedConversationId.current !== conversationId) {
      setLoading(true);
    }

    loadMessages();
  }, [conversationId]);

  async function loadMessages() {
    if (!conversationId) return;

    try {
      const { data } = await getMessages(conversationId);
      setMessages(mapMessages(data ?? []));
    } finally {
      setLoading(false);
      loadedConversationId.current = conversationId;
    }
  }

  async function sendMessage(sender: "user" | "assistant", content: string) {
    if (!conversationId) return;

    await createMessage(conversationId, sender, content);

    // Quiet background refresh — does NOT touch `loading`,
    // so the UI doesn't flash after every message sent.
    const { data } = await getMessages(conversationId);
    setMessages(mapMessages(data ?? []));
  }

  return {
    messages,
    loading,
    sendMessage,
    loadMessages,
  };
}