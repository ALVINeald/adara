import { supabase } from "./supabase";

export async function getProfileNamesByIds(userIds: string[]) {
  if (userIds.length === 0) return { data: [], error: null };

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", userIds);

  return { data, error };
}