"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PlaylistsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/wellness?section=playlists");
  }, [router]);

  return null;
}
