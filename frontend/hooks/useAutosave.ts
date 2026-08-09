"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SaveState = "idle" | "saving" | "saved" | "error";

interface UseAutosaveOptions {
  /** Idle time after the last change before saving fires. */
  delayMs?: number;
  /** Skip autosave entirely -- used while an entry is first loading. */
  enabled?: boolean;
}

interface UseAutosaveResult {
  saveState: SaveState;
  lastSavedAt: Date | null;
  isDirty: boolean;
  /** Force an immediate save, bypassing the debounce. */
  flush: () => Promise<void>;
}

/**
 * Debounced autosave for the Journal writing canvas. Watches `value`
 * (a plain object/string snapshot of the entry being edited) and
 * calls `onSave` after `delayMs` of no further changes. Exposes a
 * 3-state save indicator (saving / saved / error) rather than a
 * boolean, since a silently-failed save is the worst outcome for a
 * journaling tool -- see the review note on the previous editor
 * having no error state at all.
 */
export function useAutosave<T>(
  value: T,
  onSave: (value: T) => Promise<void>,
  { delayMs = 1500, enabled = true }: UseAutosaveOptions = {}
): UseAutosaveResult {
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestValueRef = useRef(value);
  const savedSnapshotRef = useRef(JSON.stringify(value));
  const onSaveRef = useRef(onSave);
  const isMountedRef = useRef(true);

  onSaveRef.current = onSave;
  latestValueRef.current = value;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const flush = useCallback(async () => {
    const snapshot = JSON.stringify(latestValueRef.current);
    if (snapshot === savedSnapshotRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setSaveState("saving");
    try {
      await onSaveRef.current(latestValueRef.current);
      savedSnapshotRef.current = snapshot;
      if (isMountedRef.current) {
        setSaveState("saved");
        setLastSavedAt(new Date());
        setIsDirty(false);
      }
    } catch {
      if (isMountedRef.current) {
        setSaveState("error");
      }
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const snapshot = JSON.stringify(value);
    if (snapshot === savedSnapshotRef.current) {
      setIsDirty(false);
      return;
    }

    setIsDirty(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      flush();
    }, delayMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delayMs, enabled, flush]);

  // Flush on unmount (navigating away mid-debounce shouldn't drop the
  // last few seconds of typing).
  useEffect(() => {
    return () => {
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { saveState, lastSavedAt, isDirty, flush };
}
