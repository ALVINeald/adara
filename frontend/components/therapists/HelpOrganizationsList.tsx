import { ExternalLink } from "lucide-react";

import { HELP_ORGANIZATIONS } from "./crisisResources";

export default function HelpOrganizationsList() {
  return (
    <div className="mt-10">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Organizations that can help
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {HELP_ORGANIZATIONS.map((org) => (
          <a
            key={org.name}
            href={org.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">{org.name}</h3>
              <ExternalLink className="h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-2 text-sm text-slate-600">{org.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}