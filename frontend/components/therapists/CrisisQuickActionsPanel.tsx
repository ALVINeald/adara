"use client";

import { HeartHandshake, Phone } from "lucide-react";

import { UGANDA_CRISIS_CONTACTS } from "./crisisResources";

export default function CrisisQuickActionsPanel() {
  return (
    <div className="rounded-3xl border border-[#E9E8FF] bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <HeartHandshake className="h-4 w-4 text-red-600" />
        <h2 className="font-semibold text-slate-900">Crisis Support</h2>
      </div>

      <div className="space-y-3">
        {UGANDA_CRISIS_CONTACTS.map((contact) => (
          <a
            key={contact.name}
            href={`tel:${contact.number}`}
            className="flex items-center justify-between gap-2 rounded-2xl bg-red-50 p-3 transition hover:bg-red-100"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                {contact.name}
              </p>
              {contact.hours && (
                <p className="text-xs text-slate-500">{contact.hours}</p>
              )}
              <p className="text-sm font-semibold text-red-700">{contact.number}</p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
              <Phone className="h-3.5 w-3.5" fill="currentColor" />
            </div>
          </a>
        ))}
      </div>

      <a
        href="#help-organizations"
        className="mt-4 block rounded-xl bg-[#F5F3FF] px-3 py-2 text-center text-sm font-medium text-[#6D28D9] hover:bg-[#EDE9FE]"
      >
        View All Crisis Resources
      </a>
    </div>
  );
}
