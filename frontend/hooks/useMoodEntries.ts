"use client";

import { useEffect, useRef, useState } from "react";

import { getMoodEntries, upsertMoodEntry } from "@/lib/moods";

export interface MoodEntry {
  id: string;
  userId: string;
  entryDate: string; // "YYYY-MM-DD"
  moodLevel: number;
  note: string | null;
}

function mapEntries(data: any[]): MoodEntry[] {
  return (data ?? []).map((entry: any) => ({
    id: entry.id,
    userId: entry.user_id,
    entryDate: entry.entry_date,
    moodLevel: entry.mood_level,
    note: entry.note,
  }));
}

const DAYS_OF_HISTORY = 182; // ~6 months

function getSinceDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - DAYS_OF_HISTORY);
  return date.toISOString().slice(0, 10);
}

export function useMoodEntries(userId?: string) {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
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
      const { data } = await getMoodEntries(userId, getSinceDate());
      setEntries(mapEntries(data ?? []));
    } finally {
      setLoading(false);
      hasLoadedOnce.current = true;
    }
  }

  async function saveMoodEntry(
    entryDate: string,
    moodLevel: number,
    note: string | null
  ) {
    if (!userId) return;

    await upsertMoodEntry(userId, entryDate, moodLevel, note);
    await loadEntries();
  }

  return {
    entries,
    loading,
    saveMoodEntry,
  };
}