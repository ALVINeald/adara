import { Bot, User } from "lucide-react";

import type { ChatMessage } from "./types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({
  message,
}: MessageBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`mb-6 flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[80%] items-end gap-3 ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
            isUser
              ? "bg-cyan-600"
              : "bg-cyan-100"
          }`}
        >
          {isUser ? (
            <User className="h-5 w-5 text-white" />
          ) : (
            <Bot className="h-5 w-5 text-cyan-700" />
          )}
        </div>

        {/* Bubble */}

        <div
          className={`rounded-3xl px-5 py-4 shadow-sm ${
            isUser
              ? "rounded-br-md bg-cyan-600 text-white"
              : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
          }`}
        >
          <p className="whitespace-pre-wrap leading-7">
            {message.content}
          </p>

          <p
            className={`mt-3 text-xs ${
              isUser
                ? "text-cyan-100"
                : "text-slate-400"
            }`}
          >
            {message.timestamp}
          </p>
        </div>
      </div>
    </div>
  );
}