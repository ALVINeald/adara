"use client";

import { KeyboardEvent, useRef, useState } from "react";
import { SendHorizontal, Square } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isGenerating: boolean;
  onStop: () => void;
}

const MAX_HEIGHT_PX = 240;

export default function ChatInput({
  onSend,
  isGenerating,
  onStop,
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
    if (isGenerating) return;

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
        className="chat-composer-scroll min-h-[40px] flex-1 resize-none overflow-y-auto bg-transparent px-2 py-2 text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
        style={{ maxHeight: `${MAX_HEIGHT_PX}px` }}
      />

      {isGenerating ? (
        <button
          type="button"
          onClick={onStop}
          title="Stop generating"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-white transition hover:bg-slate-900"
        >
          <Square className="h-4 w-4 fill-current" />
        </button>
      ) : (
        <button
          type="button"
          onClick={send}
          disabled={!message.trim()}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-600 text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SendHorizontal className="h-5 w-5" />
        </button>
      )}

    </div>
  );
}
