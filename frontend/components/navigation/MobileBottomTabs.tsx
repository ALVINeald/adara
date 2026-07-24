"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MoreHorizontal, X } from "lucide-react";

import { NAV_ITEMS, MOBILE_TAB_KEYS } from "./navItems";

export default function MobileBottomTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const tabItems = NAV_ITEMS.filter((item) =>
    MOBILE_TAB_KEYS.includes(item.key)
  );
  const moreItems = NAV_ITEMS.filter(
    (item) => !MOBILE_TAB_KEYS.includes(item.key)
  );

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-lg md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {tabItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <button
                key={item.key}
                onClick={() => router.push(item.href)}
                className="flex flex-col items-center gap-1 rounded-xl px-3 py-1.5"
              >
                <Icon
                  className={`h-5 w-5 ${
                    active ? "text-cyan-600" : "text-slate-400"
                  }`}
                />
                <span
                  className={`text-[10px] font-medium ${
                    active ? "text-cyan-600" : "text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setShowMore(true)}
            className="flex flex-col items-center gap-1 rounded-xl px-3 py-1.5"
          >
            <MoreHorizontal className="h-5 w-5 text-slate-400" />
            <span className="text-[10px] font-medium text-slate-400">
              More
            </span>
          </button>
        </div>
      </nav>

      {showMore && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowMore(false)}
          />
          <div className="relative w-full rounded-t-[28px] bg-white p-5 pb-8">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-base font-semibold text-slate-900">
                More
              </span>
              <button
                onClick={() => setShowMore(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {moreItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setShowMore(false);
                      router.push(item.href);
                    }}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-slate-50"
                  >
                    <Icon className="h-5 w-5 text-cyan-600" />
                    <span className="text-sm font-medium text-slate-800">
                      {item.label}
                    </span>
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