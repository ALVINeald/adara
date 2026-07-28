"use client";

import type { ReactNode } from "react";

import MobileBottomTabs from "./MobileBottomTabs";
import TabletHamburgerNav from "./TabletHamburgerNav";
import DesktopRail from "./DesktopRail";

interface AppShellProps {
  children: ReactNode;
  // Pages with their own fixed-height, internally-scrolling layout
  // (like Companion) handle bottom-tab-bar clearance themselves and
  // don't want this page-level padding, which assumes normal page
  // scroll.
  noBottomPadding?: boolean;
}

export default function AppShell({
  children,
  noBottomPadding = false,
}: AppShellProps) {
  return (
    <>
      <TabletHamburgerNav />
      <DesktopRail />

      {/* Content offsets: room for the desktop rail on the left,
          bottom padding on mobile so content isn't hidden behind
          the fixed tab bar. */}
      <div className={`lg:pl-20 ${noBottomPadding ? "" : "pb-20 md:pb-0"}`}>
        {children}
      </div>

      <MobileBottomTabs />
    </>
  );
}