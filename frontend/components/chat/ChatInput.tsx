"use client";

import { KeyboardEvent, useState } from "react";
import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({
  onSend,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  function send() {
    const trimmed = message.trim();

    if (!trimmed) return;

    onSend(trimmed);

    setMessage("");
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
        rows={1}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Share what's on your mind..."
        className="min-h-[56px] flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
      />

      <button
        type="button"
        onClick={send}
        disabled={!message.trim()}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-600 text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SendHorizontal className="h-5 w-5" />
      </button>

    </div>
  );
}