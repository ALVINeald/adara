
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      // Keep the user's session between browser/app visits
      persistSession: true,

      // Refresh the session automatically when necessary
      autoRefreshToken: true,

      // Support returning to the app after authentication
      detectSessionInUrl: true,
    },
  }
);