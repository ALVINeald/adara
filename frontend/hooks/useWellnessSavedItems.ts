"use client";

import { useEffect, useRef, useState } from "react";

import {
  addSavedWellnessItem,
  getSavedWellnessItems,
  removeSavedWellnessItem,
} from "@/lib/wellness";
import type { SavedItemType, SavedWellnessItem } from "@/types/wellness";

function mapItems(data: any[]): SavedWellnessItem[] {
  return (data ?? []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    itemType: row.item_type,
    itemId: row.item_id,
    createdAt: row.created_at,
  }));
}

export function useWellnessSavedItems(userId?: string) {
  const [items, setItems] = useState<SavedWellnessItem[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    if (!userId) {
      setItems([]);
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
      const { data } = await getSavedWellnessItems(userId);
      setItems(mapItems(data ?? []));
    } finally {
      setLoading(false);
      hasLoadedOnce.current = true;
    }
  }

  function isSaved(itemType: SavedItemType, itemId: string) {
    return items.some(
      (item) => item.itemType === itemType && item.itemId === itemId
    );
  }

  async function toggleSaved(itemType: SavedItemType, itemId: string) {
    if (!userId) return;

    const alreadySaved = isSaved(itemType, itemId);
    const previous = items;

    // Optimistic toggle -- a save button that waits on a round trip
    // before showing feedback feels broken.
    if (alreadySaved) {
      setItems((current) =>
        current.filter(
          (item) => !(item.itemType === itemType && item.itemId === itemId)
        )
      );
      const { error } = await removeSavedWellnessItem(userId, itemType, itemId);
      if (error) setItems(previous);
    } else {
      setItems((current) => [
        {
          id: `optimistic-${itemType}-${itemId}`,
          userId,
          itemType,
          itemId,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
      const { error } = await addSavedWellnessItem(userId, itemType, itemId);
      if (error) setItems(previous);
      else load(); // pick up the real id from the server
    }
  }

  return { items, loading, isSaved, toggleSaved };
}
