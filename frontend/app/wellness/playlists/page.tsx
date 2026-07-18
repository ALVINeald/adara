import { ExternalLink } from "lucide-react";

import { MEDITATION_PLAYLISTS } from "@/components/wellness/playlists";

export default function PlaylistsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)] p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">
          Meditation Playlists
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          A few free, reputable channels to listen to anytime. These open in
          a new tab.
        </p>

        <div className="space-y-4">
          {MEDITATION_PLAYLISTS.map((resource) => (
            <a
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">
                  {resource.name}
                </h3>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </div>

              <p className="mt-2 text-sm text-slate-600">
                {resource.description}
              </p>

              <p className="mt-2 text-sm font-medium text-cyan-700">
                Best for: {resource.bestFor}
              </p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}