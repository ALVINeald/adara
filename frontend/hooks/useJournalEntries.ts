"use client";

import { useEffect, useRef, useState } from "react";

import {
  createJournalEntry,
  getJournalEntries,
  setJournalEntryFavorited,
  softDeleteJournalEntry,
  updateJournalEntry,
  type JournalEntryPayload,
} from "@/lib/journal";

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string; // HTML
  moodLevel: number | null;
  energyLevel: number | null;
  stressLevel: number | null;
  tags: string[];
  isPrivate: boolean;
  isFavorited: boolean;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

// Raw Supabase rows are typed as `any` at this one boundary -- see the
// review note on this pattern repeating across hooks; tracked
// separately from this change, not fixed here to keep this diff
// scoped to the Journal feature itself.
function mapEntries(data: any[]): JournalEntry[] {
  return (data ?? []).map((entry: any) => ({
    id: entry.id,
    userId: entry.user_id,
    title: entry.title,
    content: entry.content,
    moodLevel: entry.mood_level,
    energyLevel: entry.energy_level,
    stressLevel: entry.stress_level,
    tags: entry.tags ?? [],
    isPrivate: entry.is_private ?? true,
    isFavorited: entry.is_favorited ?? false,
    wordCount: entry.word_count ?? 0,
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
  }));
}

export function useJournalEntries(userId?: string) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    if (!userId) {
      setEntries([]);
      setLoading(false);
      return;
    }

    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function loadEntries() {
    if (!userId) return;

    if (!hasLoadedOnce.current) {
      setLoading(true);
    }

    try {
      const { data } = await getJournalEntries(userId);
      setEntries(mapEntries(data ?? []));
    } finally {
      setLoading(false);
      hasLoadedOnce.current = true;
    }
  }

  async function saveNewEntry(payload: JournalEntryPayload) {
    if (!userId) return null;

    const { data, error } = await createJournalEntry(userId, payload);
    if (error) throw error;

    await loadEntries();
    return data;
  }

  async function saveExistingEntry(id: string, payload: JournalEntryPayload) {
    const { error } = await updateJournalEntry(id, payload);
    if (error) throw error;

    await loadEntries();
  }

  async function removeEntry(id: string) {
    const previous = entries;
    // Optimistic removal -- the list shouldn't wait on a round trip
    // to reflect a delete the user already confirmed.
    setEntries((current) => current.filter((entry) => entry.id !== id));

    const { error } = await softDeleteJournalEntry(id);
    if (error) {
      // Roll back on failure rather than silently losing the entry
      // from view while it's still very much in the database.
      setEntries(previous);
      throw error;
    }
  }

  async function toggleFavorite(id: string, isFavorited: boolean) {
    const previous = entries;
    setEntries((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, isFavorited } : entry
      )
    );

    const { error } = await setJournalEntryFavorited(id, isFavorited);
    if (error) {
      setEntries(previous);
      throw error;
    }
  }

  return {
    entries,
    loading,
    saveNewEntry,
    saveExistingEntry,
    removeEntry,
    toggleFavorite,
    refresh: loadEntries,
  };
}
