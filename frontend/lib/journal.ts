import { supabase } from "./supabase";

export async function getJournalEntries(userId: string) {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function createJournalEntry(
  userId: string,
  title: string,
  content: string,
  moodLevel: number | null
) {
  const { data, error } = await supabase
    .from("journal_entries")
    .insert({
      user_id: userId,
      title,
      content,
      mood_level: moodLevel,
    })
    .select()
    .single();

  return { data, error };
}

export async function updateJournalEntry(
  id: string,
  title: string,
  content: string,
  moodLevel: number | null
) {
  const { data, error } = await supabase
    .from("journal_entries")
    .update({
      title,
      content,
      mood_level: moodLevel,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}

export async function deleteJournalEntry(id: string) {
  const { error } = await supabase
    .from("journal_entries")
    .delete()
    .eq("id", id);

  return { error };
}