"use client";

import { FolderOpen } from "lucide-react";

import AuthGuard from "@/components/auth/AuthGuard";
import ComingSoonPage from "@/components/shared/ComingSoonPage";

export default function ResourcesPage() {
  return (
    <AuthGuard>
      <ComingSoonPage
        icon={FolderOpen}
        title="Resources"
        description="A curated library of guides and support material is on the way."
      />
    </AuthGuard>
  );
}
