"use client";

import { KeyboardEvent, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

const MAX_HEIGHT_PX = 160;

export default function ChatInput({
  onSend,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function resizeTextarea() {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_HEIGHT_PX)}px`;
  }

  function send() {
    const trimmed = message.trim();

    if (!trimmed) return;

    onSend(trimmed);

    setMessage("");

    // Reset height back to a single row after sending -- the browser
    // won't shrink it on its own just because the value cleared.
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    });
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  return (
    <div className="flex items-end gap-4">

      <textarea
        ref={textareaRef}
        rows={1}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          resizeTextarea();
        }}
        onKeyDown={handleKeyDown}
        placeholder="Share what's on your mind..."
        className="min-h-[56px] flex-1 resize-none overflow-y-auto rounded-3xl border border-slate-200 bg-white px-5 py-4 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        style={{ maxHeight: `${MAX_HEIGHT_PX}px` }}
      />

      <button
        type="button"
        onClick={send}
        disabled={!message.trim()}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-600 text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SendHorizontal className="h-5 w-5" />
      </button>

    </div>
  );
}
