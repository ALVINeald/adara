"use client";

import { ChevronRight, HeartHandshake, Phone } from "lucide-react";

import { UGANDA_CRISIS_CONTACTS } from "./crisisResources";

interface CrisisSupportBannerProps {
  onViewResources: () => void;
  /** Slim single-row bar instead of the full descriptive card --
   * used on the redesigned directory page, where vertical space is
   * deliberately constrained to fit everything on one screen. */
  compact?: boolean;
}

export default function CrisisSupportBanner({
  onViewResources,
  compact = false,
}: CrisisSupportBannerProps) {
  const primaryContact = UGANDA_CRISIS_CONTACTS[0];

  if (compact) {
    return (
      <button
        type="button"
        onClick={onViewResources}
        className="mb-3 flex min-h-[44px] w-full shrink-0 items-center gap-2 rounded-2xl border border-red-100 bg-[#FEF2F2] px-4 py-2.5 text-left transition hover:bg-red-100"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
          <HeartHandshake className="h-4 w-4 text-red-600" />
        </div>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
          Need immediate support? Help is available now.
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-red-400" />
      </button>
    );
  }

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-red-100 bg-[#FEF2F2] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100">
          <HeartHandshake className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">
            Need immediate support?
          </h2>
          <p className="mt-0.5 text-sm text-slate-600">
            If you are in crisis or feeling unsafe, help is available right
            now.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={onViewResources}
          className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 sm:flex-none"
        >
          View Crisis Resources
        </button>
        <a
          href={`tel:${primaryContact.number}`}
          className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 text-sm font-medium text-red-700 transition hover:bg-red-50 sm:flex-none"
        >
          <Phone className="h-3.5 w-3.5" />
          Call Now
        </a>
      </div>
    </div>
  );
}
