"use client";

import { useEffect, useRef, useState } from "react";

import {
  createAppointmentRequest,
  getAppointmentRequests,
  type AppointmentRequestPayload,
} from "@/lib/therapists";

export interface AppointmentRequest {
  id: string;
  therapistId: string;
  message: string | null;
  status: string;
  createdAt: string;
}

function mapRequests(data: any[]): AppointmentRequest[] {
  return (data ?? []).map((r: any) => ({
    id: r.id,
    therapistId: r.therapist_id,
    message: r.message,
    status: r.status,
    createdAt: r.created_at,
  }));
}

export function useAppointmentRequests(userId?: string) {
  const [requests, setRequests] = useState<AppointmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    if (!userId) {
      setRequests([]);
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function load() {
    if (!userId) return;

    if (!hasLoadedOnce.current) {
      setLoading(true);
    }

    try {
      const { data } = await getAppointmentRequests(userId);
      setRequests(mapRequests(data ?? []));
    } finally {
      setLoading(false);
      hasLoadedOnce.current = true;
    }
  }

  async function submitAppointmentRequest(
    payload: AppointmentRequestPayload
  ) {
    if (!userId) throw new Error("Not signed in");
    const { error } = await createAppointmentRequest(userId, payload);
    if (error) throw error;
    await load();
  }

  return { requests, loading, submitAppointmentRequest };
}
