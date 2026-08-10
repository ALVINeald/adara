"use client";

import { ExternalLink, Star } from "lucide-react";

import { MEDITATION_PLAYLISTS } from "./playlists";
import { getCommunityCoverGradient } from "@/components/community/communityCover";
import { useWellnessSavedItems } from "@/hooks/useWellnessSavedItems";

interface PlaylistsModuleProps {
  userId?: string;
}

export default function PlaylistsModule({ userId }: PlaylistsModuleProps) {
  const { isSaved, toggleSaved } = useWellnessSavedItems(userId);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Audio &amp; Playlists</h1>
      <p className="mb-6 text-sm text-slate-500">
        Free, reputable channels for guided meditation and calming audio.
        These play on YouTube -- Adara doesn&apos;t host audio directly, so
        each one opens in a new tab rather than pretending to play in place.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        {MEDITATION_PLAYLISTS.map((resource) => (
          <div
            key={resource.id}
            className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
          >
            <div
              className={`h-24 bg-gradient-to-br ${getCommunityCoverGradient(
                resource.id
              )}`}
            />
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-slate-900">{resource.name}</h3>
                <button
                  type="button"
                  onClick={() => toggleSaved("playlist", resource.id)}
                  aria-pressed={isSaved("playlist", resource.id)}
                  title={isSaved("playlist", resource.id) ? "Remove from favorites" : "Add to favorites"}
                  className={`shrink-0 rounded-lg p-1 ${
                    isSaved("playlist", resource.id) ? "text-amber-400" : "text-slate-300"
                  } hover:bg-amber-50 hover:text-amber-400`}
                >
                  <Star
                    className="h-4 w-4"
                    fill={isSaved("playlist", resource.id) ? "currentColor" : "none"}
                  />
                </button>
              </div>

              <p className="mt-2 text-sm text-slate-600">{resource.description}</p>

              <span className="mt-3 inline-block rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
                Best for: {resource.bestFor}
              </span>

              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700"
              >
                Open on YouTube
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
