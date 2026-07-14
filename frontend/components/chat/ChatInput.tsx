"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";

export default function ChatInput() {
  const [message, setMessage] = useState("");

  function sendMessage() {
    if (!message.trim()) return;

    console.log(message);

    setMessage("");
  }

  return (
    <div className="flex items-end gap-4">

      <textarea
        rows={1}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Share what's on your mind..."
        className="flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
      />

      <button
        onClick={sendMessage}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-600 text-white transition hover:bg-cyan-700"
      >
        <SendHorizontal className="h-5 w-5" />
      </button>

    </div>
  );
}