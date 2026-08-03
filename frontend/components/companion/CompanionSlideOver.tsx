"use client";

import { useRouter } from "next/navigation";
import { Maximize2, Sparkles, X } from "lucide-react";

import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
import { useCompanionChat } from "@/hooks/useCompanionChat";

interface CompanionSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompanionSlideOver({
  isOpen,
  onClose,
}: CompanionSlideOverProps) {
  const router = useRouter();

  const {
    loading,
    displayMessages,
    isTyping,
    sendError,
    setSendError,
    sendMessage,
    requestAIReply,
    regenerateResponse,
    stopGenerating,
    isGenerating,
  } = useCompanionChat();

  return (
    <div
      className={`fixed inset-y-0 right-0 z-[65] flex w-full flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 md:w-[440px] ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100">
              <Sparkles className="h-4 w-4 text-violet-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Adara Companion
              </p>
              <span className="flex items-center gap-1 text-xs text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Online
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => router.push("/chat")}
              title="Open full view"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              title="Close"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="min-h-0 flex-1">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-slate-400">Loading...</p>
            </div>
          ) : (
            <ChatWindow
              messages={displayMessages}
              isTyping={isTyping}
              onRegenerate={regenerateResponse}
              onSelectPrompt={sendMessage}
            />
          )}
        </div>

        {/* Error banner */}
        {sendError && (
          <div className="mx-4 mb-3 flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>
              {sendError.timedOut
                ? "Adara is taking too long to respond."
                : "Adara couldn't respond."}
            </span>
            <button
              onClick={() => {
                const text = sendError.text;
                setSendError(null);
                requestAIReply(text);
              }}
              className="font-medium underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Composer */}
        <div className="mx-3 mb-[calc(0.75rem+env(safe-area-inset-bottom))] rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-lg transition focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100">
          <ChatInput
            onSend={sendMessage}
            isGenerating={isGenerating}
            onStop={stopGenerating}
          />
        </div>

        <p className="mb-3 px-4 text-center text-xs text-slate-400">
          Adara can make mistakes. Consider checking important information.
        </p>

      </div>
  );
}
