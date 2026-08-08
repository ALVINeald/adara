"use client";

import { Moon } from "lucide-react";

import AuthGuard from "@/components/auth/AuthGuard";
import ComingSoonPage from "@/components/shared/ComingSoonPage";

export default function SleepPage() {
  return (
    <AuthGuard>
      <ComingSoonPage
        icon={Moon}
        title="Sleep"
        description="Wind-down routines and sleep tracking are on the way."
      />
    </AuthGuard>
  );
}
