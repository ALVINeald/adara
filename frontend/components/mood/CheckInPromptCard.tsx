"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CheckInPromptCard() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mb-6 grid gap-8 rounded-[32px] bg-gradient-to-br from-violet-50 via-violet-50 to-purple-50 p-8 md:grid-cols-[1fr_auto] md:items-center">

      <div>
        <p className="text-sm font-semibold text-violet-700">Check-in</p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
          How are you, really?
        </h2>

        <p className="mt-2 max-w-md text-slate-600">
          Take a moment to check in with yourself. I&apos;m here to listen,
          always.
        </p>

        <div className="mt-6 flex items-center gap-5">
          <button
            onClick={() => router.push("/chat")}
            className="rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Let&apos;s Talk
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-slate-700"
          >
            Not now
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Standing in for the mockup's custom ghost illustration --
          didn't want to fake a bespoke asset that doesn't exist. */}
      <div className="hidden h-36 w-36 shrink-0 items-center justify-center rounded-full bg-white/60 md:flex">
        <Sparkles className="h-14 w-14 text-violet-400" />
      </div>

    </div>
  );
}
