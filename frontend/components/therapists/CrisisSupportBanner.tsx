"use client";

import { HeartHandshake, Phone } from "lucide-react";

import { UGANDA_CRISIS_CONTACTS } from "./crisisResources";

interface CrisisSupportBannerProps {
  onViewResources: () => void;
}

export default function CrisisSupportBanner({
  onViewResources,
}: CrisisSupportBannerProps) {
  const primaryContact = UGANDA_CRISIS_CONTACTS[0];

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
