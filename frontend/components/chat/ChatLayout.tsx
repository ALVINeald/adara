"use client";

import { useEffect, useState } from "react";

import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import SuggestedPrompts from "./SuggestedPrompts";

import { useAuth } from "@/hooks/useAuth";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";

import type { AIMessage } from "@/lib/ai/types";

const HISTORY_LIMIT = 20;

export default function ChatLayout() {
  const { user, loading: authLoading } = useAuth();

  const {
    conversations,
    loading: conversationsLoading,
    addConversation,
    updateConversation,
    removeConversation,
  } = useConversations(user?.id);

  const [activeConversationId, setActiveConversationId] = useState("");

  const { messages, sendMessage: saveMessage } = useMessages(
    activeConversationId
  );

  const [isTyping, setIsTyping] = useState(false);
  const [streamingReply, setStreamingReply] = useState<string | null>(null);
  const [sendError, setSendError] = useState<{
    text: string;
    timedOut?: boolean;
  } | null>(null);

  useEffect(() => {
    if (conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

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
    let idleTimeoutId: ReturnType<typeof setTimeout>;

    function resetIdleTimeout() {
      clearTimeout(idleTimeoutId);
      idleTimeoutId = setTimeout(() => controller.abort(), 20000);
    }

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
      let accumulated = "";
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
      const timedOut = error instanceof Error && error.name === "AbortError";
      setSendError({ text: latestUserText, timedOut });
    } finally {
      clearTimeout(idleTimeoutId);
      setIsTyping(false);
      setStreamingReply(null);
    }
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

  async function startNewConversation() {
    const conversation = await addConversation();
    if (!conversation) return;
    setActiveConversationId(conversation.id);
  }

  async function deleteConversation(id: string) {
    await removeConversation(id);

    const remaining = conversations.filter(
      (conversation) => conversation.id !== id
    );

    if (activeConversationId === id) {
      setActiveConversationId(remaining.length > 0 ? remaining[0].id : "");
    }
  }

  async function renameConversation(id: string, title: string) {
    if (!title.trim()) return;
    await updateConversation(id, title);
  }

  if (authLoading || conversationsLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </main>
    );
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
        },
      ]
    : messages;

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)] p-6">
      <div className="mx-auto flex h-[90vh] max-w-7xl overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-[0_25px_80px_rgba(15,118,110,0.12)] backdrop-blur-xl">

        <aside className="hidden w-80 border-r border-slate-200 bg-white/70 lg:block">
          <ChatSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            onNewConversation={startNewConversation}
            onDeleteConversation={deleteConversation}
            onRenameConversation={renameConversation}
          />
        </aside>

        <section className="flex flex-1 flex-col">
          <ChatHeader />

          <div className="flex-1 overflow-y-auto px-8 py-6">
            <ChatWindow messages={displayMessages} isTyping={isTyping} />
          </div>

          <div className="border-t border-slate-200 bg-white/60 px-8 py-6">
            <SuggestedPrompts onSelect={sendMessage} />

            {sendError && (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                <span>
                  {sendError.timedOut
                    ? "Adara is taking too long to respond. Your message is saved."
                    : "Adara couldn't respond. Your message is saved."}
                </span>
                <button
                  onClick={() => {
                    const text = sendError.text;
                    setSendError(null);
                    requestAIReply(text);
                  }}
                  className="font-medium underline"
                >
                  Retry
                </button>
              </div>
            )}

            <div className="mt-5">
              <ChatInput onSend={sendMessage} />
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}