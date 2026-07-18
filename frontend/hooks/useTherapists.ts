"use client";

import { useEffect, useState } from "react";

import { getTherapists } from "@/lib/therapists";

export interface Therapist {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  photoUrl: string | null;
}

function mapTherapists(data: any[]): Therapist[] {
  return (data ?? []).map((t: any) => ({
    id: t.id,
    name: t.name,
    specialty: t.specialty,
    bio: t.bio,
    photoUrl: t.photo_url,
  }));
}

export function useTherapists() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const { data } = await getTherapists();
      setTherapists(mapTherapists(data ?? []));
    } finally {
      setLoading(false);
    }
  }

  return { therapists, loading };
}