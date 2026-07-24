"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { NAV_ITEMS } from "./navItems";

export default function DesktopRail() {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  function handleClick(item: (typeof NAV_ITEMS)[number]) {
    if (item.subItems) {
      setExpandedKey(expandedKey === item.key ? null : item.key);
      return;
    }
    router.push(item.href);
  }

  return (
    <nav className="fixed left-0 top-0 z-40 hidden h-screen w-20 flex-col items-center gap-2 border-r border-slate-200 bg-white py-6 lg:flex">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        const isExpanded = expandedKey === item.key;

        return (
          <div key={item.key} className="relative w-full">
            <button
              onClick={() => handleClick(item)}
              title={item.label}
              className={`mx-auto flex h-11 w-11 flex-col items-center justify-center rounded-xl transition ${
                active
                  ? "bg-cyan-600 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-5 w-5" />
            </button>

            {item.subItems && (
              <div className="flex justify-center">
                <ChevronDown
                  className={`h-3 w-3 text-slate-300 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
            )}

            {isExpanded && item.subItems && (
              <div className="absolute left-full top-0 z-50 ml-2 w-52 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200">
                <p className="px-3 py-1.5 text-xs font-semibold text-slate-400">
                  {item.label}
                </p>
                {item.subItems.map((sub) => (
                  <button
                    key={sub.href}
                    onClick={() => {
                      setExpandedKey(null);
                      router.push(sub.href);
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-cyan-50"
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}