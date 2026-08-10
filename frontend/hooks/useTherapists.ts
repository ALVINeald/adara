"use client";

import { useEffect, useState } from "react";

import { getTherapists } from "@/lib/therapists";

export interface Therapist {
  id: string;
  name: string;
  specialty: string;
  specialties: string[];
  bio: string;
  photoUrl: string | null;
  yearsExperience: number | null;
  location: string | null;
  languages: string[];
  sessionTypes: string[];
  acceptingNewClients: boolean;
  isVerified: boolean;
}

// Raw Supabase rows typed as `any` at this one boundary, matching the
// pattern already used across the rest of this codebase's hooks.
function mapTherapists(data: any[]): Therapist[] {
  return (data ?? []).map((t: any) => ({
    id: t.id,
    name: t.name,
    specialty: t.specialty,
    specialties:
      t.specialties && t.specialties.length > 0
        ? t.specialties
        : t.specialty
          ? [t.specialty]
          : [],
    bio: t.bio,
    photoUrl: t.photo_url,
    yearsExperience: t.years_experience ?? null,
    location: t.location ?? null,
    languages: t.languages ?? [],
    sessionTypes: t.session_types ?? [],
    acceptingNewClients: t.accepting_new_clients ?? true,
    isVerified: t.is_verified ?? false,
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
