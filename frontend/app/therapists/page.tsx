"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useTherapists, type Therapist } from "@/hooks/useTherapists";
import { useAppointmentRequests } from "@/hooks/useAppointmentRequests";
import { useSavedTherapists } from "@/hooks/useSavedTherapists";
import AppShell from "@/components/navigation/AppShell";

import TherapistCard from "@/components/therapists/TherapistCard";
import TherapistCardSkeleton from "@/components/therapists/TherapistCardSkeleton";
import TherapistFilters, {
  type TherapistFilterState,
} from "@/components/therapists/TherapistFilters";
import CrisisSupportBanner from "@/components/therapists/CrisisSupportBanner";
import CrisisQuickActionsPanel from "@/components/therapists/CrisisQuickActionsPanel";
import CrisisActionSheet from "@/components/therapists/CrisisActionSheet";
import EmergencyFAB from "@/components/therapists/EmergencyFAB";
import HelpOrganizationsList from "@/components/therapists/HelpOrganizationsList";
import AppointmentSummaryCard from "@/components/therapists/AppointmentSummaryCard";
import SavedTherapistsCard from "@/components/therapists/SavedTherapistsCard";
import TherapistProfileSheet from "@/components/therapists/TherapistProfileSheet";
import AppointmentWizard from "@/components/therapists/AppointmentWizard";
import TrustFooter from "@/components/therapists/TrustFooter";

const EMPTY_FILTERS: TherapistFilterState = {
  search: "",
  specialty: null,
  sessionType: null,
  acceptingOnly: false,
};

export default function TherapistsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth/login");
    }
  }, [authLoading, user, router]);

  const { therapists, loading: therapistsLoading } = useTherapists();
  const { requests, submitAppointmentRequest } = useAppointmentRequests(user?.id);
  const { saved, isSaved, toggleSaved } = useSavedTherapists(user?.id);

  const [filters, setFilters] = useState<TherapistFilterState>(EMPTY_FILTERS);
  const [profileTherapist, setProfileTherapist] = useState<Therapist | null>(null);
  const [wizardTherapist, setWizardTherapist] = useState<Therapist | null>(null);
  const [crisisSheetOpen, setCrisisSheetOpen] = useState(false);
  const [resourcesModalOpen, setResourcesModalOpen] = useState(false);

  const requestedTherapistIds = useMemo(
    () => new Set(requests.map((r) => r.therapistId)),
    [requests]
  );

  const filteredTherapists = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return therapists.filter((t) => {
      const matchesSearch =
        !query ||
        t.name.toLowerCase().includes(query) ||
        t.specialty.toLowerCase().includes(query) ||
        t.specialties.some((s) => s.toLowerCase().includes(query));
      const matchesSpecialty =
        !filters.specialty || t.specialties.includes(filters.specialty);
      const matchesSessionType =
        !filters.sessionType || t.sessionTypes.includes(filters.sessionType);
      const matchesAccepting = !filters.acceptingOnly || t.acceptingNewClients;

      return matchesSearch && matchesSpecialty && matchesSessionType && matchesAccepting;
    });
  }, [therapists, filters]);

  if (authLoading) {
    return (
      <AppShell>
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="text-slate-500">Loading...</p>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main className="min-h-screen bg-[#FAFBFF] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px] lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Therapist Directory
            </h1>
            <p className="mb-6 mt-1 text-sm text-slate-500">
              Find qualified, compassionate professionals who can support your
              journey.
            </p>

            <CrisisSupportBanner
              onViewResources={() => setResourcesModalOpen(true)}
            />

            <TherapistFilters
              therapists={therapists}
              filters={filters}
              onChange={setFilters}
            />

            <p className="mb-3 text-sm text-slate-500">
              {therapistsLoading
                ? "Loading therapists..."
                : `${filteredTherapists.length} therapist${
                    filteredTherapists.length === 1 ? "" : "s"
                  } found`}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {therapistsLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TherapistCardSkeleton key={i} />
                  ))
                : filteredTherapists.map((therapist) => (
                    <TherapistCard
                      key={therapist.id}
                      therapist={therapist}
                      alreadyRequested={requestedTherapistIds.has(therapist.id)}
                      isSaved={isSaved(therapist.id)}
                      onToggleSaved={() => toggleSaved(therapist.id)}
                      onViewProfile={() => setProfileTherapist(therapist)}
                      onRequestAppointment={() => setWizardTherapist(therapist)}
                    />
                  ))}
            </div>

            {!therapistsLoading && filteredTherapists.length === 0 && (
              <p className="py-12 text-center text-sm text-slate-400">
                No therapists match your filters right now.
              </p>
            )}

            <TrustFooter />
          </div>

          {/* Desktop right sidebar */}
          <div className="mt-8 hidden space-y-5 lg:mt-0 lg:block">
            <CrisisQuickActionsPanel />
            <AppointmentSummaryCard requests={requests} therapists={therapists} />
            <SavedTherapistsCard
              saved={saved}
              therapists={therapists}
              onSelectTherapist={setProfileTherapist}
            />
            <div className="rounded-3xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] p-5 text-white">
              <p className="text-sm leading-6">
                &ldquo;The first step to healing is reaching out. You&apos;ve
                already taken it.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile-only emergency FAB */}
      <EmergencyFAB onClick={() => setCrisisSheetOpen(true)} />

      <CrisisActionSheet open={crisisSheetOpen} onClose={() => setCrisisSheetOpen(false)} />

      {resourcesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setResourcesModalOpen(false)}
          />
          <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="font-semibold text-slate-900">Crisis Resources</h2>
              <button
                type="button"
                onClick={() => setResourcesModalOpen(false)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 py-4">
              <HelpOrganizationsList />
            </div>
          </div>
        </div>
      )}

      {profileTherapist && (
        <TherapistProfileSheet
          therapist={profileTherapist}
          isSaved={isSaved(profileTherapist.id)}
          alreadyRequested={requestedTherapistIds.has(profileTherapist.id)}
          onToggleSaved={() => toggleSaved(profileTherapist.id)}
          onClose={() => setProfileTherapist(null)}
          onRequestAppointment={() => {
            setWizardTherapist(profileTherapist);
            setProfileTherapist(null);
          }}
        />
      )}

      {wizardTherapist && (
        <AppointmentWizard
          therapist={wizardTherapist}
          onClose={() => setWizardTherapist(null)}
          onSubmit={async (payload) => {
            await submitAppointmentRequest(payload);
          }}
        />
      )}
    </AppShell>
  );
}
