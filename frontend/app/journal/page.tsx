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

type View =
  | { mode: "browse" }
  | { mode: "editing"; entry: JournalEntry | null };

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
  const [view, setView] = useState<View>({ mode: "browse" });
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [insightsOpen, setInsightsOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    getProfileNamesByIds([user.id]).then(({ data }) => {
      const fullName = data?.[0]?.full_name;
      if (fullName) {
        setFirstName(fullName.split(" ")[0]);
      }
    });
  }, [user?.id]);

  useEffect(() => {
    if (view.mode !== "editing" || !view.entry) return;

    const latest = entries.find((entry) => entry.id === view.entry?.id);

    if (latest && latest !== view.entry) {
      setView({ mode: "editing", entry: latest });
    }
  }, [entries, view]);

  const todayMoodEntry = useMemo(
    () => moodEntries.find((entry) => entry.entryDate === getTodayDate()),
    [moodEntries]
  );

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Delete this entry? You can recover it for 30 days from the trash."
    );

    if (!confirmed) return;

    await removeEntry(id);

    if (view.mode === "editing" && view.entry?.id === id) {
      setView({ mode: "browse" });
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

  return (
    <AppShell hideMobileTabs={isEditing} noBottomPadding>
      <div className="journal-shell-height flex w-full overflow-hidden bg-slate-50">
        {isEditing ? (
          <main className="min-w-0 flex-1 bg-white">
            <JournalCanvas
              key={view.entry?.id ?? "new"}
              entry={view.entry}
              onBack={() => setView({ mode: "browse" })}
              onCreate={saveNewEntry}
              onUpdate={saveExistingEntry}
            />
          </main>
        ) : (
          <main className="min-w-0 flex-1 overflow-y-auto bg-slate-50">
            <div className="mx-auto w-full max-w-[1800px] px-4 pb-24 pt-5 sm:px-6 lg:px-8 xl:px-10">
              <JournalHeader
                firstName={firstName}
                search={search}
                onSearchChange={setSearch}
              />

              <div className="mt-3">
                <JournalMoodCheckIn
                  todayEntry={todayMoodEntry}
                  onSelect={(level) =>
                    saveMoodEntry(getTodayDate(), level, null)
                  }
                />
              </div>

              <div className="mt-4">
                <JournalHero
                  onNewEntry={() =>
                    setView({ mode: "editing", entry: null })
                  }
                />
              </div>

              <div className="mt-3">
                <JournalTagChips
                  entries={entries}
                  activeTag={tagFilter}
                  onSelect={setTagFilter}
                />
              </div>

              <div className="mt-3">
                <JournalListPanel
                  entries={entries}
                  selectedEntryId={null}
                  loading={entriesLoading}
                  search={search}
                  tagFilter={tagFilter}
                  onTagFilterChange={setTagFilter}
                  onSelectEntry={(entry) =>
                    setView({ mode: "editing", entry })
                  }
                  onDeleteEntry={handleDelete}
                  onToggleFavorite={(id) => {
                    const target = entries.find((entry) => entry.id === id);

                    if (target) {
                      toggleFavorite(id, !target.isFavorited);
                    }
                  }}
                />
              </div>
            </div>
          </main>
        )}
      </div>

      {!isEditing && (
        <button
          type="button"
          onClick={() => setInsightsOpen(true)}
          className="fixed bottom-24 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-600/30 transition hover:scale-105 hover:bg-violet-700 2xl:hidden"
          style={{
            bottom: "max(6rem, calc(env(safe-area-inset-bottom) + 5rem))",
          }}
          aria-label="View insights"
        >
          <TrendingUp className="h-5 w-5" />
        </button>
      )}

      {insightsOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]"
            onClick={() => setInsightsOpen(false)}
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                <TrendingUp className="h-4 w-4 text-violet-500" />
                Your Insights
              </span>

              <button
                type="button"
                onClick={() => setInsightsOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close insights"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <JournalInsights
                entries={entries}
                onOpenMemory={(entry) => {
                  setInsightsOpen(false);
                  setView({ mode: "editing", entry });
                }}
              />
            </div>
          </aside>
        </div>
      )}
    </AppShell>
  );
}
