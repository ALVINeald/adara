"use client";

import { useRouter } from "next/navigation";
import {
  BookOpen,
  Waves,
  Wind,
  Users,
} from "lucide-react";

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
    <section className="mb-5 w-full min-w-0 sm:mb-6">
      <h2 className="mb-3 text-lg font-bold tracking-tight text-slate-900 sm:mb-4">
        Continue Your Journey
      </h2>

      <div className="grid w-full min-w-0 grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {SHORTCUTS.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => router.push(item.href)}
              className={[
                "min-w-0 overflow-hidden",
                "rounded-2xl border border-slate-100 bg-white",
                "p-4 text-left",
                "transition-all duration-200",
                "hover:-translate-y-0.5 hover:border-violet-100 hover:shadow-md",
                "active:scale-[0.99]",
                "focus:outline-none focus:ring-2 focus:ring-violet-200 focus:ring-offset-2",
                "sm:p-5",
              ].join(" ")}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bg}`}
              >
                <Icon
                  className={`h-5 w-5 ${item.fg}`}
                  aria-hidden="true"
                />
              </div>

              <p className="mt-3 truncate text-sm font-semibold text-slate-900">
                {item.label}
              </p>

              <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-400">
                {item.sublabel}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}