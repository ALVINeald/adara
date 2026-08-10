"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Share2, Star } from "lucide-react";

import { ARTICLES } from "./articles";
import type { Article } from "@/types/wellness";
import { useWellnessSavedItems } from "@/hooks/useWellnessSavedItems";

interface ArticleReaderProps {
  article: Article;
  userId?: string;
  onBack: () => void;
  onSelectRelated: (article: Article) => void;
}

export default function ArticleReader({
  article,
  userId,
  onBack,
  onSelectRelated,
}: ArticleReaderProps) {
  const { isSaved, toggleSaved } = useWellnessSavedItems(userId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function handleScroll() {
      if (!el) return;
      const scrollable = el.scrollHeight - el.clientHeight;
      const pct = scrollable > 0 ? (el.scrollTop / scrollable) * 100 : 100;
      setProgress(Math.min(100, Math.max(0, pct)));
    }

    handleScroll();
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [article.slug]);

  async function handleShare() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/wellness?section=articles&item=${article.slug}`
        : "";

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: article.title, text: article.summary, url });
        return;
      } catch {
        // user cancelled the native share sheet -- fall through silently
        return;
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 2000);
    }
  }

  const related = ARTICLES.filter(
    (a) => a.slug !== article.slug && a.tags.some((t) => article.tags.includes(t))
  ).slice(0, 2);

  return (
    <article className="flex h-full flex-col">
      <div className="h-1 w-full bg-slate-100">
        <div
          className="h-full bg-violet-600 transition-all"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Reading progress"
        />
      </div>

      <header className="flex items-center justify-between border-b border-slate-100 px-6 py-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to articles
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleShare}
            title="Share"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-slate-500 hover:bg-slate-100"
          >
            {shareState === "copied" ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-600">Link copied</span>
              </>
            ) : (
              <Share2 className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => toggleSaved("article", article.slug)}
            aria-pressed={isSaved("article", article.slug)}
            title={isSaved("article", article.slug) ? "Remove from saved" : "Save for later"}
            className={`rounded-lg p-1.5 ${
              isSaved("article", article.slug) ? "text-amber-400" : "text-slate-400"
            } hover:bg-amber-50 hover:text-amber-400`}
          >
            <Star
              className="h-4 w-4"
              fill={isSaved("article", article.slug) ? "currentColor" : "none"}
            />
          </button>
        </div>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[720px] px-6 py-10">
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium capitalize text-violet-700">
            {article.tags[0]?.replace("-", " ")}
          </span>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-900">
            {article.title}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {article.readTimeMinutes} min read
          </p>

          <div className="mt-8 space-y-5 text-[17px] leading-8 text-slate-700">
            {article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {related.length > 0 && (
            <div className="mt-12 border-t border-slate-100 pt-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Related
              </h2>
              <div className="space-y-3">
                {related.map((relatedArticle) => (
                  <button
                    key={relatedArticle.slug}
                    onClick={() => onSelectRelated(relatedArticle)}
                    className="block w-full rounded-xl bg-slate-50 p-4 text-left transition hover:bg-slate-100"
                  >
                    <p className="font-medium text-slate-800">{relatedArticle.title}</p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {relatedArticle.summary}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
