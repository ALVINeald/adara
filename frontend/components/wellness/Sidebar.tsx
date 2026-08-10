"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpenText,
  ChevronRight,
  Clock,
  Headphones,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Wind,
} from "lucide-react";

import { BREATHING_PATTERNS } from "./breathingPatterns";
import { MEDITATION_CATEGORIES } from "./meditationCategories";
import { MEDITATION_PLAYLISTS } from "./playlists";
import { ARTICLES } from "./articles";
import type { SavedWellnessItem, WellnessPillar } from "@/types/wellness";
import type { WellnessSession } from "@/hooks/useWellnessSessions";

const EXPANDED_STORAGE_KEY = "adara:wellness-sidebar-expanded";

interface TreeLeaf {
  id: string;
  label: string;
}

interface TreeBranch {
  pillar: WellnessPillar;
  label: string;
  icon: typeof Wind;
  leaves: TreeLeaf[];
}

function buildTree(): TreeBranch[] {
  const articleTags = Array.from(new Set(ARTICLES.flatMap((a) => a.tags)));

  return [
    {
      pillar: "breathing",
      label: "Breathing Exercises",
      icon: Wind,
      leaves: BREATHING_PATTERNS.map((p) => ({ id: p.id, label: p.name })),
    },
    {
      pillar: "meditation",
      label: "Meditations",
      icon: Sparkles,
      leaves: MEDITATION_CATEGORIES.map((c) => ({ id: c.id, label: c.name })),
    },
    {
      pillar: "playlists",
      label: "Audio & Playlists",
      icon: Headphones,
      leaves: MEDITATION_PLAYLISTS.map((r) => ({ id: r.id, label: r.name })),
    },
    {
      pillar: "articles",
      label: "Curated Articles",
      icon: BookOpenText,
      leaves: articleTags.map((tag) => ({
        id: tag,
        label: tag.replace("-", " ").replace(/^\w/, (c) => c.toUpperCase()),
      })),
    },
  ];
}

const TREE = buildTree();

const LABEL_LOOKUP: Record<string, string> = Object.fromEntries(
  TREE.flatMap((branch) => branch.leaves.map((leaf) => [leaf.id, leaf.label]))
);

interface SidebarProps {
  selection: { pillar: WellnessPillar; leafId: string | null };
  onSelect: (pillar: WellnessPillar, leafId: string | null) => void;
  savedItems: SavedWellnessItem[];
  recentSessions: WellnessSession[];
  onOpenProgress: () => void;
}

