"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, BadgeCheck, Bookmark, Share2 } from "lucide-react";

import type { Therapist } from "@/hooks/useTherapists";

interface TherapistProfileSheetProps {
  therapist: Therapist;
  isSaved: boolean;
  alreadyRequested: boolean;
  onToggleSaved: () => void;
  onClose: () => void;
  onRequestAppointment: () => void;
}

const SESSION_TYPE_LABELS: Record<string, string> = {
  online: "Online",
  in_person: "In-person",
};

export default function TherapistProfileSheet({
  therapist,
  isSaved,
  alreadyRequested,
  onToggleSaved,
  onClose,
  onRequestAppointment,
}: TherapistProfileSheetProps) {
  const prefersReducedMotion = useReducedMotion();
  const [tab, setTab] = useState<"about" | "details">("about");
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const [imageFailed, setImageFailed] = useState(false);

  // Pops centered on every breakpoint -- Escape closes it, matching
  // standard modal expectations now that it's no longer a bottom
  // sheet with its own drag-to-dismiss gesture.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const initials = therapist.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleShare() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/therapists?therapist=${therapist.id}`
        : "";

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: therapist.name, url });
        return;
      } catch {
        return;
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 2000);
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-sheet-title"
    >
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />

      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
        transition={
          prefersReducedMotion ? { duration: 0.12 } : { type: "spring", damping: 24, stiffness: 340 }
        }
        className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 pt-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h2 id="profile-sheet-title" className="text-sm font-semibold text-slate-500">
            Therapist Profile
          </h2>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
          {shareState === "copied" && (
            <p className="mb-2 text-center text-xs font-medium text-emerald-600">
              Link copied
            </p>
          )}

          <div className="flex flex-col items-center pt-2 text-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-[#8B5CF6]">
              {therapist.photoUrl && !imageFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={therapist.photoUrl}
                  alt=""
                  onError={() => setImageFailed(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-white">
                  {initials}
                </span>
              )}
            </div>

            {therapist.isVerified && (
              <span className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-600">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            )}
            <h1 className="mt-1 text-xl font-bold text-slate-900">{therapist.name}</h1>
            <p className="text-sm text-slate-500">{therapist.specialty}</p>
            {therapist.yearsExperience !== null && (
              <p className="text-xs text-slate-400">
                {therapist.yearsExperience} years experience
              </p>
            )}

            {therapist.specialties.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {therapist.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-[#F5F3FF] px-2.5 py-1 text-xs font-medium text-[#6D28D9]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-2 border-b border-slate-100">
            {(["about", "details"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`min-h-[44px] flex-1 border-b-2 text-sm font-medium capitalize transition ${
                  tab === t
                    ? "border-[#8B5CF6] text-[#6D28D9]"
                    : "border-transparent text-slate-400"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="py-5">
            {tab === "about" ? (
              <p className="text-sm leading-7 text-slate-600">{therapist.bio}</p>
            ) : (
              <div className="space-y-4 text-sm">
                {therapist.location && (
                  <div>
                    <p className="font-medium text-slate-700">Location</p>
                    <p className="text-slate-500">{therapist.location}</p>
                  </div>
                )}
                {therapist.sessionTypes.length > 0 && (
                  <div>
                    <p className="font-medium text-slate-700">Session Types</p>
                    <p className="text-slate-500">
                      {therapist.sessionTypes
                        .map((s) => SESSION_TYPE_LABELS[s] ?? s)
                        .join(", ")}
                    </p>
                  </div>
                )}
                {therapist.languages.length > 0 && (
                  <div>
                    <p className="font-medium text-slate-700">Languages</p>
                    <p className="text-slate-500">{therapist.languages.join(", ")}</p>
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-700">Availability</p>
                  <p className="text-slate-500">
                    {therapist.acceptingNewClients
                      ? "Accepting new clients"
                      : "Not currently accepting new clients"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-2 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onToggleSaved}
            aria-pressed={isSaved}
            className={`flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border text-sm font-medium transition ${
              isSaved
                ? "border-[#8B5CF6] bg-[#F5F3FF] text-[#6D28D9]"
                : "border-slate-200 text-slate-600"
            }`}
          >
            <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
            Save
          </button>
          {alreadyRequested ? (
            <div className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-[#F5F3FF] text-sm font-medium text-[#6D28D9]">
              Requested
            </div>
          ) : (
            <button
              type="button"
              onClick={onRequestAppointment}
              disabled={!therapist.acceptingNewClients}
              className="min-h-[44px] flex-[2] rounded-xl bg-[#8B5CF6] text-sm font-medium text-white transition hover:bg-[#7C3AED] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              {therapist.acceptingNewClients ? "Request Appointment" : "Not Accepting Clients"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
