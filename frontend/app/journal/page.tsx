"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, X } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import type { JournalEntry } from "@/hooks/useJournalEntries";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { getProfileNamesByIds } from "@/lib/profiles";

import AppShell from "@/components/navigation/AppShell";
import JournalHeader from "@/components/journal/JournalHeader";
import JournalMoodCheckIn, {
  getTodayDate,
} from "@/components/journal/JournalMoodCheckIn";
import JournalHero from "@/components/journal/JournalHero";
import JournalTagChips from "@/components/journal/JournalTagChips";
import JournalListPanel from "@/components/journal/JournalListPanel";
import JournalCanvas from "@/components/journal/JournalCanvas";
import JournalInsights from "@/components/journal/JournalInsights";

type View = { mode: "list" } | { mode: "editing"; entry: JournalEntry | null };

export default function JournalPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth/login");
    }
  }, [authLoading, user, router]);

  const {
    entries,
    loading: entriesLoading,
    saveNewEntry,
    saveExistingEntry,
    removeEntry,
    toggleFavorite,
  } = useJournalEntries(user?.id);

  const { entries: moodEntries, saveMoodEntry } = useMoodEntries(user?.id);

  const [firstName, setFirstName] = useState("");
  const [view, setView] = useState<View>({ mode: "list" });
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [insightsOpen, setInsightsOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    getProfileNamesByIds([user.id]).then(({ data }) => {
      const fullName = data?.[0]?.full_name;
      if (fullName) setFirstName(fullName.split(" ")[0]);
    });
  }, [user?.id]);

  // If the entry currently open gets updated elsewhere (e.g. after
  // autosave), keep the canvas pointed at the latest copy.
  useEffect(() => {
    if (view.mode === "editing" && view.entry) {
      const latest = entries.find((e) => e.id === view.entry!.id);
      if (latest && latest !== view.entry) {
        setView({ mode: "editing", entry: latest });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  const todayMoodEntry = useMemo(
    () => moodEntries.find((e) => e.entryDate === getTodayDate()),
    [moodEntries]
  );

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Delete this entry? You can recover it for 30 days from the trash."
    );
    if (!confirmed) return;

    await removeEntry(id);
    if (view.mode === "editing" && view.entry?.id === id) {
      setView({ mode: "list" });
    }
  }

  if (authLoading) {
    return (
      <AppShell>
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="text-slate-500">Loading...</p>
        </main>
      </AppShell>
    );
  }

  const isEditing = view.mode === "editing";
  const selectedEntryId = isEditing ? view.entry?.id ?? null : null;

  return (
    <AppShell hideMobileTabs={isEditing} noBottomPadding>
      <div className="journal-shell-height flex w-full overflow-hidden bg-slate-50">
        <div
          className={`w-full shrink-0 overflow-hidden border-r border-slate-100 bg-white lg:flex lg:w-[420px] ${
            isEditing ? "hidden" : "flex"
          }`}
        >
          <div className="flex h-full w-full flex-col px-5 pb-24 pt-6 md:pb-6">
            <JournalHeader
              firstName={firstName}
              search={search}
              onSearchChange={setSearch}
            />

            <JournalMoodCheckIn
              todayEntry={todayMoodEntry}
              onSelect={(level) => saveMoodEntry(getTodayDate(), level, null)}
            />

            <div className="mt-3">
              <JournalHero
                onNewEntry={() => setView({ mode: "editing", entry: null })}
              />
            </div>

            <JournalTagChips
              entries={entries}
              activeTag={tagFilter}
              onSelect={setTagFilter}
            />

            <JournalListPanel
              entries={entries}
              selectedEntryId={selectedEntryId}
              loading={entriesLoading}
              search={search}
              tagFilter={tagFilter}
              onTagFilterChange={setTagFilter}
              onSelectEntry={(entry) => setView({ mode: "editing", entry })}
              onDeleteEntry={handleDelete}
              onToggleFavorite={(id) => {
                const target = entries.find((e) => e.id === id);
                if (target) toggleFavorite(id, !target.isFavorited);
              }}
            />
          </div>
        </div>

        <div
          className={`min-w-0 flex-1 overflow-hidden bg-white lg:flex ${
            isEditing ? "flex" : "hidden"
          }`}
        >
          {isEditing ? (
            <JournalCanvas
              key={view.entry?.id ?? "new"}
              entry={view.entry}
              onBack={() => setView({ mode: "list" })}
              onCreate={saveNewEntry}
              onUpdate={saveExistingEntry}
            />
          ) : (
            <div className="hidden h-full w-full flex-col items-center justify-center gap-3 text-center lg:flex">
              <p className="font-medium text-slate-500">
                Select a reflection, or write a new one
              </p>
            </div>
          )}
        </div>

        {/* Insights: permanent column on very wide screens, drawer below that */}
        <div className="hidden h-full w-80 shrink-0 border-l border-slate-100 2xl:block">
          <JournalInsights
            entries={entries}
            onOpenMemory={(entry) => setView({ mode: "editing", entry })}
          />
        </div>
      </div>

      {!isEditing && (
        <button
          type="button"
          onClick={() => setInsightsOpen(true)}
          className="fixed bottom-24 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-600/30 2xl:hidden"
          style={{ bottom: "max(6rem, calc(env(safe-area-inset-bottom) + 5rem))" }}
          aria-label="View insights"
        >
          <TrendingUp className="h-5 w-5" />
        </button>
      )}

      {insightsOpen && (
        <div className="fixed inset-0 z-40 2xl:hidden">
          <div
            className="absolute inset-0 bg-slate-900/20"
            onClick={() => setInsightsOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                <TrendingUp className="h-4 w-4 text-violet-500" />
                Your Insights
              </span>
              <button
                type="button"
                onClick={() => setInsightsOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <JournalInsights
              entries={entries}
              onOpenMemory={(entry) => {
                setInsightsOpen(false);
                setView({ mode: "editing", entry });
              }}
            />
          </div>
        </div>
      )}
    </AppShell>
  );
}
