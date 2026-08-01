"use client";

import { useRouter } from "next/navigation";
import { BookOpen, Waves, Wind, Users } from "lucide-react";

const SHORTCUTS = [
  {
    key: "journal",
    label: "Journal",
    sublabel: "Write your thoughts",
    href: "/journal",
    icon: BookOpen,
    bg: "bg-violet-50",
    fg: "text-violet-600",
  },
  {
    key: "meditation",
    label: "Meditation",
    sublabel: "5 min · Focus",
    href: "/wellness/meditation",
    icon: Waves,
    bg: "bg-emerald-50",
    fg: "text-emerald-600",
  },
  {
    key: "breathing",
    label: "Breathing",
    sublabel: "4-7-8 Technique",
    href: "/wellness/breathing",
    icon: Wind,
    bg: "bg-sky-50",
    fg: "text-sky-600",
  },
  {
    key: "community",
    label: "Community",
    sublabel: "Connect & share",
    href: "/communities",
    icon: Users,
    bg: "bg-orange-50",
    fg: "text-orange-600",
  },
];

export default function ContinueJourneyRow() {
  const router = useRouter();

  return (
    <div className="mb-6">

      <h2 className="mb-4 text-lg font-bold tracking-tight text-slate-900">
        Continue Your Journey
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {SHORTCUTS.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              onClick={() => router.push(item.href)}
              className="rounded-2xl border border-slate-100 bg-white p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-100 hover:shadow-md"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg}`}
              >
                <Icon className={`h-5 w-5 ${item.fg}`} />
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-900">
                {item.label}
              </p>

              <p className="text-xs text-slate-400">{item.sublabel}</p>
            </button>
          );
        })}
      </div>

    </div>
  );
}
