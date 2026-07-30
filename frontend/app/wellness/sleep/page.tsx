"use client";

import { Moon } from "lucide-react";

import ComingSoonPage from "@/components/shared/ComingSoonPage";

export default function SleepPage() {
  return (
    <ComingSoonPage
      icon={Moon}
      title="Sleep"
      description="Wind-down routines and sleep tracking are on the way."
    />
  );
}
