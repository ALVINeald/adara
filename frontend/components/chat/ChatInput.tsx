"use client";

import { KeyboardEvent, useRef, useState } from "react";
import { Mic, Plus, Sparkles, SendHorizontal, Square } from "lucide-react";

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
    <div className="flex items-end gap-2">

      {/* Visual only -- no file-attachment backend exists yet. */}
      <button
        type="button"
        title="Attach (not yet available)"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
      >
        <Plus className="h-5 w-5" />
      </button>

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

      <div className="flex items-end gap-1.5">

        {/* Visual only -- no dedicated "smart suggestion" feature
            behind this yet. */}
        <button
          type="button"
          title="Suggestions (not yet available)"
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 sm:flex"
        >
          <Sparkles className="h-4 w-4" />
        </button>

        {/* Visual only -- real speech-to-text via the browser's Speech
            API is genuinely buildable without backend work, just not
            wired up in this pass. */}
        <button
          type="button"
          title="Voice input (not yet available)"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
        >
          <Mic className="h-4 w-4" />
        </button>

        {isGenerating ? (
          <button
            type="button"
            onClick={onStop}
            title="Stop generating"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-800 text-white transition hover:bg-slate-900"
          >
            <Square className="h-4 w-4 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={send}
            disabled={!message.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendHorizontal className="h-5 w-5" />
          </button>
        )}

      </div>

    </div>
  );
}
