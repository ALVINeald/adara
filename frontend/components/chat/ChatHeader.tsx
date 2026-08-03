"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Flame,
  MoreVertical,
  PanelLeft,
  Pin,
  Sparkles,
} from "lucide-react";

import { useMoodEntries } from "@/hooks/useMoodEntries";
import { calculateStreak } from "@/components/mood/streak";
import { getMoodOption } from "@/components/mood/moodScale";
import type { ChatMessage } from "./types";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  userId?: string;
  messages?: ChatMessage[];
}

function todayKey() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

export default function ChatHeader({
  onToggleSidebar,
  userId,
  messages = [],
}: ChatHeaderProps) {
  const { entries } = useMoodEntries(userId);

  const todayEntry = entries.find((entry) => entry.entryDate === todayKey());
  const todayMood = todayEntry ? getMoodOption(todayEntry.moodLevel) : undefined;
  const streak = calculateStreak(entries);

  const [pinned, setPinned] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const transcript = messages
      .map((m) => `${m.sender === "user" ? "You" : "Adara"}: ${m.content}`)
      .join("\n\n");

    await navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <header className="border-b border-slate-200 bg-white/70 backdrop-blur">

      <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4">

        <div className="flex items-center gap-2">

          <button
            onClick={onToggleSidebar}
            title="Conversations"
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 md:hidden"
          >
            <PanelLeft className="h-5 w-5" />
          </button>

          <Sparkles className="h-5 w-5 text-violet-600" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">
                Adara
              </h1>
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Online
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Your AI wellness companion
            </p>
          </div>

        </div>

        <div className="flex items-center gap-1">

          {/* Not persisted anywhere -- purely a local visual toggle
              for now, same honesty flag as the composer's attach/mic
              icons earlier this session. */}
          <button
            onClick={() => setPinned((prev) => !prev)}
            title={pinned ? "Unpin conversation" : "Pin conversation"}
            className={`rounded-lg p-2 transition hover:bg-slate-100 ${
              pinned ? "text-violet-600" : "text-slate-400"
            }`}
          >
            <Pin className={`h-4 w-4 ${pinned ? "fill-violet-600" : ""}`} />
          </button>

          <button
            onClick={handleShare}
            title="Copy conversation"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>

          {/* Visual only -- no menu built behind it yet. */}
          <button
            title="More (not yet available)"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

        </div>

      </div>

      <div className="flex flex-wrap items-center gap-2 px-4 pb-3 md:px-8 md:pb-4">

        {todayMood && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
            Mood: {todayMood.label} {todayMood.emoji}
          </span>
        )}

        {streak > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
            <Flame className="h-3.5 w-3.5" />
            Streak: {streak} {streak === 1 ? "day" : "days"}
          </span>
        )}

        {/* Static -- there's no real "daily focus" feature/data
            source behind this yet, unlike the two chips above. */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
          Focus: Self Compassion
        </span>

      </div>

    </header>
  );
}
