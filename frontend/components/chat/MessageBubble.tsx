import { Sparkles } from "lucide-react";

import type { ChatMessage } from "./type";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({
  message,
}: MessageBubbleProps) {
  const isUser = message.sender === "user";

  if (isUser) {
    return (
      <div className="mb-6 flex justify-end">
        <div className="max-w-[75%] rounded-3xl rounded-br-md bg-cyan-600 px-5 py-4 text-white shadow-sm">
          <p className="whitespace-pre-wrap leading-7">
            {message.content}
          </p>
          <p className="mt-3 text-xs text-cyan-100">
            {message.timestamp}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 flex justify-start">
      <div className="max-w-2xl">

        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan-600" />
          <span className="text-xs font-semibold text-cyan-700">
            Adara
          </span>
        </div>

        <p className="whitespace-pre-wrap text-[15px] leading-7 text-slate-800">
          {message.content}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          {message.timestamp}
        </p>

      </div>
    </div>
  );
}