import { supabase } from "./supabase";

export async function getCommunityMemberNames(communityId: string) {
  const { data, error } = await supabase
    .from("community_memberships")
    .select("user_id, profiles(full_name)")
    .eq("community_id", communityId);

  return { data, error };
}