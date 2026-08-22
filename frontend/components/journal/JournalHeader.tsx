"use client";

import { Search } from "lucide-react";
import { getTimeOfDayGreeting } from "@/components/mood/greeting";

interface JournalHeaderProps {
  firstName: string;
  search: string;
  onSearchChange: (value: string) => void;
}

export default function JournalHeader({
  firstName,
  search,
  onSearchChange,
}: JournalHeaderProps) {
  return (
    <div className="mb-3 shrink-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">
            {getTimeOfDayGreeting()}
            {firstName ? `, ${firstName}` : ""} 
          </h1>
          <p className="text-sm text-slate-500">How are you feeling today?</p>
        </div>
      </div>

      <div className="mt-3 flex min-h-[44px] items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4">
        <Search className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search your reflections..."
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
        <kbd className="hidden shrink-0 rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:block">
          /
        </kbd>
      </div>
    </div>
  );
}
