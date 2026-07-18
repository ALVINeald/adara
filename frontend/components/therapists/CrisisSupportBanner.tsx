import { Phone } from "lucide-react";

import { UGANDA_CRISIS_CONTACTS } from "./crisisResources";

export default function CrisisSupportBanner() {
  return (
    <div className="mb-8 rounded-[28px] border border-rose-100 bg-rose-50 p-6">
      <h2 className="text-lg font-semibold text-rose-900">
        Need to talk to someone right now?
      </h2>
      <p className="mt-1 text-sm text-rose-700">
        These are free and confidential. You don't need to wait for an
        appointment.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {UGANDA_CRISIS_CONTACTS.map((contact) => (
          <a
            key={contact.name}
            href={`tel:${contact.number}`}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100">
              <Phone className="h-4 w-4 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {contact.number}
              </p>
              <p className="text-xs text-slate-500">{contact.name}</p>
              {contact.hours && (
                <p className="text-xs text-slate-400">{contact.hours}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}