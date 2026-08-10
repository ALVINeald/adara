"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ArticlesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/wellness?section=articles");
  }, [router]);

  return null;
}
