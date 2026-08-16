"use client";

import { useEffect, useState, type ReactNode } from "react";

import MobileBottomTabs from "./MobileBottomTabs";
import TabletHamburgerNav from "./TabletHamburgerNav";
import DesktopSidebar from "./DesktopSidebar";

interface AppShellProps {
  children: ReactNode;
  // Pages with their own fixed-height, internally-scrolling layout
  // (like Companion) handle bottom-tab-bar clearance themselves and
  // don't want this page-level padding, which assumes normal page
  // scroll.
  noBottomPadding?: boolean;
  // Fully removes the floating mobile tab bar rather than just
  // padding around it -- for genuinely distraction-free full-screen
  // flows (e.g. the Journal writing canvas on mobile) where even a
  // persistent nav affordance competes with focus. Opt-in and rare;
  // most pages should keep the tab bar for orientation.
  hideMobileTabs?: boolean;
}

const SIDEBAR_COLLAPSED_KEY = "adara:sidebar-collapsed";

export default function AppShell({
  children,
  noBottomPadding = false,
  hideMobileTabs = false,
}: AppShellProps) {
  // Default to expanded on first render (matches server-rendered
  // HTML, avoiding a hydration mismatch), then sync with whatever
  // was saved -- AppShell remounts on every page navigation since
  // it's rendered per-page rather than in a shared root layout, so
  // without this the sidebar would snap back to expanded every time
  // you clicked a nav item.
  const [collapsed, setCollapsed] = useState(false);

  // Transitions stay off until one frame after the localStorage
  // correction above has painted. Without this, a saved "collapsed"
  // preference would animate the width/padding transition on every
  // single page load (expanded -> collapsed), which is what caused
  // the sidebar to visually glitch on navigation -- the wide sidebar
  // flashing in and animating down looked like two sidebars
  // overlapping. Only a genuine user click on the toggle should ever
  // animate; syncing from a stored preference should just render
  // correctly the first time.
  const [transitionsEnabled, setTransitionsEnabled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (saved === "true") {
      setCollapsed(true);
    }

    const raf = requestAnimationFrame(() => setTransitionsEnabled(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  }

  return (
    <>
      <TabletHamburgerNav />
      <DesktopSidebar
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
        transitionsEnabled={transitionsEnabled}
      />

      {/* Content offsets: room for the desktop sidebar on the left
          (its width changes with collapsed state), bottom padding on
          mobile so content isn't hidden behind the fixed tab bar. */}
      <div
        className={`w-full ${collapsed ? "lg:pl-20" : "lg:pl-64"} ${
          transitionsEnabled ? "transition-[padding] duration-200" : ""
        } ${noBottomPadding ? "" : "pb-20 md:pb-0"}`}
      >
        {children}
      </div>

      {!hideMobileTabs && <MobileBottomTabs />}
    </>
  );
}