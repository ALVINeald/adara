"use client";

import { Target } from "lucide-react";

import AuthGuard from "@/components/auth/AuthGuard";
import ComingSoonPage from "@/components/shared/ComingSoonPage";

export default function GoalsPage() {
  return (
    <AuthGuard>
      <ComingSoonPage
        icon={Target}
        title="Goals"
        description="Set and track personal wellness goals -- on the way."
      />
    </AuthGuard>
  );
}
