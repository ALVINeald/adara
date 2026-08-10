"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Menu, TrendingUp, X } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useWellnessSessions } from "@/hooks/useWellnessSessions";
import { useWellnessSavedItems } from "@/hooks/useWellnessSavedItems";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import AppShell from "@/components/navigation/AppShell";
import Sidebar from "@/components/wellness/Sidebar";
import MobileCategoryTabs from "@/components/wellness/MobileCategoryTabs";
import ProgressPanel from "@/components/wellness/ProgressPanel";
import BreathingModule from "@/components/wellness/BreathingModule";
import MeditationModule from "@/components/wellness/MeditationModule";
import PlaylistsModule from "@/components/wellness/PlaylistsModule";
import ArticlesModule from "@/components/wellness/ArticlesModule";
import type { WellnessPillar } from "@/types/wellness";

function isPillar(value: string | null): value is WellnessPillar {
  return (
    value === "breathing" ||
    value === "meditation" ||
    value === "playlists" ||
    value === "articles"
  );
}

function WellnessHubInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth/login");
    }
  }, [authLoading, user, router]);

  const { sessions } = useWellnessSessions(user?.id);
  const { items: savedItems } = useWellnessSavedItems(user?.id);
  const { entries: moodEntries } = useMoodEntries(user?.id);

  const paramSection = searchParams.get("section");
  const paramItem = searchParams.get("item");

  const [selection, setSelection] = useState<{
    pillar: WellnessPillar;
    leafId: string | null;
  }>({
    pillar: isPillar(paramSection) ? paramSection : "breathing",
    leafId: paramItem,
  });

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileProgressOpen, setMobileProgressOpen] = useState(false);

  function handleSelect(pillar: WellnessPillar, leafId: string | null) {
    setSelection({ pillar, leafId });
    setMobileSidebarOpen(false);
  }

  const centerContent = useMemo(() => {
    switch (selection.pillar) {
      case "breathing":
        return <BreathingModule userId={user?.id} initialLeafId={selection.leafId} />;
      case "meditation":
        return <MeditationModule userId={user?.id} initialLeafId={selection.leafId} />;
      case "playlists":
        return <PlaylistsModule userId={user?.id} />;
      case "articles":
        return <ArticlesModule userId={user?.id} initialLeafId={selection.leafId} />;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, user?.id]);

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </main>
    );
  }

  return (
    <div className="wellness-shell-height flex flex-col overflow-hidden bg-[#FFFBF5] md:flex-row">
      {/* Desktop sidebar */}
      <div className="hidden w-72 shrink-0 border-r border-slate-100 md:block">
        <Sidebar
          selection={selection}
          onSelect={handleSelect}
          savedItems={savedItems}
          recentSessions={sessions}
          onOpenProgress={() => setMobileProgressOpen(true)}
        />
      </div>

      {/* Mobile top bar: menu trigger + segmented tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-2 py-2 md:hidden">
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          aria-label="Open wellness menu"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <MobileCategoryTabs
            active={selection.pillar}
            onSelect={(pillar) => handleSelect(pillar, null)}
          />
        </div>
      </div>

      {/* Center content */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-[#FFFBF5]">{centerContent}</div>

      {/* Desktop insight panel */}
      <div className="hidden w-80 shrink-0 border-l border-slate-100 bg-white xl:block">
        <ProgressPanel
          sessions={sessions}
          savedCount={savedItems.length}
          moodEntries={moodEntries}
        />
      </div>

      {/* Mobile sidebar drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/20"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-xs bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <span className="font-semibold text-slate-900">Wellness Hub</span>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Sidebar
              selection={selection}
              onSelect={handleSelect}
              savedItems={savedItems}
              recentSessions={sessions}
              onOpenProgress={() => {
                setMobileSidebarOpen(false);
                setMobileProgressOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile/tablet progress drawer (below xl) */}
      {mobileProgressOpen && (
        <div className="fixed inset-0 z-30 xl:hidden">
          <div
            className="absolute inset-0 bg-slate-900/20"
            onClick={() => setMobileProgressOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-xs bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                <TrendingUp className="h-4 w-4 text-violet-500" />
                Your progress
              </span>
              <button
                type="button"
                onClick={() => setMobileProgressOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ProgressPanel
              sessions={sessions}
              savedCount={savedItems.length}
              moodEntries={moodEntries}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function WellnessHubPage() {
  return (
    <AppShell noBottomPadding>
      <Suspense
        fallback={
          <main className="flex min-h-screen items-center justify-center bg-slate-50">
            <p className="text-slate-500">Loading...</p>
          </main>
        }
      >
        <WellnessHubInner />
      </Suspense>
    </AppShell>
  );
}
