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

const insightsAnimation = `
          @keyframes insightsIn {
            from { opacity: 0; transform: translateY(10px) scale(.985); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `;

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

      {!isEditing && <style>{insightsAnimation}</style>}

      {!isEditing && (
        <button
          type="button"
          onClick={() => setInsightsOpen(true)}
          className="group fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-white/75 text-violet-600 shadow-[0_14px_40px_rgba(91,45,180,0.24)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-violet-200/70"
          aria-label="Open your insights"
          title="Your insights"
        >
          <span className="absolute inset-0 rounded-full bg-violet-400/10 opacity-0 blur-md transition group-hover:opacity-100" />
          <TrendingUp className="relative h-5 w-5" />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-violet-500" />
        </button>
      )}

      {insightsOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-xl transition-opacity duration-300"
            onClick={() => setInsightsOpen(false)}
            aria-hidden="true"
          />

          <div className="relative flex min-h-full items-center justify-center p-5 sm:p-8">
            <aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="journal-insights-title"
              className="relative flex max-h-[min(82vh,760px)] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/65 shadow-[0_30px_100px_rgba(31,20,70,0.28)] backdrop-blur-2xl backdrop-saturate-150 animate-[insightsIn_.28s_ease-out]"
            >
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-300/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-fuchsia-200/20 blur-3xl" />

              <div className="relative flex items-center justify-between border-b border-white/60 bg-white/30 px-5 py-4 sm:px-7">
                <div>
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
                    <TrendingUp className="h-4 w-4" />
                    Journal intelligence
                  </span>
                  <h2 id="journal-insights-title" className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
                    Your Insights
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Gentle patterns from your reflections, not judgments.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setInsightsOpen(false)}
                  className="rounded-full border border-white/70 bg-white/70 p-2 text-slate-500 shadow-sm backdrop-blur transition hover:bg-white hover:text-slate-900"
                  aria-label="Close insights"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
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
        </div>
      )}
    </AppShell>
  );
}
