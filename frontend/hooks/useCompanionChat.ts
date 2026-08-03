"use client";

import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { getProfileNamesByIds } from "@/lib/profiles";

import type { AIMessage } from "@/lib/ai/types";

const HISTORY_LIMIT = 20;

// Extracted from ChatLayout.tsx so both the full /chat page and the
// Companion slide-over (opened from other pages, like the Mood
// check-in card) can share the same real streaming/regenerate/stop
// logic instead of duplicating it. ChatLayout.tsx itself was left as
// its own inline copy rather than refactored to use this hook --
// that refactor is real cleanup worth doing, but doing it blind
// (without being able to run the app to verify nothing broke) was a
// risk not worth taking on the one page that's actually shipped and
// working today.
export function useCompanionChat() {
  const { user, loading: authLoading } = useAuth();

  const {
    conversations,
    loading: conversationsLoading,
    addConversation,
    updateConversation,
  } = useConversations(user?.id);

  const [activeConversationId, setActiveConversationId] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    getProfileNamesByIds([user.id]).then(({ data }) => {
      const fullName = data?.[0]?.full_name;
      if (fullName) {
        setUserName(fullName);
      }
    });
  }, [user?.id]);

  const { messages, sendMessage: saveMessage } = useMessages(
    activeConversationId
  );

  const [isTyping, setIsTyping] = useState(false);
  const [streamingReply, setStreamingReply] = useState<string | null>(null);
  const [sendError, setSendError] = useState<{
    text: string;
    timedOut?: boolean;
  } | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const wasStoppedByUserRef = useRef(false);
  const hasAutoCreatedRef = useRef(false);

  useEffect(() => {
    if (conversationsLoading) return;

    if (conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
      return;
    }

    // Brand-new user with zero conversations: the full /chat page
    // handles this via its sidebar's "new conversation" button, but
    // the compact slide-over doesn't have that UI, so create one
    // automatically the first time this runs. Guarded by a ref so it
    // only ever fires once per mount, not on every re-render.
    if (
      conversations.length === 0 &&
      !hasAutoCreatedRef.current
    ) {
      hasAutoCreatedRef.current = true;
      addConversation().then((conversation) => {
        if (conversation) {
          setActiveConversationId(conversation.id);
        }
      });
    }
  }, [conversations, conversationsLoading, activeConversationId, addConversation]);

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId
  );

  function formatNow() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function requestAIReply(latestUserText: string) {
    setSendError(null);
    setIsTyping(true);
    setStreamingReply(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;
    wasStoppedByUserRef.current = false;

    let idleTimeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {}, 0);
    clearTimeout(idleTimeoutId);

    function resetIdleTimeout() {
      clearTimeout(idleTimeoutId);
      idleTimeoutId = setTimeout(() => controller.abort(), 20000);
    }

    let accumulated = "";

    try {
      const history: AIMessage[] = [
        ...messages.map((message) => ({
          role: message.sender,
          content: message.content,
        })),
        { role: "user" as const, content: latestUserText },
      ].slice(-HISTORY_LIMIT);

      resetIdleTimeout();

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error("AI request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let firstChunkReceived = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        resetIdleTimeout();

        const chunkText = decoder.decode(value, { stream: true });
        if (!chunkText) continue;

        if (!firstChunkReceived) {
          firstChunkReceived = true;
          setIsTyping(false);
        }

        accumulated += chunkText;
        setStreamingReply(accumulated);
      }

      if (!accumulated.trim()) {
        throw new Error("Empty AI response");
      }

      await saveMessage("assistant", accumulated);
    } catch (error) {
      console.error("AI reply failed:", error);

      const isAbort = error instanceof Error && error.name === "AbortError";
      const wasManualStop = wasStoppedByUserRef.current;

      if (isAbort && wasManualStop) {
        if (accumulated.trim()) {
          await saveMessage("assistant", accumulated);
        }
      } else {
        setSendError({ text: latestUserText, timedOut: isAbort });
      }
    } finally {
      clearTimeout(idleTimeoutId);
      setIsTyping(false);
      setStreamingReply(null);
      abortControllerRef.current = null;
      wasStoppedByUserRef.current = false;
    }
  }

  function stopGenerating() {
    wasStoppedByUserRef.current = true;
    abortControllerRef.current?.abort();
  }

  async function sendMessage(text: string) {
    if (!text.trim()) return;
    if (!activeConversationId) return;

    await saveMessage("user", text);

    if (activeConversation?.title === "New Conversation") {
      await updateConversation(
        activeConversationId,
        text.length > 35 ? text.slice(0, 35) + "..." : text
      );
    }

    await requestAIReply(text);
  }

  function regenerateResponse(message: { id: string }) {
    const index = messages.findIndex((item) => item.id === message.id);
    if (index === -1) return;

    for (let i = index - 1; i >= 0; i--) {
      if (messages[i].sender === "user") {
        requestAIReply(messages[i].content);
        return;
      }
    }
  }

  const displayMessages = streamingReply
    ? [
        ...messages,
        {
          id: "streaming-reply",
          conversationId: activeConversationId,
          sender: "assistant" as const,
          content: streamingReply,
          timestamp: formatNow(),
          createdAt: new Date().toISOString(),
        },
      ]
    : messages;

  return {
    loading: authLoading || conversationsLoading,
    user,
    userName,
    displayMessages,
    isTyping,
    sendError,
    setSendError,
    sendMessage,
    requestAIReply,
    regenerateResponse,
    stopGenerating,
    isGenerating: isTyping || streamingReply !== null,
  };
}
