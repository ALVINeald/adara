"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

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
  const [specialtyOpen, setSpecialtyOpen] = useState(false);
  const [sessionTypeOpen, setSessionTypeOpen] = useState(false);

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

  const hasActiveFilters =
    !!filters.specialty || !!filters.sessionType || filters.acceptingOnly;

  function update(partial: Partial<TherapistFilterState>) {
    onChange({ ...filters, ...partial });
  }

  function clearAll() {
    onChange({ search: filters.search, specialty: null, sessionType: null, acceptingOnly: false });
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 rounded-2xl border border-[#E9E8FF] bg-white px-4 py-3">
        <Search className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          placeholder="Search by name, specialty or keyword..."
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
        <kbd className="hidden shrink-0 rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:block">
          /
        </kbd>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {specialties.length > 0 && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setSpecialtyOpen((o) => !o)}
              className={`flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 text-sm font-medium ${
                filters.specialty
                  ? "border-[#8B5CF6] bg-[#F5F3FF] text-[#6D28D9]"
                  : "border-[#E9E8FF] bg-white text-slate-600"
              }`}
            >
              {filters.specialty ?? "Specialization"}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {specialtyOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSpecialtyOpen(false)} />
                <div className="absolute left-0 top-full z-20 mt-2 max-h-72 w-56 max-w-[calc(100vw-2.5rem)] overflow-y-auto rounded-2xl border border-slate-100 bg-white py-1 shadow-lg">
                  {specialties.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        update({ specialty: filters.specialty === s ? null : s });
                        setSpecialtyOpen(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                        filters.specialty === s ? "text-[#6D28D9]" : "text-slate-600"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {sessionTypes.length > 0 && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setSessionTypeOpen((o) => !o)}
              className={`flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 text-sm font-medium ${
                filters.sessionType
                  ? "border-[#8B5CF6] bg-[#F5F3FF] text-[#6D28D9]"
                  : "border-[#E9E8FF] bg-white text-slate-600"
              }`}
            >
              {filters.sessionType
                ? SESSION_TYPE_LABELS[filters.sessionType] ?? filters.sessionType
                : "Online / In-person"}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {sessionTypeOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSessionTypeOpen(false)} />
                <div className="absolute left-0 top-full z-20 mt-2 w-48 max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-slate-100 bg-white py-1 shadow-lg">
                  {sessionTypes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        update({ sessionType: filters.sessionType === s ? null : s });
                        setSessionTypeOpen(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                        filters.sessionType === s ? "text-[#6D28D9]" : "text-slate-600"
                      }`}
                    >
                      {SESSION_TYPE_LABELS[s] ?? s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => update({ acceptingOnly: !filters.acceptingOnly })}
          className={`flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 text-sm font-medium ${
            filters.acceptingOnly
              ? "border-[#8B5CF6] bg-[#F5F3FF] text-[#6D28D9]"
              : "border-[#E9E8FF] bg-white text-slate-600"
          }`}
        >
          Accepting New Clients
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
