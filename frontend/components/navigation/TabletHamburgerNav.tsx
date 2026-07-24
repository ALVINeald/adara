"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Sparkles as Logo } from "lucide-react";

import { NAV_ITEMS } from "./navItems";

export default function TabletHamburgerNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 hidden rounded-xl bg-white p-2.5 shadow-md md:block lg:hidden"
      >
        <Menu className="h-5 w-5 text-slate-700" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 hidden md:block lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex h-full w-64 flex-col bg-white p-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Logo className="h-5 w-5 text-cyan-600" />
                <span className="text-base font-bold text-slate-900">
                  Adara
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setOpen(false);
                      router.push(item.href);
                    }}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                      active
                        ? "bg-cyan-50 text-cyan-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}