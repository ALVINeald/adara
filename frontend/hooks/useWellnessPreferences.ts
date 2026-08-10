"use client";

import { useEffect, useState } from "react";

import { getWellnessPreferences, upsertWellnessPreferences } from "@/lib/wellness";
import type { BreathingPhase, WellnessPreferences } from "@/types/wellness";

function mapPreferences(row: any): WellnessPreferences {
  return {
    breathingPatternId: row?.breathing_pattern_id ?? null,
    breathingCycles: row?.breathing_cycles ?? null,
    breathingCustomPhases: row?.breathing_custom_phases ?? null,
  };
}

const DEFAULT_PREFERENCES: WellnessPreferences = {
  breathingPatternId: null,
  breathingCycles: null,
  breathingCustomPhases: null,
};

export function useWellnessPreferences(userId?: string) {
  const [preferences, setPreferences] = useState<WellnessPreferences>(
    DEFAULT_PREFERENCES
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setPreferences(DEFAULT_PREFERENCES);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getWellnessPreferences(userId).then(({ data }) => {
      if (cancelled) return;
      setPreferences(data ? mapPreferences(data) : DEFAULT_PREFERENCES);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function saveBreathingPreference(
    patternId: string,
    cycles: number,
    customPhases: BreathingPhase[] | null
  ) {
    if (!userId) return;

    setPreferences((prev) => ({
      ...prev,
      breathingPatternId: patternId,
      breathingCycles: cycles,
      breathingCustomPhases: customPhases,
    }));

    await upsertWellnessPreferences(userId, {
      breathing_pattern_id: patternId,
      breathing_cycles: cycles,
      breathing_custom_phases: customPhases,
    });
  }

  return { preferences, loading, saveBreathingPreference };
}
