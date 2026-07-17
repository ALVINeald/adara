"use client";

import { useEffect, useRef, useState } from "react";

import {
  createJournalEntry,
  deleteJournalEntry,
  getJournalEntries,
  updateJournalEntry,
} from "@/lib/journal";

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string; // HTML
  moodLevel: number | null;
  createdAt: string;
  updatedAt: string;
}

function mapEntries(data: any[]): JournalEntry[] {
  return (data ?? []).map((entry: any) => ({
    id: entry.id,
    userId: entry.user_id,
    title: entry.title,
    content: entry.content,
    moodLevel: entry.mood_level,
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

  async function saveNewEntry(
    title: string,
    content: string,
    moodLevel: number | null
  ) {
    if (!userId) return null;

    const { data } = await createJournalEntry(
      userId,
      title,
      content,
      moodLevel
    );
    await loadEntries();
    return data;
  }

  async function saveExistingEntry(
    id: string,
    title: string,
    content: string,
    moodLevel: number | null
  ) {
    await updateJournalEntry(id, title, content, moodLevel);
    await loadEntries();
  }

  async function removeEntry(id: string) {
    await deleteJournalEntry(id);
    setEntries((previous) => previous.filter((entry) => entry.id !== id));
  }

  return {
    entries,
    loading,
    saveNewEntry,
    saveExistingEntry,
    removeEntry,
  };
}