"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import type { JournalEntry } from "@/hooks/useJournalEntries";

import JournalEditor from "@/components/journal/JournalEditor";
import JournalEntryCard from "@/components/journal/JournalEntryCard";
import { MOOD_SCALE } from "@/components/mood/moodScale";

type ViewState =
  | { mode: "list" }
  | { mode: "new" }
  | { mode: "edit"; entry: JournalEntry };

export default function JournalPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    entries,
    loading: entriesLoading,
    saveNewEntry,
    saveExistingEntry,
    removeEntry,
  } = useJournalEntries(user?.id);

  const [view, setView] = useState<ViewState>({ mode: "list" });
  const [search, setSearch] = useState("");
  const [moodFilter, setMoodFilter] = useState<number | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        !search.trim() ||
        entry.title.toLowerCase().includes(search.toLowerCase()) ||
        entry.content.toLowerCase().includes(search.toLowerCase());

      const matchesMood =
        moodFilter === null || entry.moodLevel === moodFilter;

      const entryDate = entry.createdAt.slice(0, 10);
      const matchesFrom = !dateFrom || entryDate >= dateFrom;
      const matchesTo = !dateTo || entryDate <= dateTo;

      return matchesSearch && matchesMood && matchesFrom && matchesTo;
    });
  }, [entries, search, moodFilter, dateFrom, dateTo]);

  if (authLoading || entriesLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)] p-6">
      <div className="mx-auto max-w-4xl">

        {view.mode === "list" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900">Journal</h1>

              <button
                onClick={() => setView({ mode: "new" })}
                className="flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-medium text-white transition hover:bg-cyan-700"
              >
                <Plus className="h-4 w-4" />
                New Entry
              </button>
            </div>

            <div className="mb-6 rounded-[28px] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                />
                <span className="text-sm text-slate-400">to</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                />

                <div className="ml-auto flex items-center gap-1">
                  {MOOD_SCALE.map((option) => (
                    <button
                      key={option.level}
                      type="button"
                      onClick={() =>
                        setMoodFilter(
                          moodFilter === option.level ? null : option.level
                        )
                      }
                      title={option.label}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition ${
                        moodFilter === option.level
                          ? "bg-cyan-100 ring-2 ring-cyan-500"
                          : "hover:bg-slate-100"
                      }`}
                    >
                      {option.emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredEntries.length === 0 ? (
              <p className="px-2 text-sm text-slate-500">No entries found.</p>
            ) : (
              <div className="space-y-3">
                {filteredEntries.map((entry) => (
                  <JournalEntryCard
                    key={entry.id}
                    entry={entry}
                    onOpen={() => setView({ mode: "edit", entry })}
                    onDelete={() => removeEntry(entry.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {view.mode === "new" && (
          <JournalEditor
            onSave={async (title, content, moodLevel) => {
              await saveNewEntry(title, content, moodLevel);
              setView({ mode: "list" });
            }}
            onCancel={() => setView({ mode: "list" })}
          />
        )}

        {view.mode === "edit" && (
          <JournalEditor
            entry={view.entry}
            onSave={async (title, content, moodLevel) => {
              await saveExistingEntry(
                view.entry.id,
                title,
                content,
                moodLevel
              );
              setView({ mode: "list" });
            }}
            onCancel={() => setView({ mode: "list" })}
          />
        )}

      </div>
    </main>
  );
}