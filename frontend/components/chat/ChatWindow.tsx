"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

import type { ChatMessage } from "./types";

interface ChatWindowProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onRegenerate: (message: ChatMessage) => void;
}

export default function ChatWindow({
  messages,
  isTyping,
  onRegenerate,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

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

  return (
    <div className="relative h-full">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto px-4 py-6 md:px-8"
      >
        <div className="mx-auto flex max-w-4xl flex-col">

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onRegenerate={
                message.sender === "assistant"
                  ? () => onRegenerate(message)
                  : undefined
              }
            />
          ))}

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
