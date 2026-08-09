import { supabase } from "./supabase";

export interface JournalEntryPayload {
  title: string;
  content: string;
  moodLevel: number | null;
  energyLevel: number | null;
  stressLevel: number | null;
  tags: string[];
  isPrivate: boolean;
  wordCount: number;
}

export async function getJournalEntries(userId: string) {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function createJournalEntry(
  userId: string,
  payload: JournalEntryPayload
) {
  const { data, error } = await supabase
    .from("journal_entries")
    .insert({
      user_id: userId,
      title: payload.title,
      content: payload.content,
      mood_level: payload.moodLevel,
      energy_level: payload.energyLevel,
      stress_level: payload.stressLevel,
      tags: payload.tags,
      is_private: payload.isPrivate,
      word_count: payload.wordCount,
    })
    .select()
    .single();

  return { data, error };
}

export async function updateJournalEntry(
  id: string,
  payload: JournalEntryPayload
) {
  const { data, error } = await supabase
    .from("journal_entries")
    .update({
      title: payload.title,
      content: payload.content,
      mood_level: payload.moodLevel,
      energy_level: payload.energyLevel,
      stress_level: payload.stressLevel,
      tags: payload.tags,
      is_private: payload.isPrivate,
      word_count: payload.wordCount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}

// Soft delete -- keeps a 30-day recovery window instead of destroying
// a private reflection permanently on a single mis-tap. Rows are
// simply excluded from getJournalEntries via the deleted_at filter
// above; a scheduled cleanup job (not part of this change) can hard-
// delete rows past the retention window.
export async function softDeleteJournalEntry(id: string) {
  const { error } = await supabase
    .from("journal_entries")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  return { error };
}

export async function setJournalEntryFavorited(
  id: string,
  isFavorited: boolean
) {
  const { data, error } = await supabase
    .from("journal_entries")
    .update({ is_favorited: isFavorited })
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}
