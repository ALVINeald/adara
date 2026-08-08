"use client";

import { Trophy } from "lucide-react";

import AuthGuard from "@/components/auth/AuthGuard";
import ComingSoonPage from "@/components/shared/ComingSoonPage";

export default function AchievementsPage() {
  return (
    <AuthGuard>
      <ComingSoonPage
        icon={Trophy}
        title="Achievements"
        description="Milestones and badges for your wellness journey are on the way."
      />
    </AuthGuard>
  );
}
