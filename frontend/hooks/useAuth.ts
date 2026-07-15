import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { getCurrentUser } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return {
    user,
    loading,
  };
}