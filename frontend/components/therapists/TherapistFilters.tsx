"use client";

import { useMemo, useState } from "react";
import { Filter, Search, X } from "lucide-react";

import type { Therapist } from "@/hooks/useTherapists";

export interface TherapistFilterState {
  search: string;
  specialty: string | null;
  sessionType: string | null;
  acceptingOnly: boolean;
}

interface TherapistFiltersProps {
  therapists: Therapist[];
  filters: TherapistFilterState;
  onChange: (filters: TherapistFilterState) => void;
}

const SESSION_TYPE_LABELS: Record<string, string> = {
  online: "Online",
  in_person: "In-person",
};

export default function TherapistFilters({
  therapists,
  filters,
  onChange,
}: TherapistFiltersProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const specialties = useMemo(() => {
    const set = new Set<string>();
    therapists.forEach((t) => t.specialties.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [therapists]);

  const sessionTypes = useMemo(() => {
    const set = new Set<string>();
    therapists.forEach((t) => t.sessionTypes.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [therapists]);

  const activeCount =
    (filters.specialty ? 1 : 0) +
    (filters.sessionType ? 1 : 0) +
    (filters.acceptingOnly ? 1 : 0);

  function update(partial: Partial<TherapistFilterState>) {
    onChange({ ...filters, ...partial });
  }

  function clearAll() {
    onChange({ search: filters.search, specialty: null, sessionType: null, acceptingOnly: false });
  }

  return (
    <div className="mb-3 flex shrink-0 items-center gap-2">
      <div className="flex min-h-[44px] flex-1 items-center gap-2 rounded-2xl border border-[#E9E8FF] bg-white px-4">
        <Search className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          placeholder="Search by name, specialty or keyword..."
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          className={`flex min-h-[44px] items-center gap-1.5 rounded-2xl border px-4 text-sm font-medium transition ${
            activeCount > 0
              ? "border-[#8B5CF6] bg-[#F5F3FF] text-[#6D28D9]"
              : "border-[#E9E8FF] bg-white text-slate-600"
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          Filters
          {activeCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#8B5CF6] text-[10px] text-white">
              {activeCount}
            </span>
          )}
        </button>

        {filtersOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setFiltersOpen(false)} />
            <div className="absolute right-0 top-full z-20 mt-2 w-72 max-w-[calc(100vw-2.5rem)] rounded-2xl border border-slate-100 bg-white p-4 shadow-lg">
              {specialties.length > 0 && (
                <>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Specialization
                  </p>
                  <div className="mb-4 flex max-h-40 flex-wrap gap-1.5 overflow-y-auto">
                    {specialties.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          update({ specialty: filters.specialty === s ? null : s })
                        }
                        className={`rounded-full px-2.5 py-1.5 text-xs font-medium transition ${
                          filters.specialty === s
                            ? "bg-[#8B5CF6] text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {sessionTypes.length > 0 && (
                <>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Session Type
                  </p>
                  <div className="mb-4 flex gap-1.5">
                    {sessionTypes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          update({ sessionType: filters.sessionType === s ? null : s })
                        }
                        className={`rounded-full px-2.5 py-1.5 text-xs font-medium transition ${
                          filters.sessionType === s
                            ? "bg-[#8B5CF6] text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {SESSION_TYPE_LABELS[s] ?? s}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={() => update({ acceptingOnly: !filters.acceptingOnly })}
                className={`flex min-h-[40px] w-full items-center justify-between rounded-xl border px-3 text-sm font-medium transition ${
                  filters.acceptingOnly
                    ? "border-[#8B5CF6] bg-[#F5F3FF] text-[#6D28D9]"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                Accepting New Clients
                <span
                  className={`h-4 w-4 rounded border ${
                    filters.acceptingOnly
                      ? "border-[#8B5CF6] bg-[#8B5CF6]"
                      : "border-slate-300"
                  }`}
                />
              </button>

              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear all filters
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
