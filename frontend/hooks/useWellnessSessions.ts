"use client";

import { useEffect, useRef, useState } from "react";

import { getWellnessSessions, logWellnessSession } from "@/lib/wellness";

export interface WellnessSession {
  id: string;
  sessionType: "breathing" | "meditation";
  exerciseName: string;
  durationSeconds: number;
  completedAt: string;
}

function mapSessions(data: any[]): WellnessSession[] {
  return (data ?? []).map((session: any) => ({
    id: session.id,
    sessionType: session.session_type,
    exerciseName: session.exercise_name,
    durationSeconds: session.duration_seconds,
    completedAt: session.completed_at,
  }));
}

export function useWellnessSessions(userId?: string) {
  const [sessions, setSessions] = useState<WellnessSession[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    if (!userId) {
      setSessions([]);
      setLoading(false);
      return;
    }
    loadSessions();
  }, [userId]);

  async function loadSessions() {
    if (!userId) return;

    if (!hasLoadedOnce.current) {
      setLoading(true);
    }

    try {
      const { data } = await getWellnessSessions(userId);
      setSessions(mapSessions(data ?? []));
    } finally {
      setLoading(false);
      hasLoadedOnce.current = true;
    }
  }

  async function recordSession(
    sessionType: "breathing" | "meditation",
    exerciseName: string,
    durationSeconds: number
  ) {
    if (!userId) return;
    await logWellnessSession(userId, sessionType, exerciseName, durationSeconds);
    await loadSessions();
  }

  return {
    sessions,
    loading,
    recordSession,
  };
}