export default function Sidebar({
  selection,
  onSelect,
  savedItems,
  recentSessions,
  onOpenProgress,
}: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<WellnessPillar, boolean>>({
    breathing: true,
    meditation: false,
    playlists: false,
    articles: false,
  });
  const [search, setSearch] = useState("");
  const [focusedId, setFocusedId] = useState<string>("branch-breathing");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(EXPANDED_STORAGE_KEY);
      if (raw) setExpanded((prev) => ({ ...prev, ...JSON.parse(raw) }));
    } catch {
      // localStorage unavailable (private browsing, etc.) -- fall back
      // to the default expanded state above rather than erroring.
    }
  }, []);

  function persistExpanded(next: Record<WellnessPillar, boolean>) {
    setExpanded(next);
    try {
      window.localStorage.setItem(EXPANDED_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // best-effort persistence only
    }
  }

  function toggleBranch(pillar: WellnessPillar) {
    persistExpanded({ ...expanded, [pillar]: !expanded[pillar] });
  }

  const query = search.trim().toLowerCase();
  const filteredTree = useMemo(() => {
    if (!query) return TREE;
    return TREE.map((branch) => ({
      ...branch,
      leaves: branch.leaves.filter((leaf) =>
        leaf.label.toLowerCase().includes(query)
      ),
    })).filter(
      (branch) =>
        branch.label.toLowerCase().includes(query) || branch.leaves.length > 0
    );
  }, [query]);

  function handleKeyDown(event: React.KeyboardEvent) {
    const container = containerRef.current;
    if (!container) return;

    const items = Array.from(
      container.querySelectorAll<HTMLElement>("[data-tree-item]")
    );
    const currentIndex = items.findIndex((el) => el.dataset.treeItem === focusedId);
    if (currentIndex === -1) return;

    function focusIndex(index: number) {
      const clamped = Math.max(0, Math.min(items.length - 1, index));
      const target = items[clamped];
      setFocusedId(target.dataset.treeItem ?? focusedId);
      target.focus();
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusIndex(currentIndex + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusIndex(currentIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        focusIndex(0);
        break;
      case "End":
        event.preventDefault();
        focusIndex(items.length - 1);
        break;
      case "ArrowRight": {
        const pillar = items[currentIndex].dataset.pillar as
          | WellnessPillar
          | undefined;
        const isBranch = items[currentIndex].dataset.branch === "true";
        if (isBranch && pillar && !expanded[pillar]) {
          event.preventDefault();
          toggleBranch(pillar);
        } else if (isBranch) {
          event.preventDefault();
          focusIndex(currentIndex + 1);
        }
        break;
      }
      case "ArrowLeft": {
        const pillar = items[currentIndex].dataset.pillar as
          | WellnessPillar
          | undefined;
        const isBranch = items[currentIndex].dataset.branch === "true";
        if (isBranch && pillar && expanded[pillar]) {
          event.preventDefault();
          toggleBranch(pillar);
        } else if (!isBranch) {
          event.preventDefault();
          const branchItem = items.findIndex(
            (el) => el.dataset.pillar === pillar && el.dataset.branch === "true"
          );
          if (branchItem !== -1) focusIndex(branchItem);
        }
        break;
      }
    }
  }

  const favoriteLabels = savedItems.slice(0, 5).map((item) => ({
    ...item,
    label: LABEL_LOOKUP[item.itemId] ?? item.itemId,
  }));

  const recentLabels = Array.from(
    new Map(recentSessions.map((s) => [s.exerciseName, s])).values()
  ).slice(0, 4);

  return (
    <nav
      aria-label="Wellness Hub navigation"
      className="flex h-full w-full flex-col bg-white"
    >
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
          <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search wellness..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div
        ref={containerRef}
        role="tree"
        aria-label="Wellness categories"
        onKeyDown={handleKeyDown}
        className="flex-1 overflow-y-auto px-2 pb-4"
      >
        {filteredTree.map((branch) => {
          const Icon = branch.icon;
          const isExpanded = expanded[branch.pillar] || !!query;
          const isActiveBranch =
            selection.pillar === branch.pillar && !selection.leafId;

          return (
            <div key={branch.pillar} role="group">
              <button
                type="button"
                role="treeitem"
                aria-expanded={isExpanded}
                aria-selected={isActiveBranch}
                data-tree-item={`branch-${branch.pillar}`}
                data-branch="true"
                data-pillar={branch.pillar}
                tabIndex={focusedId === `branch-${branch.pillar}` ? 0 : -1}
                onFocus={() => setFocusedId(`branch-${branch.pillar}`)}
                onClick={() => {
                  onSelect(branch.pillar, null);
                  if (!expanded[branch.pillar]) toggleBranch(branch.pillar);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium transition ${
                  isActiveBranch
                    ? "bg-violet-50 text-violet-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <ChevronRight
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBranch(branch.pillar);
                  }}
                  className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{branch.label}</span>
              </button>

              {isExpanded && (
                <div role="group" className="ml-6 space-y-0.5 border-l border-slate-100 pl-2">
                  {branch.leaves.map((leaf) => {
                    const itemId = `leaf-${branch.pillar}-${leaf.id}`;
                    const isActive =
                      selection.pillar === branch.pillar &&
                      selection.leafId === leaf.id;
                    return (
                      <button
                        key={leaf.id}
                        type="button"
                        role="treeitem"
                        aria-selected={isActive}
                        data-tree-item={itemId}
                        data-pillar={branch.pillar}
                        tabIndex={focusedId === itemId ? 0 : -1}
                        onFocus={() => setFocusedId(itemId)}
                        onClick={() => onSelect(branch.pillar, leaf.id)}
                        className={`block w-full truncate rounded-lg px-2 py-1.5 text-left text-sm transition ${
                          isActive
                            ? "bg-violet-100 font-medium text-violet-700"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                        }`}
                      >
                        {leaf.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(favoriteLabels.length > 0 || recentLabels.length > 0) && (
        <div className="space-y-4 border-t border-slate-100 px-4 py-4">
          {favoriteLabels.length > 0 && (
            <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <Star className="h-3 w-3" />
              Favorites
            </p>
            <div className="space-y-0.5">
              {favoriteLabels.map((item) => {
                const pillarForType: Record<string, WellnessPillar> = {
                  breathing: "breathing",
                  meditation: "meditation",
                  playlist: "playlists",
                  article: "articles",
                };
                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      onSelect(pillarForType[item.itemType], item.itemId)
                    }
                    className="block w-full truncate rounded-lg px-2 py-1 text-left text-xs text-slate-500 hover:bg-slate-50"
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          )}

          {recentLabels.length > 0 && (
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Clock className="h-3 w-3" />
                Recently used
              </p>
              <div className="space-y-0.5">
                {recentLabels.map((session) => (
                  <p
                    key={session.id}
                    className="truncate rounded-lg px-2 py-1 text-xs text-slate-500"
                  >
                    {session.exerciseName}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={onOpenProgress}
        className="mx-4 mb-4 flex items-center justify-center gap-2 rounded-xl bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-100 xl:hidden"
      >
        <TrendingUp className="h-3.5 w-3.5" />
        View progress
      </button>
    </nav>
  );
}
