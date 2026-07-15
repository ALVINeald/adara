import { useEffect, useState } from "react";

import type { ChatMessage } from "@/components/chat/types";

import {
  createMessage,
  getMessages,
} from "@/lib/messages";

export function useMessages(conversationId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    loadMessages();
  }, [conversationId]);

  async function loadMessages() {
    if (!conversationId) return;

    setLoading(true);

    try {
      const { data } = await getMessages(conversationId);

      setMessages(
        (data ?? []).map((message: any) => ({
          id: message.id,
          conversationId: message.conversation_id,
          sender: message.sender,
          content: message.content,
          timestamp: new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }))
      );
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(
    sender: "user" | "assistant",
    content: string
  ) {
    if (!conversationId) return;

    await createMessage(
      conversationId,
      sender,
      content
    );

    await loadMessages();
  }

  return {
    messages,
    loading,
    sendMessage,
    loadMessages,
  };
}