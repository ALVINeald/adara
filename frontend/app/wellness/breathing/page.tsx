"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// The Breathing experience now lives inside the consolidated Wellness
// Hub at /wellness. This route is kept so existing links (nav menu,
// ContinueJourneyRow on the Mood dashboard) keep working, and just
// forwards into the hub pre-selected to this pillar.
export default function BreathingRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/wellness?section=breathing");
  }, [router]);

  return null;
}
