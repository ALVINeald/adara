"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, Sparkles } from "lucide-react";

import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import SuggestedPrompts from "./SuggestedPrompts";

import type { ChatMessage } from "./types";

interface ChatWindowProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onRegenerate: (message: ChatMessage) => void;
  onSelectPrompt: (prompt: string) => void;
}

function dayKey(createdAt?: string): string {
  const date = createdAt ? new Date(createdAt) : new Date();
  return date.toISOString().slice(0, 10);
}

function dividerLabel(key: string): string {
  const todayKey = new Date().toISOString().slice(0, 10);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  if (key === todayKey) return "Today";
  if (key === yesterdayKey) return "Yesterday";

  return new Date(key + "T00:00:00").toLocaleDateString([], {
    month: "long",
    day: "numeric",
    year:
      new Date(key).getFullYear() === new Date().getFullYear()
        ? undefined
        : "numeric",
  });
}

export default function ChatWindow({
  messages,
  isTyping,
  onRegenerate,
  onSelectPrompt,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const isEmpty = messages.length === 0 && !isTyping;

  useEffect(() => {
    // Only auto-scroll if the person is already near the bottom --
    // otherwise a new message would yank them away from something
    // they scrolled up to reread.
    const container = scrollRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    if (distanceFromBottom < 200) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  function handleScroll() {
    const container = scrollRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    setShowScrollButton(distanceFromBottom > 300);
  }

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  if (isEmpty) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 px-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50">
          <Sparkles className="h-6 w-6 text-violet-600" />
        </div>

        <p className="text-center text-lg text-slate-500">
          I'm here whenever you're ready.
        </p>

        <SuggestedPrompts onSelect={onSelectPrompt} />
      </div>
    );
  }

  let lastDayKey = "";

  return (
    <div className="relative h-full">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto px-4 py-6 md:px-8"
      >
        <div className="mx-auto flex max-w-4xl flex-col">

          {messages.map((message) => {
            const key = dayKey(message.createdAt);
            const showDivider = key !== lastDayKey;
            lastDayKey = key;

            return (
              <div key={message.id}>
                {showDivider && (
                  <div className="mb-6 flex justify-center">
                    <span className="rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-medium text-slate-500">
                      {dividerLabel(key)}
                    </span>
                  </div>
                )}
                <MessageBubble
                  message={message}
                  onRegenerate={
                    message.sender === "assistant"
                      ? () => onRegenerate(message)
                      : undefined
                  }
                />
              </div>
            );
          })}

          {isTyping && <TypingIndicator />}

          <div ref={bottomRef} />

        </div>
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          title="Scroll to latest"
          className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition hover:bg-slate-50 md:right-8"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
