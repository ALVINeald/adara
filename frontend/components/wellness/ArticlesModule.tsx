"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import ArticleReader from "./ArticleReader";
import { ARTICLES } from "./articles";
import { getCommunityCoverGradient } from "@/components/community/communityCover";
import type { Article } from "@/types/wellness";
import { useWellnessSavedItems } from "@/hooks/useWellnessSavedItems";

interface ArticlesModuleProps {
  userId?: string;
  initialLeafId?: string | null;
}

export default function ArticlesModule({
  userId,
  initialLeafId,
}: ArticlesModuleProps) {
  const { isSaved, toggleSaved } = useWellnessSavedItems(userId);

  const [selected, setSelected] = useState<Article | null>(
    initialLeafId ? ARTICLES.find((a) => a.slug === initialLeafId) ?? null : null
  );

  useEffect(() => {
    if (initialLeafId) {
      const match = ARTICLES.find(
        (a) => a.slug === initialLeafId || a.tags.includes(initialLeafId)
      );
      if (match) setSelected(match);
      else setSelected(null);
    }
  }, [initialLeafId]);

  const visibleArticles = initialLeafId
    ? ARTICLES.filter((a) => a.tags.includes(initialLeafId))
    : ARTICLES;

  if (selected) {
    return (
      <ArticleReader
        article={selected}
        userId={userId}
        onBack={() => setSelected(null)}
        onSelectRelated={setSelected}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Curated Articles</h1>
      <p className="mb-6 text-sm text-slate-500">
        Short, practical reads. These offer general information and
        aren&apos;t a substitute for professional care.
      </p>

      <div className="space-y-4">
        {(visibleArticles.length > 0 ? visibleArticles : ARTICLES).map((article) => (
          <div
            key={article.slug}
            className="flex gap-4 overflow-hidden rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div
              className={`h-20 w-20 shrink-0 rounded-xl bg-gradient-to-br ${getCommunityCoverGradient(
                article.slug
              )}`}
            />
            <button
              onClick={() => setSelected(article)}
              className="min-w-0 flex-1 text-left"
            >
              <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium capitalize text-violet-700">
                {article.tags[0]?.replace("-", " ")}
              </span>
              <h3 className="mt-1.5 font-semibold text-slate-900">{article.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                {article.summary}
              </p>
              <p className="mt-1.5 text-xs text-slate-400">
                {article.readTimeMinutes} min read
              </p>
            </button>
            <button
              type="button"
              onClick={() => toggleSaved("article", article.slug)}
              aria-pressed={isSaved("article", article.slug)}
              title={isSaved("article", article.slug) ? "Remove from saved" : "Save for later"}
              className={`shrink-0 self-start rounded-lg p-1.5 ${
                isSaved("article", article.slug) ? "text-amber-400" : "text-slate-300"
              } hover:bg-amber-50 hover:text-amber-400`}
            >
              <Star
                className="h-4 w-4"
                fill={isSaved("article", article.slug) ? "currentColor" : "none"}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
