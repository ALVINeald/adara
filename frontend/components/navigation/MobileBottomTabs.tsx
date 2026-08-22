"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  Heart,
  MoreHorizontal,
  Sparkles,
  UsersRound,
  Leaf,
  Calendar,
  X,
  ChevronRight,
} from "lucide-react";

const items = [
  {
    label: "Mood",
    href: "/mood",
    icon: Heart,
  },
  {
    label: "Community",
    href: "/communities",
    icon: UsersRound,
  },
  {
    label: "Companion",
    href: "/chat",
    icon: Sparkles,
    center: true,
  },
  {
    label: "Journal",
    href: "/journal",
    icon: BookOpen,
  },
];

const moreItems = [
  {
    label: "Wellness",
    description: "Breathing, meditation, playlists & articles",
    href: "/wellness",
    icon: Leaf,
  },
  {
    label: "Therapists",
    description: "Find professional support and care",
    href: "/therapists",
    icon: Calendar,
  },
];

export default function MobileBottomTabs() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Primary navigation"
        className="fixed inset-x-0 bottom-0 z-50 md:hidden"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div
          className={[
            "relative w-full overflow-hidden",
            "border-t border-white/70",
            "bg-white/70 backdrop-blur-2xl backdrop-saturate-150",
            "shadow-[0_-12px_40px_rgba(44,30,90,0.10)]",
          ].join(" ")}
        >
          {/* Subtle glass tint */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-violet-50/35" />

          <div className="relative mx-auto grid h-[74px] max-w-lg grid-cols-5 px-2">
            {/* FOUR NORMAL TABS */}
            {items.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                (item.href !== "/" &&
                  pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="group flex min-w-0 items-center justify-center"
                >
                  <span
                    className={[
                      "relative flex h-[62px] w-full max-w-[82px]",
                      "flex-col items-center justify-center gap-1",
                      "rounded-2xl",
                      "transition-all duration-200",
                      active
                        ? "bg-violet-100/75 text-violet-600"
                        : "text-slate-400 hover:bg-white/50 hover:text-slate-600",
                    ].join(" ")}
                  >
                    {item.center ? (
                      <span
                        className={[
                          "grid h-11 w-11 place-items-center",
                          "rounded-full border",
                          "transition-all duration-200",
                          active
                            ? [
                                "border-violet-300/80",
                                "bg-white/90",
                                "text-violet-600",
                                "shadow-[0_8px_24px_rgba(109,53,232,0.18)]",
                              ].join(" ")
                            : [
                                "border-white/80",
                                "bg-white/55",
                                "text-slate-500",
                              ].join(" "),
                        ].join(" ")}
                      >
                        <Icon
                          className={[
                            "h-5 w-5 transition-transform duration-200",
                            active
                              ? "scale-105"
                              : "group-hover:scale-105",
                          ].join(" ")}
                        />

                        {active && (
                          <span className="absolute bottom-1 h-1 w-1 rounded-full bg-violet-600" />
                        )}
                      </span>
                    ) : (
                      <>
                        <Icon
                          className="h-5 w-5"
                          strokeWidth={active ? 2.2 : 1.8}
                        />

                        {active && (
                          <span className="absolute bottom-1 h-1 w-1 rounded-full bg-violet-600" />
                        )}
                      </>
                    )}

                    <span
                      className={[
                        "text-[10px] font-medium leading-none",
                        active
                          ? "text-violet-600"
                          : "text-slate-400",
                      ].join(" ")}
                    >
                      {item.label}
                    </span>
                  </span>
                </Link>
              );
            })}

            {/* MORE BUTTON */}
            <button
              type="button"
              aria-label="More options"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((open) => !open)}
              className="group flex min-w-0 items-center justify-center"
            >
              <span
                className={[
                  "relative flex h-[62px] w-full max-w-[82px]",
                  "flex-col items-center justify-center gap-1",
                  "rounded-2xl",
                  "transition-all duration-200",
                  moreOpen
                    ? "bg-violet-100/75 text-violet-600"
                    : "text-slate-400 hover:bg-white/50 hover:text-slate-600",
                ].join(" ")}
              >
                {moreOpen ? (
                  <X
                    className="h-5 w-5"
                    strokeWidth={2}
                  />
                ) : (
                  <MoreHorizontal
                    className="h-5 w-5 transition-transform duration-200 group-hover:scale-105"
                    strokeWidth={1.8}
                  />
                )}

                <span
                  className={[
                    "text-[10px] font-medium leading-none",
                    moreOpen
                      ? "text-violet-600"
                      : "text-slate-400",
                  ].join(" ")}
                >
                  More
                </span>
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* MORE BACKDROP */}
      <div
        className={[
          "fixed inset-0 z-[55] md:hidden",
          "bg-slate-950/20 backdrop-blur-[2px]",
          "transition-opacity duration-200",
          moreOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setMoreOpen(false)}
        aria-hidden="true"
      />

      {/* MORE POPUP */}
      <div
        className={[
          "fixed inset-x-3 bottom-[82px] z-[60] md:hidden",
          "mx-auto max-w-lg",
          "rounded-3xl",
          "border border-white/80",
          "bg-white/95 backdrop-blur-2xl",
          "p-3",
          "shadow-[0_20px_60px_rgba(44,30,90,0.20)]",
          "transition-all duration-200",
          moreOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-[0.98] opacity-0",
        ].join(" ")}
      >
        <div className="px-3 pb-2 pt-1">
          <p className="text-sm font-semibold text-slate-900">
            Explore Adara
          </p>

          <p className="mt-0.5 text-xs text-slate-400">
            More ways to care for yourself
          </p>
        </div>

        <div className="space-y-1">
          {moreItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMoreOpen(false)}
                className={[
                  "flex items-center gap-3 rounded-2xl p-3",
                  "transition-all duration-150",
                  active
                    ? "bg-violet-50"
                    : "hover:bg-slate-50 active:scale-[0.99]",
                ].join(" ")}
              >
                <span
                  className={[
                    "grid h-11 w-11 shrink-0 place-items-center rounded-2xl",
                    active
                      ? "bg-violet-100 text-violet-600"
                      : "bg-slate-100 text-slate-500",
                  ].join(" ")}
                >
                  <Icon
                    className="h-5 w-5"
                    strokeWidth={1.8}
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className={[
                      "block text-sm font-medium",
                      active
                        ? "text-violet-700"
                        : "text-slate-800",
                    ].join(" ")}
                  >
                    {item.label}
                  </span>

                  <span className="mt-0.5 block truncate text-xs text-slate-400">
                    {item.description}
                  </span>
                </span>

                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}