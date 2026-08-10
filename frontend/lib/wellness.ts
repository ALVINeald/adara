import { supabase } from "./supabase";
import type { SavedItemType, WellnessPreferences } from "@/types/wellness";

export async function logWellnessSession(
  userId: string,
  sessionType: "breathing" | "meditation",
  exerciseName: string,
  durationSeconds: number
) {
  const { data, error } = await supabase
    .from("wellness_sessions")
    .insert({
      user_id: userId,
      session_type: sessionType,
      exercise_name: exerciseName,
      duration_seconds: durationSeconds,
    })
    .select()
    .single();

  return { data, error };
}

export async function getWellnessSessions(userId: string) {
  const { data, error } = await supabase
    .from("wellness_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  return { data, error };
}

export async function getSavedWellnessItems(userId: string) {
  const { data, error } = await supabase
    .from("user_saved_wellness_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function addSavedWellnessItem(
  userId: string,
  itemType: SavedItemType,
  itemId: string
) {
  const { data, error } = await supabase
    .from("user_saved_wellness_items")
    .insert({ user_id: userId, item_type: itemType, item_id: itemId })
    .select()
    .single();

  return { data, error };
}

export async function removeSavedWellnessItem(
  userId: string,
  itemType: SavedItemType,
  itemId: string
) {
  const { error } = await supabase
    .from("user_saved_wellness_items")
    .delete()
    .eq("user_id", userId)
    .eq("item_type", itemType)
    .eq("item_id", itemId);

  return { error };
}

export async function getWellnessPreferences(userId: string) {
  const { data, error } = await supabase
    .from("user_wellness_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  return { data, error };
}

export async function upsertWellnessPreferences(
  userId: string,
  preferences: Partial<{
    breathing_pattern_id: string | null;
    breathing_cycles: number | null;
    breathing_custom_phases: WellnessPreferences["breathingCustomPhases"];
  }>
) {
  const { data, error } = await supabase
    .from("user_wellness_preferences")
    .upsert(
      { user_id: userId, ...preferences, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  return { data, error };
}
