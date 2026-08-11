"use client";

import { useEffect } from "react";
import { CalendarCheck, Lock, ShieldCheck, X } from "lucide-react";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Professional & Verified",
    description: "All therapists are licensed professionals with verified credentials.",
  },
  {
    icon: Lock,
    title: "Confidential & Secure",
    description: "Your information is private, encrypted, and never shared.",
  },
  {
    icon: CalendarCheck,
    title: "Request-Based Appointments",
    description: "You send a request. The therapist responds when available.",
  },
];

interface TherapistAboutModalProps {
  onClose: () => void;
}

export default function TherapistAboutModal({ onClose }: TherapistAboutModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="about-modal-title" className="font-semibold text-slate-900">
            About This Directory
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5">
          {PILLARS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5F3FF]">
                <Icon className="h-4 w-4 text-[#6D28D9]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
