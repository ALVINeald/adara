"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MeditationRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/wellness?section=meditation");
  }, [router]);

  return null;
}
