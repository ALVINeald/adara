"use client";

import { useEffect, useRef, useState } from "react";

import {
  addSavedTherapist,
  getSavedTherapists,
  removeSavedTherapist,
} from "@/lib/therapists";

export interface SavedTherapist {
  id: string;
  userId: string;
  therapistId: string;
  createdAt: string;
}

function mapSaved(data: any[]): SavedTherapist[] {
  return (data ?? []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    therapistId: row.therapist_id,
    createdAt: row.created_at,
  }));
}

export function useSavedTherapists(userId?: string) {
  const [saved, setSaved] = useState<SavedTherapist[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    if (!userId) {
      setSaved([]);
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function load() {
    if (!userId) return;
    if (!hasLoadedOnce.current) setLoading(true);
    try {
      const { data } = await getSavedTherapists(userId);
      setSaved(mapSaved(data ?? []));
    } finally {
      setLoading(false);
      hasLoadedOnce.current = true;
    }
  }

  function isSaved(therapistId: string) {
    return saved.some((s) => s.therapistId === therapistId);
  }

  async function toggleSaved(therapistId: string) {
    if (!userId) return;
    const previous = saved;
    const alreadySaved = isSaved(therapistId);

    if (alreadySaved) {
      setSaved((current) => current.filter((s) => s.therapistId !== therapistId));
      const { error } = await removeSavedTherapist(userId, therapistId);
      if (error) setSaved(previous);
    } else {
      setSaved((current) => [
        {
          id: `optimistic-${therapistId}`,
          userId,
          therapistId,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
      const { error } = await addSavedTherapist(userId, therapistId);
      if (error) setSaved(previous);
      else load();
    }
  }

  return { saved, loading, isSaved, toggleSaved };
}
