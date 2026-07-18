"use client";

import { useEffect, useRef, useState } from "react";

import {
  createAppointmentRequest,
  getAppointmentRequests,
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

  async function requestAppointment(
    therapistId: string,
    message: string | null
  ) {
    if (!userId) return;
    await createAppointmentRequest(userId, therapistId, message);
    await load();
  }

  return { requests, loading, requestAppointment };
}