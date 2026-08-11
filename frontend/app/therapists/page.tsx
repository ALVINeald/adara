"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Info, X } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useTherapists, type Therapist } from "@/hooks/useTherapists";
import { useAppointmentRequests } from "@/hooks/useAppointmentRequests";
import { useSavedTherapists } from "@/hooks/useSavedTherapists";
import AppShell from "@/components/navigation/AppShell";

import TherapistPager from "@/components/therapists/TherapistPager";
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
import TherapistAboutModal from "@/components/therapists/TherapistAboutModal";

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
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

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
    <AppShell noBottomPadding>
      <div className="therapist-shell-height flex flex-col overflow-hidden bg-[#FAFBFF] lg:flex-row">
        {/* Main column: everything here fits on one screen, no
            vertical scroll -- the therapist grid paginates via swipe
            instead of scrolling. */}
        <div className="flex min-h-0 flex-1 flex-col px-4 pb-24 pt-4 sm:px-6 md:pb-6 lg:px-8 lg:py-6">
          <div className="mb-2 flex shrink-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">
                Therapist Directory
              </h1>
              <p className="truncate text-xs text-slate-500 sm:text-sm">
                {therapistsLoading
                  ? "Loading..."
                  : `${filteredTherapists.length} therapist${
                      filteredTherapists.length === 1 ? "" : "s"
                    } found`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAboutModalOpen(true)}
              aria-label="About this directory"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-white hover:text-slate-600"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>

          <CrisisSupportBanner
            compact
            onViewResources={() => setResourcesModalOpen(true)}
          />

          <TherapistFilters
            therapists={therapists}
            filters={filters}
            onChange={setFilters}
          />

          <TherapistPager
            therapists={filteredTherapists}
            loading={therapistsLoading}
            requestedTherapistIds={requestedTherapistIds}
            isSaved={isSaved}
            onToggleSaved={toggleSaved}
            onViewProfile={setProfileTherapist}
            onRequestAppointment={setWizardTherapist}
          />
        </div>

        {/* Desktop right sidebar -- secondary utility content, scrolls
            independently of the main paginated grid rather than
            competing with it for the "one screen" constraint. */}
        <div className="hidden w-80 shrink-0 space-y-5 overflow-y-auto border-l border-[#E9E8FF] bg-white p-5 lg:block">
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

      <EmergencyFAB onClick={() => setCrisisSheetOpen(true)} />
      <CrisisActionSheet open={crisisSheetOpen} onClose={() => setCrisisSheetOpen(false)} />

      {aboutModalOpen && (
        <TherapistAboutModal onClose={() => setAboutModalOpen(false)} />
      )}

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
