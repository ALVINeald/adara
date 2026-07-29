"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

import type { ChatMessage } from "./types";

interface MessageBubbleProps {
  message: ChatMessage;
  onRegenerate?: () => void;
}

export default function MessageBubble({
  message,
  onRegenerate,
}: MessageBubbleProps) {
  const isUser = message.sender === "user";
  const isStreaming = message.id === "streaming-reply";

  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  async function handleCopy() {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (isUser) {
    return (
      <div className="mb-6 flex justify-end">
        <div className="max-w-[75%] rounded-3xl rounded-br-md bg-cyan-600 px-5 py-4 text-white shadow-sm">
          <p className="whitespace-pre-wrap leading-7">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="group mb-8 flex justify-start">
      <div className="max-w-2xl">

        <Sparkles className="mb-2 h-4 w-4 text-cyan-500" />

        <div className="text-[15px] leading-7 text-slate-800">
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className="mb-3 whitespace-pre-wrap last:mb-0">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li>{children}</li>,
              strong: ({ children }) => (
                <strong className="font-semibold text-slate-900">
                  {children}
                </strong>
              ),
              em: ({ children }) => <em>{children}</em>,
              a: ({ children, href }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-700 underline underline-offset-2 hover:text-cyan-800"
                >
                  {children}
                </a>
              ),
              code: ({ children }) => (
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px] text-slate-700">
                  {children}
                </code>
              ),
              h1: ({ children }) => (
                <h3 className="mb-2 mt-1 text-base font-semibold text-slate-900">
                  {children}
                </h3>
              ),
              h2: ({ children }) => (
                <h3 className="mb-2 mt-1 text-base font-semibold text-slate-900">
                  {children}
                </h3>
              ),
              h3: ({ children }) => (
                <h3 className="mb-2 mt-1 text-base font-semibold text-slate-900">
                  {children}
                </h3>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>

          {isStreaming && (
            <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-cyan-500 align-text-bottom" />
          )}
        </div>

        {!isStreaming && (
          <div className="mt-1 flex items-center gap-3 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
            <button
              onClick={handleCopy}
              title="Copy"
              className="text-slate-400 transition hover:text-slate-600"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>

            {onRegenerate && (
              <button
                onClick={onRegenerate}
                title="Regenerate"
                className="text-slate-400 transition hover:text-slate-600"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            )}

            <button
              onClick={() =>
                setFeedback(feedback === "up" ? null : "up")
              }
              title="Good response"
              className={`transition hover:text-slate-600 ${
                feedback === "up" ? "text-cyan-600" : "text-slate-400"
              }`}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() =>
                setFeedback(feedback === "down" ? null : "down")
              }
              title="Poor response"
              className={`transition hover:text-slate-600 ${
                feedback === "down" ? "text-red-500" : "text-slate-400"
              }`}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
