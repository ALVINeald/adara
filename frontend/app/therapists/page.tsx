"use client";

import { useMemo, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useTherapists } from "@/hooks/useTherapists";
import { useAppointmentRequests } from "@/hooks/useAppointmentRequests";
import TherapistCard from "@/components/therapists/TherapistCard";
import CrisisSupportBanner from "@/components/therapists/CrisisSupportBanner";
import HelpOrganizationsList from "@/components/therapists/HelpOrganizationsList";

export default function TherapistsPage() {
  const { user, loading: authLoading } = useAuth();
  const { therapists, loading: therapistsLoading } = useTherapists();
  const { requests, requestAppointment } = useAppointmentRequests(user?.id);

  const [specialtyFilter, setSpecialtyFilter] = useState<string | null>(null);

  const specialties = useMemo(() => {
    return Array.from(new Set(therapists.map((t) => t.specialty)));
  }, [therapists]);

  const filteredTherapists = useMemo(() => {
    if (!specialtyFilter) return therapists;
    return therapists.filter((t) => t.specialty === specialtyFilter);
  }, [therapists, specialtyFilter]);

  if (authLoading || therapistsLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </main>
    );
  }

  const requestedTherapistIds = new Set(
    requests.map((request) => request.therapistId)
  );

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)] p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">
          Find Support
        </h1>
        <p className="mb-6 text-sm text-slate-600">
          Reaching out is often the hardest part — and you've just done it
          by being here. Browse professionals below, or use one of the free
          helplines if you need to talk to someone today.
        </p>

        <CrisisSupportBanner />

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSpecialtyFilter(null)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              specialtyFilter === null
                ? "bg-cyan-600 text-white"
                : "bg-white text-slate-600 hover:bg-cyan-50"
            }`}
          >
            All
          </button>
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSpecialtyFilter(specialty)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                specialtyFilter === specialty
                  ? "bg-cyan-600 text-white"
                  : "bg-white text-slate-600 hover:bg-cyan-50"
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>

        <p className="mb-4 text-xs text-slate-400">
          A request doesn't confirm a booking — someone will follow up with
          you.
        </p>

        <div className="space-y-4">
          {filteredTherapists.map((therapist) => (
            <TherapistCard
              key={therapist.id}
              therapist={therapist}
              alreadyRequested={requestedTherapistIds.has(therapist.id)}
              onRequest={(message) =>
                requestAppointment(therapist.id, message)
              }
            />
          ))}
        </div>

        <HelpOrganizationsList />
      </div>
    </main>
  );
}