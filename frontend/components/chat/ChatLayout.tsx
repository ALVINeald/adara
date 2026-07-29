"use client";

import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

import { useAuth } from "@/hooks/useAuth";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { getProfileNamesByIds } from "@/lib/profiles";
import { useChatSidebar } from "@/lib/chatSidebarContext";

import type { AIMessage } from "@/lib/ai/types";
import type { ChatMessage } from "./types";

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
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    registerNewConversationHandler,
  } = useChatSidebar();
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
    abortControllerRef.current = controller;
    wasStoppedByUserRef.current = false;

    let idleTimeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {}, 0);
    clearTimeout(idleTimeoutId);

    function resetIdleTimeout() {
      clearTimeout(idleTimeoutId);
      idleTimeoutId = setTimeout(() => controller.abort(), 20000);
    }

    // Hoisted out of the try block (rather than declared inside it)
    // so the catch block below can still see whatever streamed in
    // before a manual stop or timeout.
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
        // Deliberately stopped -- keep whatever streamed in so far
        // as the final message instead of treating it as a failure.
        // Nothing to save if the stop landed before any text arrived.
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

  function regenerateResponse(message: ChatMessage) {
    const index = messages.findIndex((item) => item.id === message.id);
    if (index === -1) return;

    // Walk backwards to find the user message that prompted this
    // reply, and replay it. This appends a fresh response rather than
    // replacing the old one in place -- simpler, and the old response
    // stays visible above the new one rather than silently vanishing.
    for (let i = index - 1; i >= 0; i--) {
      if (messages[i].sender === "user") {
        requestAIReply(messages[i].content);
        return;
      }
    }
  }

  async function startNewConversation() {
    const conversation = await addConversation();
    if (!conversation) return;
    setActiveConversationId(conversation.id);
    setIsSidebarOpen(false);
  }

  useEffect(() => {
    registerNewConversationHandler(startNewConversation);
  });

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
    <main className="chat-shell-height flex overflow-hidden bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)]">

      <div
        className={`fixed inset-0 z-50 bg-white transition-transform duration-300 md:static md:z-auto md:flex-shrink-0 md:transform-none md:overflow-hidden md:transition-[width] md:duration-300 ${
          isSidebarOpen
            ? "translate-x-0 md:w-80 md:border-r md:border-slate-200"
            : "-translate-x-full md:w-14 md:border-r md:border-slate-200 lg:w-0 lg:border-r-0"
        }`}
      >
        <div className="h-full w-full">
          <ChatSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={(id) => {
              setActiveConversationId(id);
              setIsSidebarOpen(false);
            }}
            onNewConversation={startNewConversation}
            onDeleteConversation={deleteConversation}
            onRenameConversation={renameConversation}
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            isExpanded={isSidebarOpen}
            userName={userName}
          />
        </div>
      </div>

      <section
        className={`min-w-0 flex-1 flex-col ${
          isSidebarOpen ? "hidden md:flex" : "flex"
        }`}
      >
        <ChatHeader
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        <div className="min-h-0 flex-1">
          <ChatWindow
            messages={displayMessages}
            isTyping={isTyping}
            onRegenerate={regenerateResponse}
            onSelectPrompt={sendMessage}
          />
        </div>

        <div className="px-4 md:px-8">
          {sendError && (
            <div className="mb-4 flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
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
        </div>

        <div className="mx-4 mb-[calc(6rem+env(safe-area-inset-bottom))] rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-lg backdrop-blur-xl transition focus-within:border-cyan-300 focus-within:ring-2 focus-within:ring-cyan-100 md:mx-auto md:mb-6 md:max-w-3xl">
          <ChatInput
            onSend={sendMessage}
            isGenerating={isTyping || streamingReply !== null}
            onStop={stopGenerating}
          />
        </div>
      </section>

    </main>
  );
}