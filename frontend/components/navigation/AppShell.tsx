"use client";

import type { ReactNode } from "react";

import MobileBottomTabs from "./MobileBottomTabs";
import TabletHamburgerNav from "./TabletHamburgerNav";
import DesktopRail from "./DesktopRail";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <>
      <TabletHamburgerNav />
      <DesktopRail />

      {/* Content offsets: room for the desktop rail on the left,
          bottom padding on mobile so content isn't hidden behind
          the fixed tab bar. */}
      <div className="lg:pl-20 pb-20 md:pb-0">{children}</div>

      <MobileBottomTabs />
    </>
  );
}