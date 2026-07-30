"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";

import { NAV_ITEMS } from "./navItems";
import { useOptionalChatSidebar } from "@/lib/chatSidebarContext";

interface DesktopSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export default function DesktopSidebar({
  collapsed,
  onToggleCollapsed,
}: DesktopSidebarProps) {
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
      if (collapsed) {
        // Sub-items need label space -- expand the rail first rather
        // than trying to fit a flyout off a 64px collapsed strip.
        onToggleCollapsed();
        setExpandedKey(item.key);
        return;
      }
      setExpandedKey(expandedKey === item.key ? null : item.key);
      return;
    }
    router.push(item.href);
  }

  return (
    <nav
      className={`fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-slate-200 bg-white transition-[width] duration-200 lg:flex ${
        collapsed ? "w-20" : "w-64"
      }`}
    >

      {/* Header */}

      <div className="flex items-center justify-between gap-2 p-4">

        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>

          {!collapsed && (
            <span className="truncate text-lg font-bold text-slate-900">
              Adara
            </span>
          )}
        </div>

        <button
          onClick={onToggleCollapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>

      </div>

      {/* Search -- visual only for now, not wired to a real search
          feature. Flagging rather than faking functionality behind it. */}

      {!collapsed && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-400">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </div>
        </div>
      )}

      {/* Nav items */}

      <div className="flex-1 overflow-y-auto px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const isExpanded = expandedKey === item.key;

          return (
            <div key={item.key} className="mb-1">

              <button
                onClick={() => handleClick(item)}
                title={collapsed ? item.label : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  collapsed ? "justify-center" : ""
                } ${
                  active
                    ? "bg-cyan-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />

                {!collapsed && (
                  <span className="flex-1 truncate text-sm font-medium">
                    {item.label}
                  </span>
                )}

                {!collapsed && item.subItems && (
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    } ${active ? "text-white" : "text-slate-400"}`}
                  />
                )}
              </button>

              {!collapsed && isExpanded && item.subItems && (
                <div className="ml-8 mt-1 flex flex-col gap-0.5 border-l border-slate-200 pl-3">
                  {item.subItems.map((sub) => (
                    <button
                      key={sub.href}
                      onClick={() => {
                        setExpandedKey(null);
                        router.push(sub.href);
                      }}
                      className="rounded-lg px-3 py-1.5 text-left text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
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
            <div className="my-2 h-px bg-slate-200" />

            <button
              onClick={() =>
                chatSidebar.setIsSidebarOpen((prev) => !prev)
              }
              title={
                collapsed
                  ? chatSidebar.isSidebarOpen
                    ? "Collapse conversations"
                    : "Expand conversations"
                  : undefined
              }
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                collapsed ? "justify-center" : ""
              } ${
                chatSidebar.isSidebarOpen
                  ? "bg-slate-100 text-slate-800"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <PanelLeftOpen className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">Conversations</span>
              )}
            </button>

            <button
              onClick={() => chatSidebar.triggerNewConversation()}
              title={collapsed ? "New conversation" : undefined}
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-slate-600 transition hover:bg-slate-100 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <Plus className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">New chat</span>
              )}
            </button>
          </>
        )}
      </div>

      {/* User profile card -- links to the profile info already
          shown elsewhere in the app; there's no dedicated /settings
          page yet, so this intentionally doesn't invent one. */}

      <div className="border-t border-slate-200 p-3">
        <div
          className={`flex items-center gap-3 rounded-xl px-2 py-2 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-sm font-semibold text-cyan-700">
            A
          </div>

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">
                Alvin
              </p>
            </div>
          )}
        </div>
      </div>

    </nav>
  );
}
