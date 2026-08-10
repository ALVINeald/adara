"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookHeart } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import type { JournalEntry } from "@/hooks/useJournalEntries";

import AppShell from "@/components/navigation/AppShell";
import JournalListPanel from "@/components/journal/JournalListPanel";
import JournalCanvas from "@/components/journal/JournalCanvas";

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

  const [view, setView] = useState<View>({ mode: "list" });

  // If the entry currently open gets updated elsewhere (e.g. a
  // refresh after autosave), keep the canvas pointed at the latest
  // copy rather than a stale snapshot from when it was opened.
  useEffect(() => {
    if (view.mode === "editing" && view.entry) {
      const latest = entries.find((e) => e.id === view.entry!.id);
      if (latest && latest !== view.entry) {
        setView({ mode: "editing", entry: latest });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

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
      <div className="journal-shell-height flex overflow-hidden bg-slate-50">
        {/* List panel: full-width on mobile when in list mode, fixed
            column alongside the canvas from lg upward regardless of
            mode -- this is the "desktop split-pane, mobile full-page
            push" requirement. */}
        <div
          className={`w-full shrink-0 overflow-hidden border-r border-slate-100 bg-white lg:flex lg:w-[380px] ${
            isEditing ? "hidden" : "flex"
          }`}
        >
          <JournalListPanel
            entries={entries}
            selectedEntryId={selectedEntryId}
            loading={entriesLoading}
            onSelectEntry={(entry) => setView({ mode: "editing", entry })}
            onNewEntry={() => setView({ mode: "editing", entry: null })}
            onDeleteEntry={handleDelete}
            onToggleFavorite={(id) => {
              const target = entries.find((e) => e.id === id);
              if (target) toggleFavorite(id, !target.isFavorited);
            }}
          />
        </div>

        {/* Canvas: hidden on mobile until an entry (or "new") is
            selected; always visible from lg upward. */}
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
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-50">
                <BookHeart className="h-6 w-6 text-violet-400" />
              </div>
              <div>
                <p className="font-medium text-slate-600">
                  Select an entry, or write a new one
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Your entries stay private to you.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
