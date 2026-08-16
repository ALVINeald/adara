"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, X } from "lucide-react";

import TherapistCard from "./TherapistCard";
import TherapistCardSkeleton from "./TherapistCardSkeleton";
import type { Therapist } from "@/hooks/useTherapists";

interface FindMyMatchProps {
  therapists: Therapist[];
  loading: boolean;
  requestedTherapistIds: Set<string>;
  isSaved: (id: string) => boolean;
  onToggleSaved: (id: string) => void;
  onViewProfile: (therapist: Therapist) => void;
  onRequestAppointment: (therapist: Therapist) => void;
  onClose: () => void;
}

type SessionPreference = "online" | "in_person" | "either";
type Priority = "experience" | "accepting" | "none";

const STEP_COUNT = 3;

export default function FindMyMatch({
  therapists,
  loading,
  requestedTherapistIds,
  isSaved,
  onToggleSaved,
  onViewProfile,
  onRequestAppointment,
  onClose,
}: FindMyMatchProps) {
  const prefersReducedMotion = useReducedMotion();

  const [step, setStep] = useState(0);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [sessionPreference, setSessionPreference] = useState<SessionPreference>("either");
  const [priority, setPriority] = useState<Priority>("none");
  const [showResults, setShowResults] = useState(false);

  const availableConcerns = useMemo(() => {
    const set = new Set<string>();
    therapists.forEach((t) => t.specialties.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [therapists]);

  function toggleConcern(concern: string) {
    setConcerns((prev) =>
      prev.includes(concern)
        ? prev.filter((c) => c !== concern)
        : prev.length < 3
          ? [...prev, concern]
          : prev
    );
  }

  const results = useMemo(() => {
    if (!showResults) return [];

    const filtered = therapists.filter((t) => {
      const matchesConcern =
        concerns.length === 0 || concerns.some((c) => t.specialties.includes(c));
      const matchesSession =
        sessionPreference === "either" || t.sessionTypes.includes(sessionPreference);
      return matchesConcern && matchesSession;
    });

    if (priority === "experience") {
      return [...filtered].sort(
        (a, b) => (b.yearsExperience ?? 0) - (a.yearsExperience ?? 0)
      );
    }
    if (priority === "accepting") {
      return [...filtered].sort(
        (a, b) => Number(b.acceptingNewClients) - Number(a.acceptingNewClients)
      );
    }
    return filtered;
  }, [showResults, therapists, concerns, sessionPreference, priority]);

  function goNext() {
    if (step === STEP_COUNT - 1) {
      setShowResults(true);
    } else {
      setStep((s) => s + 1);
    }
  }

  function goBack() {
    if (showResults) {
      setShowResults(false);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  }

  const variants = {
    enter: { x: prefersReducedMotion ? 0 : 24, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: prefersReducedMotion ? 0 : -24, opacity: 0 },
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-title"
    >
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />

      <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E9E8FF] px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F3FF]">
              <Sparkles className="h-4 w-4 text-[#8B5CF6]" />
            </div>
            <h2 id="match-title" className="font-semibold text-slate-900">
              Find My Match
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!showResults && (
          <div className="flex gap-2 px-6 pt-4">
            {Array.from({ length: STEP_COUNT }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i <= step ? "bg-[#8B5CF6]" : "bg-slate-100"
                }`}
              />
            ))}
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto thin-scroll px-6 pb-6 pt-4">
          {!showResults ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
              >
                {step === 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      What would you like support with?
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Pick up to 3, or skip if you're not sure yet.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {availableConcerns.map((concern) => (
                        <button
                          key={concern}
                          type="button"
                          onClick={() => toggleConcern(concern)}
                          className={`min-h-[40px] rounded-full px-3.5 text-sm font-medium transition ${
                            concerns.includes(concern)
                              ? "bg-[#8B5CF6] text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {concern}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      How would you prefer to meet?
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      You can change this later for any specific request.
                    </p>
                    <div className="mt-4 space-y-2">
                      {(
                        [
                          { value: "online", label: "Online" },
                          { value: "in_person", label: "In-person" },
                          { value: "either", label: "Either works" },
                        ] as { value: SessionPreference; label: string }[]
                      ).map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setSessionPreference(option.value)}
                          className={`flex min-h-[44px] w-full items-center rounded-xl border px-4 text-left text-sm font-medium transition ${
                            sessionPreference === option.value
                              ? "border-[#8B5CF6] bg-[#F5F3FF] text-[#6D28D9]"
                              : "border-[#E9E8FF] text-slate-600"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      What matters most to you?
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      This just changes the order we show results in.
                    </p>
                    <div className="mt-4 space-y-2">
                      {(
                        [
                          { value: "experience", label: "More years of experience first" },
                          { value: "accepting", label: "Currently open to new clients first" },
                          { value: "none", label: "No preference" },
                        ] as { value: Priority; label: string }[]
                      ).map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setPriority(option.value)}
                          className={`flex min-h-[44px] w-full items-center rounded-xl border px-4 text-left text-sm font-medium transition ${
                            priority === option.value
                              ? "border-[#8B5CF6] bg-[#F5F3FF] text-[#6D28D9]"
                              : "border-[#E9E8FF] text-slate-600"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {loading
                  ? "Finding therapists..."
                  : results.length > 0
                    ? "Therapists who may be a good fit"
                    : "No matches for that combination"}
              </h3>
              {!loading && results.length === 0 && (
                <p className="mt-1 text-sm text-slate-500">
                  Try widening your session preference, or fewer concerns.
                </p>
              )}
              <div className="mt-4 space-y-4">
                {loading ? (
                  <>
                    <TherapistCardSkeleton />
                    <TherapistCardSkeleton />
                  </>
                ) : (
                  results.map((therapist) => (
                    <TherapistCard
                      key={therapist.id}
                      therapist={therapist}
                      alreadyRequested={requestedTherapistIds.has(therapist.id)}
                      isSaved={isSaved(therapist.id)}
                      onToggleSaved={() => onToggleSaved(therapist.id)}
                      onViewProfile={() => onViewProfile(therapist)}
                      onRequestAppointment={() => onRequestAppointment(therapist)}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-[#E9E8FF] px-6 py-4">
          <button
            type="button"
            onClick={step === 0 && !showResults ? onClose : goBack}
            className="flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 text-sm font-medium text-slate-500 hover:bg-slate-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {step === 0 && !showResults ? "Cancel" : "Back"}
          </button>

          {!showResults && (
            <button
              type="button"
              onClick={goNext}
              className="flex min-h-[44px] items-center gap-1.5 rounded-xl bg-[#8B5CF6] px-6 text-sm font-medium text-white hover:bg-[#7C3AED]"
            >
              {step === STEP_COUNT - 1 ? "Show Matches" : "Continue"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
