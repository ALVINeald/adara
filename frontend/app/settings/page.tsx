"use client";

import { Settings as SettingsIcon } from "lucide-react";

import AuthGuard from "@/components/auth/AuthGuard";
import ComingSoonPage from "@/components/shared/ComingSoonPage";

export default function SettingsPage() {
  return (
    <AuthGuard>
      <ComingSoonPage
        icon={SettingsIcon}
        title="Settings"
        description="Account, notification, and privacy controls are on the way."
      />
    </AuthGuard>
  );
}
