"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, PanelLeftOpen, Plus, Search } from "lucide-react";

import { NAV_ITEMS } from "./navItems";
import { useOptionalChatSidebar } from "@/lib/chatSidebarContext";

export default function DesktopRail() {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const chatSidebar = useOptionalChatSidebar();
  const onCompanionPage = pathname === "/chat";

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

      {onCompanionPage && chatSidebar && (
        <>
          <div className="my-1 h-px w-8 bg-slate-200" />

          <button
            onClick={() => chatSidebar.setIsSidebarOpen((prev) => !prev)}
            title={chatSidebar.isSidebarOpen ? "Collapse conversations" : "Expand conversations"}
            className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl transition ${
              chatSidebar.isSidebarOpen
                ? "bg-slate-100 text-slate-700"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>

          <button
            onClick={() => chatSidebar.triggerNewConversation()}
            title="New conversation"
            className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100"
          >
            <Plus className="h-5 w-5" />
          </button>

          <button
            onClick={() => chatSidebar.setIsSidebarOpen(true)}
            title="Search conversations"
            className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100"
          >
            <Search className="h-5 w-5" />
          </button>
        </>
      )}
    </nav>
  );
}