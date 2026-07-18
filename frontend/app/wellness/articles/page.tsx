"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { ARTICLES } from "@/components/wellness/articles";
import type { Article } from "@/components/wellness/articles";

export default function ArticlesPage() {
  const [selected, setSelected] = useState<Article | null>(null);

  if (selected) {
    return (
      <main className="min-h-screen bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)] p-6">
        <div className="mx-auto max-w-2xl">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to articles
          </button>

          <div className="rounded-[28px] bg-white p-8 shadow-sm">
            <h1 className="mb-6 text-2xl font-bold text-slate-900">
              {selected.title}
            </h1>

            <div className="space-y-4">
              {selected.content.map((paragraph, index) => (
                <p key={index} className="leading-7 text-slate-700">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)] p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Resources</h1>
        <p className="mb-6 text-sm text-slate-500">
          Short, practical reads. These offer general information and
          aren't a substitute for professional care.
        </p>

        <div className="space-y-4">
          {ARTICLES.map((article) => (
            <button
              key={article.slug}
              onClick={() => setSelected(article)}
              className="w-full rounded-2xl bg-white p-6 text-left shadow-sm transition hover:shadow-md"
            >
              <h3 className="font-semibold text-slate-900">
                {article.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {article.summary}
              </p>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}