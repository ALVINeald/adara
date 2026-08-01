"use client";

import { useEffect, useState } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { getProfileNamesByIds } from "@/lib/profiles";

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

  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    getProfileNamesByIds([user.id]).then(({ data }) => {
      const fullName = data?.[0]?.full_name;
      if (fullName) {
        setFirstName(fullName.split(" ")[0]);
      }
    });
  }, [user?.id]);

  // Flattened so Wellness's sub-items (Breathing, Sleep, Goals, etc.)
  // are searchable too, not just the 9 top-level items.
  const searchableItems = NAV_ITEMS.flatMap((item) => [
    { label: item.label, href: item.href, icon: item.icon },
    ...(item.subItems ?? []).map((sub) => ({
      label: sub.label,
      href: sub.href,
      icon: item.icon,
    })),
  ]);

  const searchResults =
    searchQuery.trim().length === 0
      ? []
      : searchableItems.filter((item) =>
          item.label.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );

  function goToSearchResult(href: string) {
    setSearchQuery("");
    router.push(href);
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  function handleClick(item: (typeof NAV_ITEMS)[number]) {
    if (item.subItems) {
      if (collapsed) {
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
      className={`fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-slate-800 bg-slate-900 transition-[width] duration-200 lg:flex ${
        collapsed ? "w-20" : "w-64"
      }`}
    >

      {/* Header */}

      <div className="flex items-center justify-between gap-2 p-4">

        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>

          {!collapsed && (
            <span className="truncate text-lg font-bold text-white">
              Adara
            </span>
          )}
        </div>

        <button
          onClick={onToggleCollapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>

      </div>

      {/* Search -- filters real nav destinations (including Wellness
          sub-items), not decorative. */}

      {!collapsed && (
        <div className="relative px-4 pb-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm focus-within:border-violet-500">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-transparent text-slate-200 outline-none placeholder:text-slate-400"
            />
          </div>

          {searchQuery.trim().length > 0 && (
            <div className="absolute left-4 right-4 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border border-slate-700 bg-slate-800 py-1 shadow-xl">
              {searchResults.length === 0 ? (
                <p className="px-3 py-2 text-sm text-slate-400">
                  No matches for &quot;{searchQuery}&quot;
                </p>
              ) : (
                searchResults.map((result) => {
                  const ResultIcon = result.icon;
                  return (
                    <button
                      key={result.href + result.label}
                      onClick={() => goToSearchResult(result.href)}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/5"
                    >
                      <ResultIcon className="h-4 w-4 shrink-0 text-slate-400" />
                      {result.label}
                    </button>
                  );
                })
              )}
            </div>
          )}
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
                    ? "bg-violet-600 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
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
                    } ${active ? "text-white" : "text-slate-500"}`}
                  />
                )}
              </button>

              {!collapsed && isExpanded && item.subItems && (
                <div className="ml-8 mt-1 flex flex-col gap-0.5 border-l border-slate-700 pl-3">
                  {item.subItems.map((sub) => (
                    <button
                      key={sub.href}
                      onClick={() => {
                        setExpandedKey(null);
                        router.push(sub.href);
                      }}
                      className="rounded-lg px-3 py-1.5 text-left text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
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
            <div className="my-2 h-px bg-slate-800" />

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
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
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
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-slate-300 transition hover:bg-white/5 hover:text-white ${
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

      {/* Motivational card -- View Progress routes to /mood, since
          that's the real page where streak/mood history actually
          lives; there's no dedicated standalone "progress" page. */}

      {!collapsed && (
        <div className="mx-3 mb-3 rounded-2xl bg-gradient-to-br from-violet-600/20 to-violet-600/5 p-4">
          <p className="flex items-center gap-1 text-sm text-slate-300">
            You&apos;re doing great, {firstName || "there"}. Keep nurturing your mind.
            <Sparkles className="h-3.5 w-3.5 text-violet-300" aria-hidden="true" />
          </p>
          <button
            onClick={() => router.push("/mood")}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            View Progress
          </button>
        </div>
      )}

      {/* User profile card -- links to the profile info already
          shown elsewhere in the app; there's no dedicated /settings
          page yet, so this intentionally doesn't invent one. */}

      <div className="border-t border-slate-800 p-3">
        <div
          className={`flex items-center gap-3 rounded-xl px-2 py-2 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-sm font-semibold text-violet-300">
            {firstName ? firstName.charAt(0).toUpperCase() : "?"}
          </div>

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {firstName || "..."}
              </p>
            </div>
          )}
        </div>
      </div>

    </nav>
  );
}
