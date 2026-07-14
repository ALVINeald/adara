"use client";

import { useEffect, useRef } from "react";

import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

import type { ChatMessage } from "./types";

interface ChatWindowProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

export default function ChatWindow({
  messages,
  isTyping,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col">

      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
        />
      ))}

      {isTyping && <TypingIndicator />}

      <div ref={bottomRef} />

    </div>
  );
}