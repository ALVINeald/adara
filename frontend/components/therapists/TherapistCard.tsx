"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Bookmark } from "lucide-react";

import type { Therapist } from "@/hooks/useTherapists";

interface TherapistCardProps {
  therapist: Therapist;
  alreadyRequested: boolean;
  isSaved: boolean;
  onToggleSaved: () => void;
  onViewProfile: () => void;
  onRequestAppointment: () => void;
}

export default function TherapistCard({
  therapist,
  alreadyRequested,
  isSaved,
  onToggleSaved,
  onViewProfile,
  onRequestAppointment,
}: TherapistCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const initials = therapist.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const showPhoto = therapist.photoUrl && !imageFailed;

  return (
    <motion.div
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.15 }}
      className="flex h-full flex-col rounded-3xl border border-[#E9E8FF] bg-white p-5 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#8B5CF6]">
            {showPhoto ? (
              // Plain <img>, not next/image -- this project's
              // next.config.ts has no remotePatterns configured, and
              // guessing a wildcard domain would defeat next/image's
              // point without knowing the real Storage host. Falls
              // back to initials on load failure either way.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={therapist.photoUrl ?? undefined}
                alt=""
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageFailed(true)}
                className={`h-full w-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            ) : null}
            {!showPhoto || !imageLoaded ? (
              <span className="absolute inset-0 flex items-center justify-center font-semibold text-white">
                {initials}
              </span>
            ) : null}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              {therapist.isVerified && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified
                </span>
              )}
            </div>
            <h3 className="font-semibold text-slate-900">{therapist.name}</h3>
            <p className="text-sm text-slate-500">{therapist.specialty}</p>
            {therapist.yearsExperience !== null && (
              <p className="text-xs text-slate-400">
                {therapist.yearsExperience} years experience
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleSaved}
          aria-pressed={isSaved}
          title={isSaved ? "Remove from saved" : "Save therapist"}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition active:scale-90 ${
            isSaved ? "text-[#8B5CF6]" : "text-slate-300"
          } hover:bg-[#F5F3FF] hover:text-[#8B5CF6]`}
        >
          <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      {therapist.specialties.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {therapist.specialties.slice(0, 3).map((s) => (
            <span
              key={s}
              className="rounded-full bg-[#F5F3FF] px-2.5 py-1 text-xs font-medium text-[#6D28D9]"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
        {therapist.bio}
      </p>

      <div className="mt-auto flex gap-2 pt-4">
        <button
          type="button"
          onClick={onViewProfile}
          className="min-h-[44px] flex-1 rounded-xl border border-[#E9E8FF] bg-white text-sm font-medium text-slate-600 transition hover:bg-slate-50 active:scale-[0.98]"
        >
          View Profile
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
            className="min-h-[44px] flex-1 rounded-xl bg-[#8B5CF6] text-sm font-medium text-white transition hover:bg-[#7C3AED] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            {therapist.acceptingNewClients ? "Request Appointment" : "Not Accepting Clients"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
