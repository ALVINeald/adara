import { supabase } from "./supabase";

export async function getCommunities() {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("name", { ascending: true });

  return { data, error };
}

export async function getMemberships(userId: string) {
  const { data, error } = await supabase
    .from("community_memberships")
    .select("*")
    .eq("user_id", userId);

  return { data, error };
}

// Unscoped by user -- used to derive a real per-community member
// count client-side. Only selects community_id (not full rows) to
// keep the payload light even if membership counts grow.
export async function getAllMembershipCommunityIds() {
  const { data, error } = await supabase
    .from("community_memberships")
    .select("community_id");

  return { data, error };
}

export async function joinCommunity(userId: string, communityId: string) {
  const { data, error } = await supabase
    .from("community_memberships")
    .insert({
      user_id: userId,
      community_id: communityId,
    })
    .select()
    .single();

  return { data, error };
}

export async function leaveCommunity(userId: string, communityId: string) {
  const { error } = await supabase
    .from("community_memberships")
    .delete()
    .eq("user_id", userId)
    .eq("community_id", communityId);

  return { error };
}